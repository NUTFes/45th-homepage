import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_programs_schedule_items_weather" AS ENUM('both', 'sunny', 'rainy');
  CREATE TYPE "public"."enum_programs_schedule_items_day" AS ENUM('day1', 'day2');
  CREATE TYPE "public"."enum_programs_schedule_items_start_time" AS ENUM('10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30');
  CREATE TYPE "public"."enum_programs_schedule_items_end_time" AS ENUM('10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30');
  CREATE TYPE "public"."enum_programs_category" AS ENUM('program', 'exhibition', 'food', 'goods', 'corporate');
  CREATE TYPE "public"."enum_programs_area" AS ENUM('lecture', 'gym', 'outdoor', 'kitchen_car', 'other');
  CREATE TYPE "public"."enum_programs_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__programs_v_version_schedule_items_weather" AS ENUM('both', 'sunny', 'rainy');
  CREATE TYPE "public"."enum__programs_v_version_schedule_items_day" AS ENUM('day1', 'day2');
  CREATE TYPE "public"."enum__programs_v_version_schedule_items_start_time" AS ENUM('10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30');
  CREATE TYPE "public"."enum__programs_v_version_schedule_items_end_time" AS ENUM('10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30');
  CREATE TYPE "public"."enum__programs_v_version_category" AS ENUM('program', 'exhibition', 'food', 'goods', 'corporate');
  CREATE TYPE "public"."enum__programs_v_version_area" AS ENUM('lecture', 'gym', 'outdoor', 'kitchen_car', 'other');
  CREATE TYPE "public"."enum__programs_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_weather_settings_weather" AS ENUM('sunny', 'rainy');
  CREATE TABLE "programs_schedule_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"weather" "enum_programs_schedule_items_weather",
  	"day" "enum_programs_schedule_items_day",
  	"start_time" "enum_programs_schedule_items_start_time",
  	"end_time" "enum_programs_schedule_items_end_time"
  );
  
  CREATE TABLE "programs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"admin_label" varchar,
  	"title" varchar,
  	"category" "enum_programs_category",
  	"area" "enum_programs_area",
  	"location_name" varchar,
  	"image_id" integer,
  	"map_image_id" integer,
  	"catchphrase" varchar,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_programs_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "programs_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"program_tags_id" integer
  );
  
  CREATE TABLE "_programs_v_version_schedule_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"weather" "enum__programs_v_version_schedule_items_weather",
  	"day" "enum__programs_v_version_schedule_items_day",
  	"start_time" "enum__programs_v_version_schedule_items_start_time",
  	"end_time" "enum__programs_v_version_schedule_items_end_time",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_programs_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_admin_label" varchar,
  	"version_title" varchar,
  	"version_category" "enum__programs_v_version_category",
  	"version_area" "enum__programs_v_version_area",
  	"version_location_name" varchar,
  	"version_image_id" integer,
  	"version_map_image_id" integer,
  	"version_catchphrase" varchar,
  	"version_description" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__programs_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
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
  
  CREATE TABLE "events_page_program_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"program_id" integer,
  	"program_label" varchar
  );
  
  CREATE TABLE "events_page_exhibition_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"program_id" integer,
  	"program_label" varchar
  );
  
  CREATE TABLE "events_page_food_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"program_id" integer,
  	"program_label" varchar
  );
  
  CREATE TABLE "events_page_goods_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"program_id" integer,
  	"program_label" varchar
  );
  
  CREATE TABLE "events_page_corporate_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"program_id" integer,
  	"program_label" varchar
  );
  
  CREATE TABLE "events_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "events_page_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"program_tags_id" integer
  );
  
  CREATE TABLE "weather_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"weather" "enum_weather_settings_weather" DEFAULT 'sunny' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "programs_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "program_tags_id" integer;
  ALTER TABLE "programs_schedule_items" ADD CONSTRAINT "programs_schedule_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs" ADD CONSTRAINT "programs_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs" ADD CONSTRAINT "programs_map_image_id_media_id_fk" FOREIGN KEY ("map_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_rels" ADD CONSTRAINT "programs_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_rels" ADD CONSTRAINT "programs_rels_program_tags_fk" FOREIGN KEY ("program_tags_id") REFERENCES "public"."program_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_version_schedule_items" ADD CONSTRAINT "_programs_v_version_schedule_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v" ADD CONSTRAINT "_programs_v_parent_id_programs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."programs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v" ADD CONSTRAINT "_programs_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v" ADD CONSTRAINT "_programs_v_version_map_image_id_media_id_fk" FOREIGN KEY ("version_map_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_rels" ADD CONSTRAINT "_programs_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_programs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_rels" ADD CONSTRAINT "_programs_v_rels_program_tags_fk" FOREIGN KEY ("program_tags_id") REFERENCES "public"."program_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_page_program_items" ADD CONSTRAINT "events_page_program_items_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_page_program_items" ADD CONSTRAINT "events_page_program_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_page_exhibition_items" ADD CONSTRAINT "events_page_exhibition_items_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_page_exhibition_items" ADD CONSTRAINT "events_page_exhibition_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_page_food_items" ADD CONSTRAINT "events_page_food_items_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_page_food_items" ADD CONSTRAINT "events_page_food_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_page_goods_items" ADD CONSTRAINT "events_page_goods_items_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_page_goods_items" ADD CONSTRAINT "events_page_goods_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_page_corporate_items" ADD CONSTRAINT "events_page_corporate_items_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_page_corporate_items" ADD CONSTRAINT "events_page_corporate_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_page_rels" ADD CONSTRAINT "events_page_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_page_rels" ADD CONSTRAINT "events_page_rels_program_tags_fk" FOREIGN KEY ("program_tags_id") REFERENCES "public"."program_tags"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "programs_schedule_items_order_idx" ON "programs_schedule_items" USING btree ("_order");
  CREATE INDEX "programs_schedule_items_parent_id_idx" ON "programs_schedule_items" USING btree ("_parent_id");
  CREATE INDEX "programs_image_idx" ON "programs" USING btree ("image_id");
  CREATE INDEX "programs_map_image_idx" ON "programs" USING btree ("map_image_id");
  CREATE INDEX "programs_updated_at_idx" ON "programs" USING btree ("updated_at");
  CREATE INDEX "programs_created_at_idx" ON "programs" USING btree ("created_at");
  CREATE INDEX "programs__status_idx" ON "programs" USING btree ("_status");
  CREATE INDEX "programs_rels_order_idx" ON "programs_rels" USING btree ("order");
  CREATE INDEX "programs_rels_parent_idx" ON "programs_rels" USING btree ("parent_id");
  CREATE INDEX "programs_rels_path_idx" ON "programs_rels" USING btree ("path");
  CREATE INDEX "programs_rels_program_tags_id_idx" ON "programs_rels" USING btree ("program_tags_id");
  CREATE INDEX "_programs_v_version_schedule_items_order_idx" ON "_programs_v_version_schedule_items" USING btree ("_order");
  CREATE INDEX "_programs_v_version_schedule_items_parent_id_idx" ON "_programs_v_version_schedule_items" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_parent_idx" ON "_programs_v" USING btree ("parent_id");
  CREATE INDEX "_programs_v_version_version_image_idx" ON "_programs_v" USING btree ("version_image_id");
  CREATE INDEX "_programs_v_version_version_map_image_idx" ON "_programs_v" USING btree ("version_map_image_id");
  CREATE INDEX "_programs_v_version_version_updated_at_idx" ON "_programs_v" USING btree ("version_updated_at");
  CREATE INDEX "_programs_v_version_version_created_at_idx" ON "_programs_v" USING btree ("version_created_at");
  CREATE INDEX "_programs_v_version_version__status_idx" ON "_programs_v" USING btree ("version__status");
  CREATE INDEX "_programs_v_created_at_idx" ON "_programs_v" USING btree ("created_at");
  CREATE INDEX "_programs_v_updated_at_idx" ON "_programs_v" USING btree ("updated_at");
  CREATE INDEX "_programs_v_latest_idx" ON "_programs_v" USING btree ("latest");
  CREATE INDEX "_programs_v_rels_order_idx" ON "_programs_v_rels" USING btree ("order");
  CREATE INDEX "_programs_v_rels_parent_idx" ON "_programs_v_rels" USING btree ("parent_id");
  CREATE INDEX "_programs_v_rels_path_idx" ON "_programs_v_rels" USING btree ("path");
  CREATE INDEX "_programs_v_rels_program_tags_id_idx" ON "_programs_v_rels" USING btree ("program_tags_id");
  CREATE UNIQUE INDEX "program_tags_name_idx" ON "program_tags" USING btree ("name");
  CREATE INDEX "program_tags_updated_at_idx" ON "program_tags" USING btree ("updated_at");
  CREATE INDEX "program_tags_created_at_idx" ON "program_tags" USING btree ("created_at");
  CREATE INDEX "events_page_program_items_order_idx" ON "events_page_program_items" USING btree ("_order");
  CREATE INDEX "events_page_program_items_parent_id_idx" ON "events_page_program_items" USING btree ("_parent_id");
  CREATE INDEX "events_page_program_items_program_idx" ON "events_page_program_items" USING btree ("program_id");
  CREATE INDEX "events_page_exhibition_items_order_idx" ON "events_page_exhibition_items" USING btree ("_order");
  CREATE INDEX "events_page_exhibition_items_parent_id_idx" ON "events_page_exhibition_items" USING btree ("_parent_id");
  CREATE INDEX "events_page_exhibition_items_program_idx" ON "events_page_exhibition_items" USING btree ("program_id");
  CREATE INDEX "events_page_food_items_order_idx" ON "events_page_food_items" USING btree ("_order");
  CREATE INDEX "events_page_food_items_parent_id_idx" ON "events_page_food_items" USING btree ("_parent_id");
  CREATE INDEX "events_page_food_items_program_idx" ON "events_page_food_items" USING btree ("program_id");
  CREATE INDEX "events_page_goods_items_order_idx" ON "events_page_goods_items" USING btree ("_order");
  CREATE INDEX "events_page_goods_items_parent_id_idx" ON "events_page_goods_items" USING btree ("_parent_id");
  CREATE INDEX "events_page_goods_items_program_idx" ON "events_page_goods_items" USING btree ("program_id");
  CREATE INDEX "events_page_corporate_items_order_idx" ON "events_page_corporate_items" USING btree ("_order");
  CREATE INDEX "events_page_corporate_items_parent_id_idx" ON "events_page_corporate_items" USING btree ("_parent_id");
  CREATE INDEX "events_page_corporate_items_program_idx" ON "events_page_corporate_items" USING btree ("program_id");
  CREATE INDEX "events_page_rels_order_idx" ON "events_page_rels" USING btree ("order");
  CREATE INDEX "events_page_rels_parent_idx" ON "events_page_rels" USING btree ("parent_id");
  CREATE INDEX "events_page_rels_path_idx" ON "events_page_rels" USING btree ("path");
  CREATE INDEX "events_page_rels_program_tags_id_idx" ON "events_page_rels" USING btree ("program_tags_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_programs_fk" FOREIGN KEY ("programs_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_program_tags_fk" FOREIGN KEY ("program_tags_id") REFERENCES "public"."program_tags"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_programs_id_idx" ON "payload_locked_documents_rels" USING btree ("programs_id");
  CREATE INDEX "payload_locked_documents_rels_program_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("program_tags_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "programs_schedule_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "programs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "programs_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_programs_v_version_schedule_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_programs_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_programs_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "program_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_page_program_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_page_exhibition_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_page_food_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_page_goods_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_page_corporate_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_page_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "weather_settings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "programs_schedule_items" CASCADE;
  DROP TABLE "programs" CASCADE;
  DROP TABLE "programs_rels" CASCADE;
  DROP TABLE "_programs_v_version_schedule_items" CASCADE;
  DROP TABLE "_programs_v" CASCADE;
  DROP TABLE "_programs_v_rels" CASCADE;
  DROP TABLE "program_tags" CASCADE;
  DROP TABLE "events_page_program_items" CASCADE;
  DROP TABLE "events_page_exhibition_items" CASCADE;
  DROP TABLE "events_page_food_items" CASCADE;
  DROP TABLE "events_page_goods_items" CASCADE;
  DROP TABLE "events_page_corporate_items" CASCADE;
  DROP TABLE "events_page" CASCADE;
  DROP TABLE "events_page_rels" CASCADE;
  DROP TABLE "weather_settings" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_programs_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_program_tags_fk";
  
  DROP INDEX "payload_locked_documents_rels_programs_id_idx";
  DROP INDEX "payload_locked_documents_rels_program_tags_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "programs_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "program_tags_id";
  DROP TYPE "public"."enum_programs_schedule_items_weather";
  DROP TYPE "public"."enum_programs_schedule_items_day";
  DROP TYPE "public"."enum_programs_schedule_items_start_time";
  DROP TYPE "public"."enum_programs_schedule_items_end_time";
  DROP TYPE "public"."enum_programs_category";
  DROP TYPE "public"."enum_programs_area";
  DROP TYPE "public"."enum_programs_status";
  DROP TYPE "public"."enum__programs_v_version_schedule_items_weather";
  DROP TYPE "public"."enum__programs_v_version_schedule_items_day";
  DROP TYPE "public"."enum__programs_v_version_schedule_items_start_time";
  DROP TYPE "public"."enum__programs_v_version_schedule_items_end_time";
  DROP TYPE "public"."enum__programs_v_version_category";
  DROP TYPE "public"."enum__programs_v_version_area";
  DROP TYPE "public"."enum__programs_v_version_status";
  DROP TYPE "public"."enum_weather_settings_weather";`)
}
