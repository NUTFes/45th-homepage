import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    WITH "valid_published_programs" AS (
      SELECT
        p."id",
        p."title"
      FROM "programs" p
      WHERE
        p."_status" = 'published'
        AND p."title" IS NOT NULL
        AND BTRIM(p."title") <> ''
        AND EXISTS (
          SELECT 1
          FROM "programs_schedule_items" item
          WHERE item."_parent_id" = p."id"
        )
        AND NOT EXISTS (
          SELECT 1
          FROM "programs_schedule_items" invalid_item
          WHERE
            invalid_item."_parent_id" = p."id"
            AND (
              invalid_item."id" IS NULL
              OR BTRIM(invalid_item."id") = ''
              OR invalid_item."day" IS NULL
              OR invalid_item."weather" IS NULL
              OR invalid_item."start_time" IS NULL
              OR invalid_item."end_time" IS NULL
              OR invalid_item."start_time"::text::time >= invalid_item."end_time"::text::time
            )
        )
        AND NOT EXISTS (
          SELECT 1
          FROM "programs_schedule_items" current_item
          INNER JOIN "programs_schedule_items" next_item
            ON next_item."_parent_id" = current_item."_parent_id"
            AND next_item."_order" > current_item."_order"
          WHERE
            current_item."_parent_id" = p."id"
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
        p."title",
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
      p."id",
      p."title",
      s."id",
      s."day"::text::"enum_timetable_listings_day",
      s."weather"::text::"enum_timetable_listings_weather",
      s."start_time"::text::"enum_timetable_listings_start_time",
      s."end_time"::text::"enum_timetable_listings_end_time",
      '0_unconfigured',
      now(),
      now()
    FROM "valid_published_programs" p
    INNER JOIN "programs_schedule_items" s
      ON s."_parent_id" = p."id"
    ON CONFLICT ("program_id", "schedule_item_id") DO NOTHING;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // This is intentionally non-destructive. Timetable listings can be configured or
  // changed after the backfill, so a data-only rollback must not delete user work.
  // The preceding schema migration owns removal of the timetable tables themselves.
  await db.execute(sql`SELECT 1;`)
}
