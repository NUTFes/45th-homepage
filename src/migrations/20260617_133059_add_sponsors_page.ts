import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "sponsors_page_sponsors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"company_name" varchar NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "sponsors_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"thanks_message" varchar DEFAULT '第45回技大祭にご協賛いただき、誠にありがとうございます。' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "sponsors_page_sponsors" ADD CONSTRAINT "sponsors_page_sponsors_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sponsors_page_sponsors" ADD CONSTRAINT "sponsors_page_sponsors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sponsors_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "sponsors_page_sponsors_order_idx" ON "sponsors_page_sponsors" USING btree ("_order");
  CREATE INDEX "sponsors_page_sponsors_parent_id_idx" ON "sponsors_page_sponsors" USING btree ("_parent_id");
  CREATE INDEX "sponsors_page_sponsors_image_idx" ON "sponsors_page_sponsors" USING btree ("image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "sponsors_page_sponsors" CASCADE;
  DROP TABLE "sponsors_page" CASCADE;`)
}
