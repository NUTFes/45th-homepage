import type { GlobalBeforeChangeHook, GlobalConfig } from "payload";
import { array } from "payload/shared";

import {
  PROGRAM_CATEGORIES,
  PROGRAM_CATEGORY_ITEM_FIELDS,
  PROGRAM_CATEGORY_LABELS,
  type ProgramCategory,
  type ProgramCategoryItemField,
} from "@/lib/events/constants";
import {
  getProgramOrderRowProgramId,
  normalizeProgramOrderIds,
  relationshipIdKey,
  type ProgramOrderRowInput,
  type RelationshipId,
} from "@/lib/events/validation";

import { revalidateEventsPageAfterChange } from "./hooks/revalidateEventsPage";

type EventsPageData = Partial<Record<ProgramCategoryItemField, unknown>>;

type ProgramForEventsPage = {
  id: RelationshipId;
  adminLabel?: string | null;
  title?: string | null;
  category?: string | null;
};

type ArrayValidationValue = Parameters<typeof array>[0];
type ArrayValidationContext = Parameters<typeof array>[1];
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toRecord = (value: unknown) => (isRecord(value) ? value : {});
const toArray = (value: unknown) => (Array.isArray(value) ? value : []);

const getProgramTitle = (program?: Pick<ProgramForEventsPage, "adminLabel" | "title">) =>
  program?.adminLabel || program?.title || "選択された企画";

const getRelationshipLabel = (value: unknown, fallback: string) => {
  if (typeof value === "object" && value !== null) {
    if ("adminLabel" in value && typeof value.adminLabel === "string" && value.adminLabel) {
      return value.adminLabel;
    }

    if ("title" in value && typeof value.title === "string" && value.title) {
      return value.title;
    }

    if ("name" in value && typeof value.name === "string" && value.name) {
      return value.name;
    }
  }

  return fallback;
};

const getProgramOrderRowValue = (row: unknown) =>
  isRecord(row) && "program" in row ? row.program : undefined;

const findProgramOrderRow = (value: unknown, id: RelationshipId) =>
  toArray(value).find((row) => getProgramOrderRowProgramId(row) === id);

const assertNoDuplicateIds = (
  ids: RelationshipId[],
  getMessage: (id: RelationshipId) => string,
) => {
  const seen = new Set<string>();

  for (const id of ids) {
    const key = relationshipIdKey(id);
    if (seen.has(key)) {
      return getMessage(id);
    }

    seen.add(key);
  }

  return true;
};

const buildValidationData = (
  fieldName: ProgramCategoryItemField,
  value: unknown,
  context: ArrayValidationContext,
): EventsPageData => ({
  ...toRecord("originalDoc" in context ? context.originalDoc : undefined),
  ...toRecord(context.data),
  ...toRecord(context.siblingData),
  [fieldName]: value,
});

const validateProgramCategoryRows = async (
  fieldName: ProgramCategoryItemField,
  value: ArrayValidationValue,
  context: ArrayValidationContext,
) => {
  const defaultResult = await array(value, context);
  if (defaultResult !== true) {
    return defaultResult;
  }

  const nextData = buildValidationData(fieldName, value, context);
  const programFieldById = new Map<string, ProgramCategoryItemField>();

  for (const [index, row] of toArray(nextData[fieldName]).entries()) {
    if (getProgramOrderRowProgramId(row) === null) {
      return `${index + 1}行目の企画を選択してください。不要な行は削除してください。`;
    }
  }

  for (const category of PROGRAM_CATEGORIES) {
    const field = PROGRAM_CATEGORY_ITEM_FIELDS[category.value];
    const ids = normalizeProgramOrderIds(nextData[field]);
    const duplicateResult = assertNoDuplicateIds(ids, (id) => {
      const row = findProgramOrderRow(nextData[field], id);
      return `「${getRelationshipLabel(getProgramOrderRowValue(row), "選択された企画")}」が重複しています。`;
    });

    if (duplicateResult !== true && field === fieldName) {
      return duplicateResult;
    }

    for (const id of ids) {
      const key = relationshipIdKey(id);
      const previousField = programFieldById.get(key);

      if (previousField && previousField !== field) {
        const row = findProgramOrderRow(nextData[field], id);
        return `「${getRelationshipLabel(getProgramOrderRowValue(row), "選択された企画")}」が複数カテゴリに登録されています。1つのカテゴリだけに登録してください。`;
      }

      programFieldById.set(key, field);
    }
  }

  if (context.event === "onChange") {
    return true;
  }

  const currentProgramIds = normalizeProgramOrderIds(nextData[fieldName]);
  const uniqueProgramIds = Array.from(new Set(currentProgramIds.map(relationshipIdKey)));

  if (uniqueProgramIds.length === 0) {
    return true;
  }

  const { docs } = await context.req.payload.find({
    collection: "programs",
    depth: 0,
    limit: uniqueProgramIds.length,
    overrideAccess: true,
    pagination: false,
    req: context.req,
    where: {
      id: {
        in: uniqueProgramIds,
      },
    },
  });

  const programs = new Map(
    docs.map((program) => [relationshipIdKey(program.id), program as ProgramForEventsPage]),
  );

  for (const id of uniqueProgramIds) {
    const program = programs.get(id);

    if (!program) {
      return "選択された企画が見つかりません。表示順から外して保存し直してください。";
    }

    const expectedField = PROGRAM_CATEGORY_ITEM_FIELDS[program.category as ProgramCategory];
    if (!expectedField) {
      return `「${getProgramTitle(program)}」のカテゴリが不正です。企画を修正してから表示順を保存してください。`;
    }

    if (fieldName !== expectedField) {
      const expectedCategoryLabel = PROGRAM_CATEGORY_LABELS[program.category as ProgramCategory];
      const actualCategory = PROGRAM_CATEGORIES.find(
        (category) => PROGRAM_CATEGORY_ITEM_FIELDS[category.value] === fieldName,
      );
      const actualCategoryLabel = actualCategory?.label ?? "選択中";

      return `「${getProgramTitle(program)}」は${expectedCategoryLabel}カテゴリの企画です。${actualCategoryLabel}カテゴリの表示順には登録できません。`;
    }
  }

  return true;
};

const reconcilePublishedProgramsBeforeChange: GlobalBeforeChangeHook = async ({
  data,
  originalDoc,
  req,
}) => {
  const nextData: EventsPageData = {
    ...toRecord(originalDoc),
    ...toRecord(data),
  };
  const selectedIds = PROGRAM_CATEGORIES.flatMap(({ value }) =>
    normalizeProgramOrderIds(nextData[PROGRAM_CATEGORY_ITEM_FIELDS[value]]),
  );
  const uniqueSelectedIds = Array.from(new Set(selectedIds.map(relationshipIdKey)));

  const selectedProgramsPromise = uniqueSelectedIds.length
    ? req.payload.find({
        collection: "programs",
        depth: 0,
        limit: uniqueSelectedIds.length,
        overrideAccess: true,
        pagination: false,
        req,
        where: {
          id: {
            in: uniqueSelectedIds,
          },
        },
      })
    : Promise.resolve({ docs: [] as ProgramForEventsPage[] });

  const [selectedPrograms, publishedPrograms] = await Promise.all([
    selectedProgramsPromise,
    req.payload.find({
      collection: "programs",
      depth: 0,
      limit: 1000,
      overrideAccess: true,
      pagination: false,
      req,
      where: {
        _status: {
          equals: "published",
        },
      },
    }),
  ]);

  const programsById = new Map<string, ProgramForEventsPage>();
  for (const program of [...publishedPrograms.docs, ...selectedPrograms.docs]) {
    programsById.set(relationshipIdKey(program.id), program as ProgramForEventsPage);
  }

  const includedProgramIds = new Set<string>();
  const reconciledData: EventsPageData = { ...data };

  for (const category of PROGRAM_CATEGORIES) {
    const field = PROGRAM_CATEGORY_ITEM_FIELDS[category.value];
    reconciledData[field] = toArray(nextData[field]).map((row) => {
      const programId = getProgramOrderRowProgramId(row);
      if (programId === null) {
        return row;
      }

      includedProgramIds.add(relationshipIdKey(programId));
      const program = programsById.get(relationshipIdKey(programId));

      return {
        ...toRecord(row),
        program: programId,
        programLabel: program ? getProgramTitle(program) : null,
      } satisfies ProgramOrderRowInput;
    });
  }

  for (const program of publishedPrograms.docs as ProgramForEventsPage[]) {
    const key = relationshipIdKey(program.id);
    if (includedProgramIds.has(key)) {
      continue;
    }

    const field = PROGRAM_CATEGORY_ITEM_FIELDS[program.category as ProgramCategory];
    if (!field) {
      continue;
    }

    const rows = toArray(reconciledData[field]);
    reconciledData[field] = [
      ...rows,
      {
        program: program.id,
        programLabel: getProgramTitle(program),
      } satisfies ProgramOrderRowInput,
    ];
    includedProgramIds.add(key);
  }

  return reconciledData;
};

const categoryArrayField = (category: (typeof PROGRAM_CATEGORIES)[number]) => ({
  name: PROGRAM_CATEGORY_ITEM_FIELDS[category.value],
  label: {
    ja: `${category.label}の公開企画表示順`,
    en: "Published Program Display Order",
  },
  labels: {
    singular: {
      ja: "企画",
      en: "Program",
    },
    plural: {
      ja: "企画",
      en: "Programs",
    },
  },
  type: "array" as const,
  admin: {
    components: {
      Field: "/components/admin/ProgramOrderField#ProgramOrderField",
    },
    description: {
      ja: `公開中の${category.label}企画を、サイトに表示したい順へドラッグしてください。企画の追加・編集・公開・非公開は「企画」メニューで操作します。`,
      en: "Drag these published programs into their site display order. Add, edit, publish, or unpublish programs from the Programs menu.",
    },
  },
  fields: [
    {
      name: "program",
      label: {
        ja: "企画",
        en: "Program",
      },
      type: "relationship" as const,
      relationTo: "programs" as const,
      required: false,
      filterOptions: {
        category: {
          equals: category.value,
        },
      },
      admin: {
        allowCreate: false,
        allowEdit: false,
        sortOptions: "adminLabel",
        description: {
          ja: "この行に表示する企画を選択してください。",
          en: "Select the program displayed by this row.",
        },
      },
    },
    {
      name: "programLabel",
      type: "text" as const,
      admin: {
        hidden: true,
        readOnly: true,
      },
    },
  ],
  validate: (value: ArrayValidationValue, context: ArrayValidationContext) =>
    validateProgramCategoryRows(PROGRAM_CATEGORY_ITEM_FIELDS[category.value], value, context),
});

export const EventsPage: GlobalConfig = {
  slug: "events-page",
  label: {
    ja: "企画ページ設定",
    en: "Events Page",
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    group: {
      ja: "サイト設定",
      en: "Site Settings",
    },
    description: {
      ja: "ゲストの整理券配布情報と、公開中企画のカテゴリ内表示順を管理します。企画の追加・編集・公開・非公開は「企画」メニュー、天候の切り替えは「天候設定」で操作してください。",
      en: "Configure guest ticket information and per-category display order for published programs. Manage program content and publication from the Programs menu.",
    },
  },
  hooks: {
    beforeChange: [reconcilePublishedProgramsBeforeChange],
    afterChange: [revalidateEventsPageAfterChange],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: {
            ja: "ゲスト",
            en: "Guest",
          },
          fields: [
            {
              name: "guestTicketInformation",
              label: {
                ja: "整理券配布情報",
                en: "Guest Ticket Information",
              },
              type: "group",
              admin: {
                description: {
                  ja: "ゲストページ上部の「整理券配布情報」に表示する本文です。",
                  en: "Copy shown in the ticket distribution banner at the top of the guest page.",
                },
              },
              fields: [
                {
                  name: "statusText",
                  label: {
                    ja: "配布状況",
                    en: "Distribution Status",
                  },
                  type: "textarea",
                  maxLength: 2000,
                  admin: {
                    description: {
                      ja: "現在の整理券配布状況を入力します。",
                      en: "Enter the current ticket distribution status. Line breaks are preserved.",
                    },
                  },
                },
              ],
            },
          ],
        },
        ...PROGRAM_CATEGORIES.map((category) => ({
          label: {
            ja: category.label,
            en: category.value,
          },
          fields: [categoryArrayField(category)],
        })),
      ],
    },
  ],
};
