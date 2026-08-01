#!/usr/bin/env node

import {
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { createReadStream, createWriteStream } from "node:fs";
import { mkdir, readdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { pipeline } from "node:stream/promises";

function usage() {
  console.error(
    "Usage: media-storage.mjs inventory OUTPUT | download DIR MANIFEST | upload DIR MANIFEST",
  );
  process.exit(2);
}

function requiredEnv(key) {
  const value = process.env[key]?.trim();
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

const bucket = requiredEnv("S3_BUCKET");
const client = new S3Client({
  credentials: {
    accessKeyId: requiredEnv("S3_ACCESS_KEY_ID"),
    secretAccessKey: requiredEnv("S3_SECRET_ACCESS_KEY"),
  },
  endpoint: requiredEnv("S3_ENDPOINT"),
  forcePathStyle: true,
  region: process.env.S3_REGION?.trim() || "us-east-1",
});

function normalizeManifest(value, source) {
  if (!Array.isArray(value)) {
    throw new Error(`${source} does not contain a media manifest array`);
  }

  const manifest = value.map((entry, index) => {
    if (
      typeof entry !== "object" ||
      entry === null ||
      typeof entry.key !== "string" ||
      entry.key.length === 0 ||
      !Number.isSafeInteger(entry.size) ||
      entry.size < 0 ||
      typeof entry.contentType !== "string" ||
      entry.contentType.length === 0
    ) {
      throw new Error(`${source} has an invalid entry at index ${index}`);
    }

    return {
      key: entry.key,
      size: entry.size,
      contentType: entry.contentType,
    };
  });

  manifest.sort((left, right) => (left.key < right.key ? -1 : left.key > right.key ? 1 : 0));
  for (let index = 1; index < manifest.length; index += 1) {
    if (manifest[index - 1].key === manifest[index].key) {
      throw new Error(`${source} contains duplicate key ${JSON.stringify(manifest[index].key)}`);
    }
  }

  return manifest;
}

async function readManifest(file) {
  return normalizeManifest(JSON.parse(await readFile(file, "utf8")), file);
}

async function writeManifest(file, manifest) {
  const temporaryFile = `${file}.tmp-${process.pid}`;
  await mkdir(path.dirname(file), { recursive: true });

  try {
    await writeFile(temporaryFile, `${JSON.stringify(manifest, null, 2)}\n`, {
      flag: "wx",
      mode: 0o600,
    });
    await rename(temporaryFile, file);
  } catch (error) {
    await rm(temporaryFile, { force: true });
    throw error;
  }
}

function resolveObjectPath(root, key) {
  const segments = key.split("/");
  if (
    path.posix.isAbsolute(key) ||
    segments.some((segment) => segment === "" || segment === "." || segment === "..")
  ) {
    throw new Error(`Unsupported media object key ${JSON.stringify(key)}`);
  }

  const resolvedRoot = path.resolve(root);
  const resolvedFile = path.resolve(resolvedRoot, ...segments);
  if (!resolvedFile.startsWith(`${resolvedRoot}${path.sep}`)) {
    throw new Error(`Media object escapes the backup directory: ${JSON.stringify(key)}`);
  }
  return resolvedFile;
}

async function listRemoteManifest() {
  const objects = [];
  let continuationToken;

  do {
    const page = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        ContinuationToken: continuationToken,
      }),
    );

    for (const object of page.Contents ?? []) {
      if (typeof object.Key !== "string" || !Number.isSafeInteger(object.Size)) {
        throw new Error("S3 returned an object without a valid key or size");
      }

      const head = await client.send(
        new HeadObjectCommand({
          Bucket: bucket,
          Key: object.Key,
        }),
      );
      if (head.ContentLength !== object.Size || !head.ContentType) {
        throw new Error(`S3 metadata is incomplete for ${JSON.stringify(object.Key)}`);
      }

      objects.push({
        key: object.Key,
        size: object.Size,
        contentType: head.ContentType,
      });
    }

    continuationToken = page.IsTruncated ? page.NextContinuationToken : undefined;
    if (page.IsTruncated && !continuationToken) {
      throw new Error("S3 pagination did not return a continuation token");
    }
  } while (continuationToken);

  return normalizeManifest(objects, `s3://${bucket}`);
}

async function inventoryDirectory(root) {
  const inventory = [];

  async function visit(relativeDirectory) {
    const directory = path.join(root, relativeDirectory);
    const entries = await readdir(directory, { withFileTypes: true });

    for (const entry of entries) {
      const key = relativeDirectory ? `${relativeDirectory}/${entry.name}` : entry.name;
      const filePath = path.join(root, key);

      if (entry.isDirectory()) {
        await visit(key);
      } else if (entry.isFile()) {
        const metadata = await stat(filePath);
        inventory.push({ key, size: metadata.size });
      } else {
        throw new Error(`Unsupported media entry ${JSON.stringify(key)}`);
      }
    }
  }

  await visit("");
  inventory.sort((left, right) => (left.key < right.key ? -1 : left.key > right.key ? 1 : 0));
  return inventory;
}

function assertLocalFilesMatch(manifest, inventory) {
  const length = Math.max(manifest.length, inventory.length);
  for (let index = 0; index < length; index += 1) {
    if (
      manifest[index]?.key !== inventory[index]?.key ||
      manifest[index]?.size !== inventory[index]?.size
    ) {
      throw new Error(
        `Media file mismatch at index ${index}: expected ${JSON.stringify(manifest[index])}, actual ${JSON.stringify(inventory[index])}`,
      );
    }
  }
}

async function assertRemoteObject(entry) {
  const head = await client.send(
    new HeadObjectCommand({
      Bucket: bucket,
      Key: entry.key,
    }),
  );
  if (head.ContentLength !== entry.size || head.ContentType !== entry.contentType) {
    throw new Error(
      `S3 metadata mismatch for ${JSON.stringify(entry.key)}: expected size=${entry.size}, contentType=${JSON.stringify(entry.contentType)}; actual size=${head.ContentLength}, contentType=${JSON.stringify(head.ContentType)}`,
    );
  }
}

async function download(root, manifestFile) {
  const manifest = await readManifest(manifestFile);
  await mkdir(root, { recursive: true });

  for (const entry of manifest) {
    const outputFile = resolveObjectPath(root, entry.key);
    const temporaryFile = `${outputFile}.part-${process.pid}`;
    await mkdir(path.dirname(outputFile), { recursive: true });

    try {
      const object = await client.send(
        new GetObjectCommand({
          Bucket: bucket,
          Key: entry.key,
        }),
      );
      if (
        !object.Body ||
        typeof object.Body.pipe !== "function" ||
        object.ContentLength !== entry.size ||
        object.ContentType !== entry.contentType
      ) {
        throw new Error(`S3 object does not match its manifest: ${JSON.stringify(entry.key)}`);
      }

      await pipeline(object.Body, createWriteStream(temporaryFile, { flags: "wx", mode: 0o600 }));
      const downloaded = await stat(temporaryFile);
      if (downloaded.size !== entry.size) {
        throw new Error(
          `Downloaded size mismatch for ${JSON.stringify(entry.key)}: expected ${entry.size}, actual ${downloaded.size}`,
        );
      }
      await rename(temporaryFile, outputFile);
    } catch (error) {
      await rm(temporaryFile, { force: true });
      throw error;
    }
  }
}

async function upload(root, manifestFile) {
  const manifest = await readManifest(manifestFile);
  assertLocalFilesMatch(manifest, await inventoryDirectory(root));

  for (const entry of manifest) {
    const inputFile = resolveObjectPath(root, entry.key);
    await client.send(
      new PutObjectCommand({
        Body: createReadStream(inputFile),
        Bucket: bucket,
        ContentLength: entry.size,
        ContentType: entry.contentType,
        Key: entry.key,
      }),
    );
    await assertRemoteObject(entry);
  }
}

const [command, ...args] = process.argv.slice(2);

if (command === "inventory" && args.length === 1) {
  const manifest = await listRemoteManifest();
  await writeManifest(args[0], manifest);
  console.error(`Media manifest written: ${args[0]} (${manifest.length} objects)`);
} else if (command === "download" && args.length === 2) {
  await download(args[0], args[1]);
  console.error(`Media downloaded: ${args[0]}`);
} else if (command === "upload" && args.length === 2) {
  await upload(args[0], args[1]);
  console.error(`Media uploaded and verified: ${args[0]}`);
} else {
  usage();
}
