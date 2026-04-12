import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "top_page_pickups" ALTER COLUMN "image_id" DROP NOT NULL;
  CREATE INDEX "news_date_idx" ON "news" USING btree ("date");
  CREATE INDEX "_news_v_version_version_date_idx" ON "_news_v" USING btree ("version_date");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DO $$
  BEGIN
    IF EXISTS (SELECT 1 FROM "top_page_pickups" WHERE "image_id" IS NULL) THEN
      RAISE EXCEPTION 'Cannot restore NOT NULL on top_page_pickups.image_id while null rows exist';
    END IF;
  END $$;
   DROP INDEX "news_date_idx";
  DROP INDEX "_news_v_version_version_date_idx";
  ALTER TABLE "top_page_pickups" ALTER COLUMN "image_id" SET NOT NULL;`)
}
