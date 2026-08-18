import type { CollectionConfig } from "payload";

import {
  FESTIVAL_DAY_SELECT_OPTIONS,
  PROGRAM_SCHEDULE_WEATHERS,
  toPayloadSelectOptions,
} from "@/lib/events/constants";
import {
  PROGRAM_TIME_OPTIONS,
  normalizeRelationshipId,
  validateProgramTimeValue,
} from "@/lib/events/validation";

import { validateTimetableListingBeforeChange } from "./hooks/validateTimetableListing";

const sourceFieldAccess = {
  update: () => false,
};

export const TimetableListings: CollectionConfig = {
  slug: "timetable-listings",
  labels: {
    singular: {
      ja: "掲載設定",
      en: "Timetable Listing",
    },
    plural: {
      ja: "掲載設定",
      en: "Timetable Listings",
    },
  },
  access: {
    create: () => false,
    delete: () => false,
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
  },
  defaultSort: ["configurationStatus", "day", "startTime"],
  indexes: [
    {
      fields: ["program", "scheduleItemId"],
      unique: true,
    },
    {
      fields: ["timetableLane", "day", "startTime", "endTime", "weather"],
    },
  ],
  admin: {
    useAsTitle: "adminLabel",
    defaultColumns: [
      "configurationStatus",
      "programTitle",
      "day",
      "startTime",
      "endTime",
      "updatedAt",
    ],
    group: {
      ja: "タイムスケジュール",
      en: "Timetable",
    },
    description: {
      ja: "【手順3】「会場未設定」の企画を開き、会場グループ、会場の順に選択してください。開催日時は企画画面で変更します。",
      en: "Open an unconfigured program, then select its timetable group and venue. Edit dates and times on the program.",
    },
  },
  hooks: {
    beforeChange: [validateTimetableListingBeforeChange],
  },
  fields: [
    {
      name: "adminLabel",
      label: {
        ja: "企画・開催日時",
        en: "Program and Schedule",
      },
      type: "text",
      access: sourceFieldAccess,
      admin: {
        hidden: true,
        readOnly: true,
      },
    },
    {
      name: "program",
      label: {
        ja: "企画",
        en: "Program",
      },
      type: "relationship",
      relationTo: "programs",
      required: true,
      maxDepth: 1,
      access: sourceFieldAccess,
      admin: {
        allowCreate: false,
        readOnly: true,
        sortOptions: "adminLabel",
        description: {
          ja: "企画画面で登録した内容です。変更する場合は企画を編集してください。",
          en: "This comes from the program. Edit the program to change it.",
        },
      },
    },
    {
      name: "programTitle",
      label: {
        ja: "企画名",
        en: "Program Title",
      },
      type: "text",
      required: true,
      access: sourceFieldAccess,
      admin: {
        hidden: true,
        readOnly: true,
      },
    },
    {
      name: "scheduleItemId",
      type: "text",
      required: true,
      access: sourceFieldAccess,
      admin: {
        hidden: true,
        readOnly: true,
      },
    },
    {
      name: "day",
      label: {
        ja: "開催日",
        en: "Day",
      },
      type: "select",
      required: true,
      options: FESTIVAL_DAY_SELECT_OPTIONS,
      access: sourceFieldAccess,
      admin: {
        readOnly: true,
      },
    },
    {
      name: "weather",
      label: {
        ja: "天候",
        en: "Weather",
      },
      type: "select",
      required: true,
      options: toPayloadSelectOptions(PROGRAM_SCHEDULE_WEATHERS),
      access: sourceFieldAccess,
      admin: {
        readOnly: true,
      },
    },
    {
      name: "startTime",
      label: {
        ja: "開始時刻",
        en: "Start Time",
      },
      type: "select",
      required: true,
      options: PROGRAM_TIME_OPTIONS,
      validate: validateProgramTimeValue,
      access: sourceFieldAccess,
      admin: {
        readOnly: true,
      },
    },
    {
      name: "endTime",
      label: {
        ja: "終了時刻",
        en: "End Time",
      },
      type: "select",
      required: true,
      options: PROGRAM_TIME_OPTIONS,
      validate: validateProgramTimeValue,
      access: sourceFieldAccess,
      admin: {
        readOnly: true,
      },
    },
    {
      name: "timetableGroup",
      label: {
        ja: "会場グループ",
        en: "Timetable Group",
      },
      type: "relationship",
      relationTo: "timetable-groups",
      required: false,
      maxDepth: 1,
      filterOptions: {
        isActive: {
          equals: true,
        },
      },
      admin: {
        allowCreate: false,
        sortOptions: "sortOrder",
        description: {
          ja: "先に会場グループを選ぶと、次の「会場」に候補が表示されます。",
          en: "Select a group first to filter the venue choices.",
        },
      },
    },
    {
      name: "timetableLane",
      label: {
        ja: "会場",
        en: "Venue",
      },
      type: "relationship",
      relationTo: "timetable-lanes",
      required: false,
      maxDepth: 1,
      filterOptions: ({ siblingData }) => {
        const timetableGroupId = normalizeRelationshipId(
          (siblingData as { timetableGroup?: unknown } | undefined)?.timetableGroup,
        );
        if (timetableGroupId === null) {
          return false;
        }

        return {
          timetableGroup: {
            equals: timetableGroupId,
          },
          isActive: {
            equals: true,
          },
        };
      },
      admin: {
        allowCreate: false,
        sortOptions: "sortOrder",
        description: {
          ja: "選んだ会場グループで使用中の会場だけが表示されます。",
          en: "Only active venues in the selected group are shown.",
        },
      },
    },
    {
      name: "configurationStatus",
      label: {
        ja: "会場の設定状況",
        en: "Venue Status",
      },
      type: "select",
      required: true,
      defaultValue: "0_unconfigured",
      options: [
        {
          label: {
            ja: "会場未設定",
            en: "Venue not configured",
          },
          value: "0_unconfigured",
        },
        {
          label: {
            ja: "会場設定済み",
            en: "Venue configured",
          },
          value: "1_configured",
        },
      ],
      index: true,
      access: sourceFieldAccess,
      admin: {
        readOnly: true,
        position: "sidebar",
        description: {
          ja: "会場グループと会場を保存すると、自動で「会場設定済み」になります。",
          en: "Changes automatically after both group and venue are saved.",
        },
      },
    },
  ],
};
