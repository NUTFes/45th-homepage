import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE FUNCTION public."news_text_to_lexical"(source_text text)
  RETURNS jsonb
  LANGUAGE sql
  IMMUTABLE
  STRICT
  AS $function$
    SELECT jsonb_build_object(
      'root',
      jsonb_build_object(
        'type', 'root',
        'children',
        COALESCE(
          (
            SELECT jsonb_agg(
              jsonb_build_object(
                'type', 'paragraph',
                'children',
                CASE
                  WHEN line_text = '' THEN '[]'::jsonb
                  ELSE jsonb_build_array(
                    jsonb_build_object(
                      'type', 'text',
                      'detail', 0,
                      'format', 0,
                      'mode', 'normal',
                      'style', '',
                      'text', line_text,
                      'version', 1
                    )
                  )
                END,
                'direction', NULL,
                'format', '',
                'indent', 0,
                'textFormat', 0,
                'textStyle', '',
                'version', 1
              )
              ORDER BY line_number
            )
            FROM regexp_split_to_table(source_text, E'\\r?\\n')
              WITH ORDINALITY AS lines(line_text, line_number)
          ),
          '[]'::jsonb
        ),
        'direction', NULL,
        'format', '',
        'indent', 0,
        'version', 1
      )
    );
  $function$;

  ALTER TABLE "news"
    ALTER COLUMN "body" SET DATA TYPE jsonb
    USING public."news_text_to_lexical"("body"::text);

  ALTER TABLE "_news_v"
    ALTER COLUMN "version_body" SET DATA TYPE jsonb
    USING public."news_text_to_lexical"("version_body"::text);

  DROP FUNCTION public."news_text_to_lexical"(text);
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  CREATE FUNCTION public."news_lexical_node_to_text"(node jsonb)
  RETURNS text
  LANGUAGE plpgsql
  IMMUTABLE
  STRICT
  AS $function$
  DECLARE
    child jsonb;
    result text := '';
  BEGIN
    IF node->>'type' = 'text' THEN
      RETURN COALESCE(node->>'text', '');
    END IF;

    IF node->>'type' = 'linebreak' THEN
      RETURN E'\\n';
    END IF;

    FOR child IN
      SELECT value
      FROM jsonb_array_elements(COALESCE(node->'children', '[]'::jsonb))
    LOOP
      result := result || public."news_lexical_node_to_text"(child);
    END LOOP;

    RETURN result;
  END;
  $function$;

  CREATE FUNCTION public."news_lexical_to_text"(editor_state jsonb)
  RETURNS text
  LANGUAGE sql
  IMMUTABLE
  STRICT
  AS $function$
    SELECT COALESCE(
      string_agg(
        public."news_lexical_node_to_text"(node),
        E'\\n'
        ORDER BY position
      ),
      ''
    )
    FROM jsonb_array_elements(
      COALESCE(editor_state->'root'->'children', '[]'::jsonb)
    ) WITH ORDINALITY AS nodes(node, position);
  $function$;

  ALTER TABLE "news"
    ALTER COLUMN "body" SET DATA TYPE varchar
    USING public."news_lexical_to_text"("body");

  ALTER TABLE "_news_v"
    ALTER COLUMN "version_body" SET DATA TYPE varchar
    USING public."news_lexical_to_text"("version_body");

  DROP FUNCTION public."news_lexical_to_text"(jsonb);
  DROP FUNCTION public."news_lexical_node_to_text"(jsonb);
  `)
}
