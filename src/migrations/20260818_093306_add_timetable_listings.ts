import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_timetable_listings_day" AS ENUM('day1', 'day2');
  CREATE TYPE "public"."enum_timetable_listings_weather" AS ENUM('both', 'sunny', 'rainy');
  CREATE TYPE "public"."enum_timetable_listings_start_time" AS ENUM('10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30');
  CREATE TYPE "public"."enum_timetable_listings_end_time" AS ENUM('10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30');
  CREATE TYPE "public"."enum_timetable_listings_configuration_status" AS ENUM('0_unconfigured', '1_configured');
  CREATE TABLE "timetable_groups" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar NOT NULL,
    "sort_order" numeric DEFAULT 0 NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "timetable_lanes" (
    "id" serial PRIMARY KEY NOT NULL,
    "timetable_group_id" integer NOT NULL,
    "name" varchar NOT NULL,
    "sort_order" numeric DEFAULT 0 NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "timetable_listings" (
    "id" serial PRIMARY KEY NOT NULL,
    "admin_label" varchar,
    "program_id" integer NOT NULL,
    "program_title" varchar NOT NULL,
    "schedule_item_id" varchar NOT NULL,
    "day" "enum_timetable_listings_day" NOT NULL,
    "weather" "enum_timetable_listings_weather" NOT NULL,
    "start_time" "enum_timetable_listings_start_time" NOT NULL,
    "end_time" "enum_timetable_listings_end_time" NOT NULL,
    "timetable_group_id" integer,
    "timetable_lane_id" integer,
    "configuration_status" "enum_timetable_listings_configuration_status" DEFAULT '0_unconfigured' NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "timetable_groups_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "timetable_lanes_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "timetable_listings_id" integer;
  ALTER TABLE "timetable_lanes" ADD CONSTRAINT "timetable_lanes_timetable_group_id_timetable_groups_id_fk" FOREIGN KEY ("timetable_group_id") REFERENCES "public"."timetable_groups"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "timetable_listings" ADD CONSTRAINT "timetable_listings_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "timetable_listings" ADD CONSTRAINT "timetable_listings_timetable_group_id_timetable_groups_id_fk" FOREIGN KEY ("timetable_group_id") REFERENCES "public"."timetable_groups"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "timetable_listings" ADD CONSTRAINT "timetable_listings_timetable_lane_id_timetable_lanes_id_fk" FOREIGN KEY ("timetable_lane_id") REFERENCES "public"."timetable_lanes"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "timetable_groups_sort_order_idx" ON "timetable_groups" USING btree ("sort_order");
  CREATE INDEX "timetable_groups_is_active_idx" ON "timetable_groups" USING btree ("is_active");
  CREATE INDEX "timetable_groups_updated_at_idx" ON "timetable_groups" USING btree ("updated_at");
  CREATE INDEX "timetable_groups_created_at_idx" ON "timetable_groups" USING btree ("created_at");
  CREATE INDEX "timetable_lanes_timetable_group_idx" ON "timetable_lanes" USING btree ("timetable_group_id");
  CREATE INDEX "timetable_lanes_sort_order_idx" ON "timetable_lanes" USING btree ("sort_order");
  CREATE INDEX "timetable_lanes_is_active_idx" ON "timetable_lanes" USING btree ("is_active");
  CREATE INDEX "timetable_lanes_updated_at_idx" ON "timetable_lanes" USING btree ("updated_at");
  CREATE INDEX "timetable_lanes_created_at_idx" ON "timetable_lanes" USING btree ("created_at");
  CREATE INDEX "timetable_listings_program_idx" ON "timetable_listings" USING btree ("program_id");
  CREATE INDEX "timetable_listings_timetable_group_idx" ON "timetable_listings" USING btree ("timetable_group_id");
  CREATE INDEX "timetable_listings_timetable_lane_idx" ON "timetable_listings" USING btree ("timetable_lane_id");
  CREATE INDEX "timetable_listings_configuration_status_idx" ON "timetable_listings" USING btree ("configuration_status");
  CREATE INDEX "timetable_listings_updated_at_idx" ON "timetable_listings" USING btree ("updated_at");
  CREATE INDEX "timetable_listings_created_at_idx" ON "timetable_listings" USING btree ("created_at");
  CREATE UNIQUE INDEX "program_scheduleItemId_idx" ON "timetable_listings" USING btree ("program_id","schedule_item_id");
  CREATE INDEX "timetableLane_day_startTime_endTime_weather_idx" ON "timetable_listings" USING btree ("timetable_lane_id","day","start_time","end_time","weather");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_timetable_groups_fk" FOREIGN KEY ("timetable_groups_id") REFERENCES "public"."timetable_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_timetable_lanes_fk" FOREIGN KEY ("timetable_lanes_id") REFERENCES "public"."timetable_lanes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_timetable_listings_fk" FOREIGN KEY ("timetable_listings_id") REFERENCES "public"."timetable_listings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_timetable_groups_id_idx" ON "payload_locked_documents_rels" USING btree ("timetable_groups_id");
  CREATE INDEX "payload_locked_documents_rels_timetable_lanes_id_idx" ON "payload_locked_documents_rels" USING btree ("timetable_lanes_id");
  CREATE INDEX "payload_locked_documents_rels_timetable_listings_id_idx" ON "payload_locked_documents_rels" USING btree ("timetable_listings_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_timetable_groups_fk";

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_timetable_lanes_fk";

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_timetable_listings_fk";

  DROP INDEX "payload_locked_documents_rels_timetable_groups_id_idx";
  DROP INDEX "payload_locked_documents_rels_timetable_lanes_id_idx";
  DROP INDEX "payload_locked_documents_rels_timetable_listings_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "timetable_groups_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "timetable_lanes_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "timetable_listings_id";
  DROP TABLE "timetable_listings";
  DROP TABLE "timetable_lanes";
  DROP TABLE "timetable_groups";
  DROP TYPE "public"."enum_timetable_listings_day";
  DROP TYPE "public"."enum_timetable_listings_weather";
  DROP TYPE "public"."enum_timetable_listings_start_time";
  DROP TYPE "public"."enum_timetable_listings_end_time";
  DROP TYPE "public"."enum_timetable_listings_configuration_status";`)
}
