import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "sponsors_page_sponsors" ALTER COLUMN "image_id" SET NOT NULL;
  ALTER TABLE "sponsors_page" ADD COLUMN "sponsor_names" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "sponsors_page_sponsors" ALTER COLUMN "image_id" DROP NOT NULL;
  ALTER TABLE "sponsors_page" DROP COLUMN "sponsor_names";`)
}
