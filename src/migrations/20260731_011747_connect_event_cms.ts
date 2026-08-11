import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_programs_tags" AS ENUM('activity', 'watch', 'learning', 'children', 'reservation', 'prize', 'stage', 'laboratory', 'food', 'sweets', 'drink', 'international-food', 'alcohol', 'student', 'corporate', 'with-activity', 'nagaoka-ut-goods');
  CREATE TYPE "public"."enum__programs_v_version_tags" AS ENUM('activity', 'watch', 'learning', 'children', 'reservation', 'prize', 'stage', 'laboratory', 'food', 'sweets', 'drink', 'international-food', 'alcohol', 'student', 'corporate', 'with-activity', 'nagaoka-ut-goods');
  CREATE TABLE "programs_tags" (
    "order" integer NOT NULL,
    "parent_id" integer NOT NULL,
    "value" "enum_programs_tags",
    "id" serial PRIMARY KEY NOT NULL
  );

  CREATE TABLE "_programs_v_version_tags" (
    "order" integer NOT NULL,
    "parent_id" integer NOT NULL,
    "value" "enum__programs_v_version_tags",
    "id" serial PRIMARY KEY NOT NULL
  );

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_program_tags_fk";

  DROP INDEX "payload_locked_documents_rels_program_tags_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "program_tags_id";
  ALTER TABLE "programs_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_programs_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "program_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_page_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "programs_rels" CASCADE;
  DROP TABLE "_programs_v_rels" CASCADE;
  DROP TABLE "program_tags" CASCADE;
  DROP TABLE "events_page_rels" CASCADE;
  ALTER TABLE "programs_tags" ADD CONSTRAINT "programs_tags_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_version_tags" ADD CONSTRAINT "_programs_v_version_tags_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_programs_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "programs_tags_order_idx" ON "programs_tags" USING btree ("order");
  CREATE INDEX "programs_tags_parent_idx" ON "programs_tags" USING btree ("parent_id");
  CREATE INDEX "_programs_v_version_tags_order_idx" ON "_programs_v_version_tags" USING btree ("order");
  CREATE INDEX "_programs_v_version_tags_parent_idx" ON "_programs_v_version_tags" USING btree ("parent_id");
  ALTER TABLE "events_page" ADD COLUMN "guest_ticket_information_status_text" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "events_page" DROP COLUMN "guest_ticket_information_status_text";
   CREATE TABLE "programs_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "program_tags_id" integer
  );

  CREATE TABLE "_programs_v_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "program_tags_id" integer
  );

  CREATE TABLE "program_tags" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "events_page_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "program_tags_id" integer
  );

  ALTER TABLE "programs_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_programs_v_version_tags" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "programs_tags" CASCADE;
  DROP TABLE "_programs_v_version_tags" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "program_tags_id" integer;
  ALTER TABLE "programs_rels" ADD CONSTRAINT "programs_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_rels" ADD CONSTRAINT "programs_rels_program_tags_fk" FOREIGN KEY ("program_tags_id") REFERENCES "public"."program_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_rels" ADD CONSTRAINT "_programs_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_programs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_rels" ADD CONSTRAINT "_programs_v_rels_program_tags_fk" FOREIGN KEY ("program_tags_id") REFERENCES "public"."program_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_page_rels" ADD CONSTRAINT "events_page_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_page_rels" ADD CONSTRAINT "events_page_rels_program_tags_fk" FOREIGN KEY ("program_tags_id") REFERENCES "public"."program_tags"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "programs_rels_order_idx" ON "programs_rels" USING btree ("order");
  CREATE INDEX "programs_rels_parent_idx" ON "programs_rels" USING btree ("parent_id");
  CREATE INDEX "programs_rels_path_idx" ON "programs_rels" USING btree ("path");
  CREATE INDEX "programs_rels_program_tags_id_idx" ON "programs_rels" USING btree ("program_tags_id");
  CREATE INDEX "_programs_v_rels_order_idx" ON "_programs_v_rels" USING btree ("order");
  CREATE INDEX "_programs_v_rels_parent_idx" ON "_programs_v_rels" USING btree ("parent_id");
  CREATE INDEX "_programs_v_rels_path_idx" ON "_programs_v_rels" USING btree ("path");
  CREATE INDEX "_programs_v_rels_program_tags_id_idx" ON "_programs_v_rels" USING btree ("program_tags_id");
  CREATE UNIQUE INDEX "program_tags_name_idx" ON "program_tags" USING btree ("name");
  CREATE INDEX "program_tags_updated_at_idx" ON "program_tags" USING btree ("updated_at");
  CREATE INDEX "program_tags_created_at_idx" ON "program_tags" USING btree ("created_at");
  CREATE INDEX "events_page_rels_order_idx" ON "events_page_rels" USING btree ("order");
  CREATE INDEX "events_page_rels_parent_idx" ON "events_page_rels" USING btree ("parent_id");
  CREATE INDEX "events_page_rels_path_idx" ON "events_page_rels" USING btree ("path");
  CREATE INDEX "events_page_rels_program_tags_id_idx" ON "events_page_rels" USING btree ("program_tags_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_program_tags_fk" FOREIGN KEY ("program_tags_id") REFERENCES "public"."program_tags"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_program_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("program_tags_id");
  DROP TYPE "public"."enum_programs_tags";
  DROP TYPE "public"."enum__programs_v_version_tags";`)
}
