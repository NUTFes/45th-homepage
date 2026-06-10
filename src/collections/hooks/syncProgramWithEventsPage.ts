import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload";

import {
  PROGRAM_CATEGORY_ITEM_FIELDS,
  type ProgramCategory,
  type ProgramCategoryItemField,
} from "@/lib/events/constants";
import {
  getProgramOrderRowProgramId,
  relationshipIdKey,
  type ProgramOrderRowInput,
  type RelationshipId,
} from "@/lib/events/validation";

const categoryItemFields = Object.values(
  PROGRAM_CATEGORY_ITEM_FIELDS,
) as ProgramCategoryItemField[];

type EventsPageItems = Partial<Record<ProgramCategoryItemField, unknown>>;

type ProgramForEventsPageSync = {
  id: RelationshipId;
  adminLabel?: string | null;
  category: string;
  title?: string | null;
  _status?: "draft" | "published" | null;
};

type ProgramOrderRow = ProgramOrderRowInput & {
  program: RelationshipId;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const getProgramLabel = (program: ProgramForEventsPageSync) =>
  program.adminLabel || program.title || "企画名未設定";

const getRows = (
  eventsPage: Partial<EventsPageItems>,
  field: ProgramCategoryItemField,
): ProgramOrderRow[] => {
  const value = eventsPage[field];
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((row) => {
    const programId = getProgramOrderRowProgramId(row);
    if (programId === null) {
      return [];
    }

    return [
      {
        ...(isRecord(row) ? row : {}),
        program: programId,
      },
    ];
  });
};

const sameRows = (a: ProgramOrderRow[], b: ProgramOrderRow[]) => {
  if (a.length !== b.length) return false;

  return a.every((row, index) => {
    const nextRow = b[index];
    return (
      relationshipIdKey(row.program) === relationshipIdKey(nextRow.program) &&
      row.programLabel === nextRow.programLabel
    );
  });
};

const findProgramField = (eventsPage: Partial<EventsPageItems>, programId: RelationshipId) => {
  const targetKey = relationshipIdKey(programId);

  return categoryItemFields.find((field) =>
    getRows(eventsPage, field).some((row) => relationshipIdKey(row.program) === targetKey),
  );
};

const removeProgramFromAllFields = (
  eventsPage: Partial<EventsPageItems>,
  programId: RelationshipId,
) => {
  const targetKey = relationshipIdKey(programId);
  const next: Partial<Record<ProgramCategoryItemField, ProgramOrderRow[]>> = {};

  for (const field of categoryItemFields) {
    next[field] = getRows(eventsPage, field).filter(
      (row) => relationshipIdKey(row.program) !== targetKey,
    );
  }

  return next;
};

const hasEventsPageChanged = (
  current: Partial<EventsPageItems>,
  next: Partial<Record<ProgramCategoryItemField, ProgramOrderRow[]>>,
) =>
  categoryItemFields.some((field) => {
    const currentValue = current[field];
    const currentRowCount = Array.isArray(currentValue) ? currentValue.length : 0;
    const nextRows = next[field] ?? [];

    return currentRowCount !== nextRows.length || !sameRows(getRows(current, field), nextRows);
  });

const toPayloadRows = (data: Partial<Record<ProgramCategoryItemField, ProgramOrderRow[]>>) => {
  const next: Partial<
    Record<
      ProgramCategoryItemField,
      Array<{ id?: string | null; program: number; programLabel?: string | null }>
    >
  > = {};

  for (const field of categoryItemFields) {
    next[field] = (data[field] ?? []).flatMap((row) => {
      const numericId = Number(row.program);
      if (!Number.isInteger(numericId)) {
        return [];
      }

      return [
        {
          ...(row.id === undefined ? {} : { id: row.id }),
          program: numericId,
          programLabel: row.programLabel,
        },
      ];
    });
  }

  return next;
};

const syncPublishedProgram = (
  eventsPage: Partial<EventsPageItems>,
  program: ProgramForEventsPageSync,
): Partial<Record<ProgramCategoryItemField, ProgramOrderRow[]>> => {
  const programId = program.id;
  const targetField = PROGRAM_CATEGORY_ITEM_FIELDS[program.category as ProgramCategory];
  if (!targetField) {
    return removeProgramFromAllFields(eventsPage, programId);
  }

  const existingField = findProgramField(eventsPage, programId);
  const existingRow = existingField
    ? getRows(eventsPage, existingField).find(
        (row) => relationshipIdKey(row.program) === relationshipIdKey(programId),
      )
    : undefined;
  const next = removeProgramFromAllFields(eventsPage, programId);
  const nextRow: ProgramOrderRow = {
    ...existingRow,
    program: programId,
    programLabel: getProgramLabel(program),
  };

  if (existingField === targetField) {
    const targetKey = relationshipIdKey(programId);
    next[targetField] = getRows(eventsPage, targetField).flatMap((row, index, rows) => {
      const rowKey = relationshipIdKey(row.program);
      if (rowKey !== targetKey) {
        return [row];
      }

      const firstIndex = rows.findIndex(
        (candidate) => relationshipIdKey(candidate.program) === rowKey,
      );
      return firstIndex === index ? [nextRow] : [];
    });
    return next;
  }

  next[targetField] = [...(next[targetField] ?? []), nextRow];
  return next;
};

const updateEventsPage = async ({
  data,
  req,
}: {
  data: Partial<Record<ProgramCategoryItemField, ProgramOrderRow[]>>;
  req: Parameters<CollectionAfterChangeHook>[0]["req"];
}) => {
  await req.payload.updateGlobal({
    slug: "events-page",
    data: toPayloadRows(data),
    overrideAccess: true,
    req,
    context: {
      ...req.context,
      disableRevalidate: true,
      skipProgramEventsPageSync: true,
    },
  });
};

export const syncProgramWithEventsPageAfterChange: CollectionAfterChangeHook = async ({
  doc,
  req,
}) => {
  if (req.context.skipProgramEventsPageSync || doc._status !== "published") {
    return doc;
  }

  const eventsPage = await req.payload.findGlobal({
    slug: "events-page",
    depth: 0,
    overrideAccess: true,
    req,
  });

  const next = syncPublishedProgram(eventsPage, doc);

  if (!hasEventsPageChanged(eventsPage, next)) {
    return doc;
  }

  await updateEventsPage({ data: next, req });

  return doc;
};

export const syncProgramWithEventsPageAfterDelete: CollectionAfterDeleteHook = async ({
  doc,
  req,
}) => {
  if (req.context.skipProgramEventsPageSync) {
    return doc;
  }

  const eventsPage = await req.payload.findGlobal({
    slug: "events-page",
    depth: 0,
    overrideAccess: true,
    req,
  });

  const next = removeProgramFromAllFields(eventsPage, doc.id);

  if (!hasEventsPageChanged(eventsPage, next)) {
    return doc;
  }

  await updateEventsPage({ data: next, req });

  return doc;
};
