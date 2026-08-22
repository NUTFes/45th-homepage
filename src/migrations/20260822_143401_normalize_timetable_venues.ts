import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "timetable_listings"
      DROP CONSTRAINT "timetable_listings_lane_group_fk";

    ALTER TABLE "timetable_lanes"
      DROP CONSTRAINT "timetable_lanes_id_timetable_group_id_unique";

    ALTER TABLE "timetable_listings"
      DROP CONSTRAINT "timetable_listings_timetable_group_id_timetable_groups_id_fk";

    DROP INDEX "timetable_listings_timetable_group_idx";

    ALTER TABLE "timetable_listings"
      DROP COLUMN "timetable_group_id";

    ALTER TABLE "timetable_lanes"
      ALTER COLUMN "timetable_group_id" DROP NOT NULL;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1
        FROM "timetable_lanes"
        WHERE "timetable_group_id" IS NULL
      ) THEN
        RAISE EXCEPTION 'Cannot restore required timetable lane groups while ungrouped lanes exist';
      END IF;
    END
    $$;

    ALTER TABLE "timetable_listings"
      ADD COLUMN "timetable_group_id" integer;

    UPDATE "timetable_listings" AS "listing"
    SET "timetable_group_id" = "lane"."timetable_group_id"
    FROM "timetable_lanes" AS "lane"
    WHERE "listing"."timetable_lane_id" = "lane"."id";

    ALTER TABLE "timetable_listings"
      ADD CONSTRAINT "timetable_listings_timetable_group_id_timetable_groups_id_fk"
      FOREIGN KEY ("timetable_group_id")
      REFERENCES "public"."timetable_groups"("id")
      ON DELETE set null
      ON UPDATE no action;

    CREATE INDEX "timetable_listings_timetable_group_idx"
      ON "timetable_listings" USING btree ("timetable_group_id");

    ALTER TABLE "timetable_lanes"
      ALTER COLUMN "timetable_group_id" SET NOT NULL;

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
