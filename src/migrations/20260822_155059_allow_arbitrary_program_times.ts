import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "programs_schedule_items" ALTER COLUMN "start_time" SET DATA TYPE varchar USING "start_time"::text;
  ALTER TABLE "programs_schedule_items" ALTER COLUMN "end_time" SET DATA TYPE varchar USING "end_time"::text;
  ALTER TABLE "_programs_v_version_schedule_items" ALTER COLUMN "start_time" SET DATA TYPE varchar USING "start_time"::text;
  ALTER TABLE "_programs_v_version_schedule_items" ALTER COLUMN "end_time" SET DATA TYPE varchar USING "end_time"::text;
  ALTER TABLE "timetable_listings" ALTER COLUMN "start_time" SET DATA TYPE varchar USING "start_time"::text;
  ALTER TABLE "timetable_listings" ALTER COLUMN "end_time" SET DATA TYPE varchar USING "end_time"::text;
  DROP TYPE "public"."enum_programs_schedule_items_start_time";
  DROP TYPE "public"."enum_programs_schedule_items_end_time";
  DROP TYPE "public"."enum__programs_v_version_schedule_items_start_time";
  DROP TYPE "public"."enum__programs_v_version_schedule_items_end_time";
  DROP TYPE "public"."enum_timetable_listings_start_time";
  DROP TYPE "public"."enum_timetable_listings_end_time";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DO $$
  BEGIN
    IF EXISTS (
      SELECT 1
      FROM (
        SELECT "start_time"::text AS "value" FROM "programs_schedule_items"
        UNION ALL
        SELECT "end_time"::text AS "value" FROM "programs_schedule_items"
        UNION ALL
        SELECT "start_time"::text AS "value" FROM "_programs_v_version_schedule_items"
        UNION ALL
        SELECT "end_time"::text AS "value" FROM "_programs_v_version_schedule_items"
        UNION ALL
        SELECT "start_time"::text AS "value" FROM "timetable_listings"
        UNION ALL
        SELECT "end_time"::text AS "value" FROM "timetable_listings"
      ) AS "time_values"
      WHERE "value" IS NOT NULL
        AND CASE
          WHEN "value" !~ '^(1[0-9]|20):[0-5][0-9]$' THEN true
          WHEN "value" < '10:00' OR "value" > '20:30' THEN true
          ELSE split_part("value", ':', 2)::integer % 15 <> 0
        END
    ) THEN
      RAISE EXCEPTION 'Cannot restore 15-minute timetable time enums while arbitrary-minute values exist';
    END IF;
  END
  $$;
   CREATE TYPE "public"."enum_programs_schedule_items_start_time" AS ENUM('10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30');
  CREATE TYPE "public"."enum_programs_schedule_items_end_time" AS ENUM('10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30');
  CREATE TYPE "public"."enum__programs_v_version_schedule_items_start_time" AS ENUM('10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30');
  CREATE TYPE "public"."enum__programs_v_version_schedule_items_end_time" AS ENUM('10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30');
  CREATE TYPE "public"."enum_timetable_listings_start_time" AS ENUM('10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30');
  CREATE TYPE "public"."enum_timetable_listings_end_time" AS ENUM('10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30');
  ALTER TABLE "programs_schedule_items" ALTER COLUMN "start_time" SET DATA TYPE "public"."enum_programs_schedule_items_start_time" USING "start_time"::text::"public"."enum_programs_schedule_items_start_time";
  ALTER TABLE "programs_schedule_items" ALTER COLUMN "end_time" SET DATA TYPE "public"."enum_programs_schedule_items_end_time" USING "end_time"::text::"public"."enum_programs_schedule_items_end_time";
  ALTER TABLE "_programs_v_version_schedule_items" ALTER COLUMN "start_time" SET DATA TYPE "public"."enum__programs_v_version_schedule_items_start_time" USING "start_time"::text::"public"."enum__programs_v_version_schedule_items_start_time";
  ALTER TABLE "_programs_v_version_schedule_items" ALTER COLUMN "end_time" SET DATA TYPE "public"."enum__programs_v_version_schedule_items_end_time" USING "end_time"::text::"public"."enum__programs_v_version_schedule_items_end_time";
  ALTER TABLE "timetable_listings" ALTER COLUMN "start_time" SET DATA TYPE "public"."enum_timetable_listings_start_time" USING "start_time"::text::"public"."enum_timetable_listings_start_time";
  ALTER TABLE "timetable_listings" ALTER COLUMN "end_time" SET DATA TYPE "public"."enum_timetable_listings_end_time" USING "end_time"::text::"public"."enum_timetable_listings_end_time";`)
}
