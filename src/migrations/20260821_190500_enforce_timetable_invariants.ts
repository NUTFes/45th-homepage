import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "timetable_listings"
      DROP CONSTRAINT "timetable_listings_timetable_lane_id_timetable_lanes_id_fk";

    ALTER TABLE "timetable_listings"
      ADD CONSTRAINT "timetable_listings_timetable_lane_id_timetable_lanes_id_fk"
      FOREIGN KEY ("timetable_lane_id")
      REFERENCES "public"."timetable_lanes"("id")
      ON DELETE restrict
      ON UPDATE no action;

    ALTER TABLE "timetable_lanes"
      ADD CONSTRAINT "timetable_lanes_id_timetable_group_id_unique"
      UNIQUE ("id", "timetable_group_id");

    ALTER TABLE "timetable_listings"
      ADD CONSTRAINT "timetable_listings_lane_group_fk"
      FOREIGN KEY ("timetable_lane_id", "timetable_group_id")
      REFERENCES "public"."timetable_lanes"("id", "timetable_group_id")
      MATCH SIMPLE
      ON DELETE restrict
      ON UPDATE no action;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "timetable_listings"
      DROP CONSTRAINT "timetable_listings_lane_group_fk";

    ALTER TABLE "timetable_lanes"
      DROP CONSTRAINT "timetable_lanes_id_timetable_group_id_unique";

    ALTER TABLE "timetable_listings"
      DROP CONSTRAINT "timetable_listings_timetable_lane_id_timetable_lanes_id_fk";

    ALTER TABLE "timetable_listings"
      ADD CONSTRAINT "timetable_listings_timetable_lane_id_timetable_lanes_id_fk"
      FOREIGN KEY ("timetable_lane_id")
      REFERENCES "public"."timetable_lanes"("id")
      ON DELETE set null
      ON UPDATE no action;
  `)
}
