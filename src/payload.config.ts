import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import path from "path";
import { buildConfig } from "payload";
import { en } from "payload/i18n/en";
import { ja } from "payload/i18n/ja";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { TopPage } from "./globals/TopPage";
import { migrations } from "./migrations";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const payloadSecret = process.env.PAYLOAD_SECRET;
const databaseUrl = process.env.DATABASE_URL;
const s3Bucket = process.env.S3_BUCKET;
const s3Endpoint = process.env.S3_ENDPOINT;
const s3AccessKeyId = process.env.S3_ACCESS_KEY_ID;
const s3SecretAccessKey = process.env.S3_SECRET_ACCESS_KEY;

if (!payloadSecret) {
  throw new Error("PAYLOAD_SECRET is required");
}

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

if (!s3Bucket || !s3AccessKeyId || !s3SecretAccessKey || !s3Endpoint) {
  throw new Error(
    "S3_BUCKET, S3_ENDPOINT, S3_ACCESS_KEY_ID, and S3_SECRET_ACCESS_KEY are required",
  );
}

export default buildConfig({
  admin: {
    user: Users.slug,
    dateFormat: "yyyy年MM月dd日 HH:mm",
    importMap: {
      baseDir: path.resolve(dirname),
    },
    autoLogin:
      process.env.NODE_ENV === "development"
        ? {
            email: "dev@nutfes.jp",
            password: "dev",
            prefillOnly: true,
          }
        : false,
  },
  i18n: {
    supportedLanguages: { ja, en },
    fallbackLanguage: "ja",
    translations: {
      ja: {
        general: {
          dashboard: "ホーム",
        },
      },
    },
  },
  collections: [Users, Media],
  globals: [TopPage],
  editor: lexicalEditor(),
  secret: payloadSecret,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: databaseUrl,
    },
    prodMigrations: migrations,
  }),
  sharp,
  plugins: [
    s3Storage({
      enabled: true,
      collections: {
        media: true,
      },
      bucket: s3Bucket!,
      config: {
        credentials: {
          accessKeyId: s3AccessKeyId!,
          secretAccessKey: s3SecretAccessKey!,
        },
        region: process.env.S3_REGION || "us-east-1",
        endpoint: s3Endpoint,
        forcePathStyle: true,
      },
    }),
  ],
  onInit: async (payload) => {
    if (process.env.NODE_ENV === "development") {
      const { totalDocs } = await payload.find({
        collection: "users",
        limit: 0,
      });

      if (totalDocs === 0) {
        await payload.create({
          collection: "users",
          data: {
            email: "dev@nutfes.jp",
            password: "dev",
          },
        });
        payload.logger.info("🔑 Created dev user: dev@nutfes.jp / dev");
      }
    }
  },
});
