import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "programs" ADD COLUMN "show_in_program_list" boolean DEFAULT true NOT NULL;
    ALTER TABLE "_programs_v" ADD COLUMN "version_show_in_program_list" boolean DEFAULT true;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "programs" DROP COLUMN "show_in_program_list";
    ALTER TABLE "_programs_v" DROP COLUMN "version_show_in_program_list";
  `)
}
