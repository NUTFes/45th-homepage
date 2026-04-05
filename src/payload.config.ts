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

function getRequiredEnv(key: string): string {
  const value = process.env[key]?.trim();
  const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";
  const isDev = process.env.NODE_ENV === "development";

  if (!value) {
    if (isBuildPhase) {
      if (key === "DATABASE_URL") return "postgres://localhost:5432/dummy";
      return "dummy";
    }
    throw new Error(`Environment variable ${key} is not set`);
  }

  if (/your_|replace_|_here|change_?me|todo/i.test(value)) {
    if (isBuildPhase || isDev) return value;
    throw new Error(
      `Environment variable ${key} contains a placeholder value. Please set a real value in .env`,
    );
  }
  return value;
}

const env = {
  PAYLOAD_SECRET: getRequiredEnv("PAYLOAD_SECRET"),
  DATABASE_URL: getRequiredEnv("DATABASE_URL"),
  S3_BUCKET: getRequiredEnv("S3_BUCKET"),
  S3_ACCESS_KEY_ID: getRequiredEnv("S3_ACCESS_KEY_ID"),
  S3_SECRET_ACCESS_KEY: getRequiredEnv("S3_SECRET_ACCESS_KEY"),
  S3_ENDPOINT: getRequiredEnv("S3_ENDPOINT"),
};

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
  secret: env.PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: env.DATABASE_URL,
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
      bucket: env.S3_BUCKET,
      config: {
        credentials: {
          accessKeyId: env.S3_ACCESS_KEY_ID,
          secretAccessKey: env.S3_SECRET_ACCESS_KEY,
        },
        region: process.env.S3_REGION || "us-east-1",
        endpoint: env.S3_ENDPOINT,
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
