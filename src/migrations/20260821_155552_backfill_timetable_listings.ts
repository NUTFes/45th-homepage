import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    WITH "valid_program_versions" AS (
      SELECT
        v."id",
        v."parent_id",
        v."version_title"
      FROM "_programs_v" v
      WHERE
        v."latest" IS TRUE
        AND v."parent_id" IS NOT NULL
        AND v."version_title" IS NOT NULL
        AND BTRIM(v."version_title") <> ''
        AND NOT EXISTS (
          SELECT 1
          FROM "_programs_v_version_schedule_items" invalid_item
          WHERE
            invalid_item."_parent_id" = v."id"
            AND (
              invalid_item."_uuid" IS NULL
              OR BTRIM(invalid_item."_uuid") = ''
              OR invalid_item."day" IS NULL
              OR invalid_item."weather" IS NULL
              OR invalid_item."start_time" IS NULL
              OR invalid_item."end_time" IS NULL
              OR invalid_item."start_time"::text::time >= invalid_item."end_time"::text::time
            )
        )
        AND NOT EXISTS (
          SELECT 1
          FROM "_programs_v_version_schedule_items" current_item
          INNER JOIN "_programs_v_version_schedule_items" next_item
            ON next_item."_parent_id" = current_item."_parent_id"
            AND next_item."id" > current_item."id"
          WHERE
            current_item."_parent_id" = v."id"
            AND current_item."_uuid" = next_item."_uuid"
        )
        AND NOT EXISTS (
          SELECT 1
          FROM "_programs_v_version_schedule_items" current_item
          INNER JOIN "_programs_v_version_schedule_items" next_item
            ON next_item."_parent_id" = current_item."_parent_id"
            AND next_item."id" > current_item."id"
          WHERE
            current_item."_parent_id" = v."id"
            AND current_item."day" = next_item."day"
            AND current_item."start_time"::text::time < next_item."end_time"::text::time
            AND next_item."start_time"::text::time < current_item."end_time"::text::time
            AND (
              current_item."weather"::text = 'both'
              OR next_item."weather"::text = 'both'
              OR current_item."weather" = next_item."weather"
            )
        )
    )
    INSERT INTO "timetable_listings" (
      "admin_label",
      "program_id",
      "program_title",
      "schedule_item_id",
      "day",
      "weather",
      "start_time",
      "end_time",
      "configuration_status",
      "updated_at",
      "created_at"
    )
    SELECT
      CONCAT(
        v."version_title",
        ' / ',
        CASE s."day"::text
          WHEN 'day1' THEN '1日目（9/19 土）'
          WHEN 'day2' THEN '2日目（9/20 日）'
        END,
        ' ',
        s."start_time"::text,
        '-',
        s."end_time"::text,
        ' / ',
        CASE s."weather"::text
          WHEN 'both' THEN '晴れ・雨 共通'
          WHEN 'sunny' THEN '晴れのみ'
          WHEN 'rainy' THEN '雨のみ'
        END
      ),
      v."parent_id",
      v."version_title",
      s."_uuid",
      s."day"::text::"enum_timetable_listings_day",
      s."weather"::text::"enum_timetable_listings_weather",
      s."start_time"::text::"enum_timetable_listings_start_time",
      s."end_time"::text::"enum_timetable_listings_end_time",
      '0_unconfigured',
      now(),
      now()
    FROM "valid_program_versions" v
    INNER JOIN "_programs_v_version_schedule_items" s
      ON s."_parent_id" = v."id"
    ON CONFLICT ("program_id", "schedule_item_id") DO NOTHING;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // This is intentionally non-destructive. Timetable listings can be configured or
  // changed after the backfill, so a data-only rollback must not delete user work.
  // The preceding schema migration owns removal of the timetable tables themselves.
  await db.execute(sql`SELECT 1;`)
}
