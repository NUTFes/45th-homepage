#!/usr/bin/env node

import { readdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";

function usage() {
  console.error("Usage: media-inventory.mjs directory DIR OUTPUT | compare EXPECTED ACTUAL");
  process.exit(2);
}

function normalizeInventory(value, source) {
  if (value === null) {
    return [];
  }
  if (!Array.isArray(value)) {
    throw new Error(`${source} does not contain an inventory array`);
  }

  const inventory = value.map((entry, index) => {
    if (
      typeof entry !== "object" ||
      entry === null ||
      typeof entry.key !== "string" ||
      !Number.isSafeInteger(entry.size) ||
      entry.size < 0
    ) {
      throw new Error(`${source} has an invalid entry at index ${index}`);
    }
    return { key: entry.key, size: entry.size };
  });

  inventory.sort((left, right) => (left.key < right.key ? -1 : left.key > right.key ? 1 : 0));
  for (let index = 1; index < inventory.length; index += 1) {
    if (inventory[index - 1].key === inventory[index].key) {
      throw new Error(`${source} contains duplicate key ${JSON.stringify(inventory[index].key)}`);
    }
  }
  return inventory;
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
  return normalizeInventory(inventory, root);
}

async function readInventory(file) {
  return normalizeInventory(JSON.parse(await readFile(file, "utf8")), file);
}

async function writeInventory(file, inventory) {
  const temporaryFile = `${file}.tmp-${process.pid}`;
  try {
    await writeFile(temporaryFile, `${JSON.stringify(inventory, null, 2)}\n`, {
      flag: "wx",
    });
    await rename(temporaryFile, file);
  } catch (error) {
    await rm(temporaryFile, { force: true });
    throw error;
  }
}

function compareInventories(expected, actual) {
  const length = Math.max(expected.length, actual.length);
  for (let index = 0; index < length; index += 1) {
    const expectedEntry = expected[index];
    const actualEntry = actual[index];
    if (expectedEntry?.key !== actualEntry?.key || expectedEntry?.size !== actualEntry?.size) {
      throw new Error(
        `Media inventory mismatch at index ${index}: expected ${JSON.stringify(expectedEntry)}, actual ${JSON.stringify(actualEntry)}`,
      );
    }
  }

  const bytes = expected.reduce((total, entry) => total + BigInt(entry.size), 0n);
  return { objects: expected.length, bytes };
}

const [command, ...args] = process.argv.slice(2);

if (command === "directory" && args.length === 2) {
  const [directory, output] = args;
  const inventory = await inventoryDirectory(directory);
  await writeInventory(output, inventory);
  console.error(`Inventory written: ${output} (${inventory.length} objects)`);
} else if (command === "compare" && args.length === 2) {
  const [expectedFile, actualFile] = args;
  const result = compareInventories(
    await readInventory(expectedFile),
    await readInventory(actualFile),
  );
  console.log(`${result.objects}\t${result.bytes}`);
} else {
  usage();
}
