import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_news_important" AS ENUM('normal', 'important');
  CREATE TYPE "public"."enum__news_v_version_important" AS ENUM('normal', 'important');
  ALTER TABLE "news" ADD COLUMN "important" "enum_news_important" DEFAULT 'normal';
  ALTER TABLE "_news_v" ADD COLUMN "version_important" "enum__news_v_version_important" DEFAULT 'normal';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "news" DROP COLUMN "important";
  ALTER TABLE "_news_v" DROP COLUMN "version_important";
  DROP TYPE "public"."enum_news_important";
  DROP TYPE "public"."enum__news_v_version_important";`)
}
