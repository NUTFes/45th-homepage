import type {
  CollectionAfterReadHook,
  CollectionBeforeValidateHook,
  CollectionConfig,
} from "payload";

import {
  FESTIVAL_DAY_SELECT_OPTIONS,
  PROGRAM_AREAS,
  PROGRAM_CATEGORIES,
  PROGRAM_SCHEDULE_WEATHERS,
  PROGRAM_TAG_SELECT_OPTIONS,
  toPayloadSelectOptions,
} from "@/lib/events/constants";
import {
  buildProgramAdminLabel,
  validateProgramTimeValue,
  validateScheduleItems,
} from "@/lib/events/validation";

import {
  revalidateProgramsAfterChange,
  revalidateProgramsAfterDelete,
} from "./hooks/revalidatePrograms";
import {
  deleteTimetableListingsBeforeProgramDelete,
  syncTimetableListingsAfterProgramChange,
} from "./hooks/syncTimetableListings";
import {
  syncProgramWithEventsPageAfterChange,
  syncProgramWithEventsPageAfterDelete,
} from "./hooks/syncProgramWithEventsPage";

const updateProgramAdminLabelBeforeValidate: CollectionBeforeValidateHook = ({
  data,
  originalDoc,
}) => {
  const nextProgram = {
    ...originalDoc,
    ...data,
  };

  return {
    ...data,
    adminLabel: buildProgramAdminLabel(nextProgram),
  };
};

const addProgramAdminLabelAfterRead: CollectionAfterReadHook = ({ doc }) => ({
  ...doc,
  adminLabel: buildProgramAdminLabel(doc),
});

export const Programs: CollectionConfig = {
  slug: "programs",
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
  access: {
    read: ({ req: { user } }) => {
      if (user) return true;

      return {
        _status: {
          equals: "published",
        },
      };
    },
  },
  admin: {
    useAsTitle: "adminLabel",
    defaultColumns: ["_status", "title", "category", "area", "locationName", "updatedAt"],
    group: {
      ja: "コンテンツ",
      en: "Content",
    },
    description: {
      ja: "企画内容、マップのエリア・場所、開催日時を登録します。保存後、タイムスケジュールの掲載設定が自動作成されます。",
      en: "Register program content, map location, and schedule. Timetable listings are created automatically after saving.",
    },
  },
  versions: {
    drafts: true,
  },
  hooks: {
    beforeValidate: [updateProgramAdminLabelBeforeValidate],
    beforeDelete: [deleteTimetableListingsBeforeProgramDelete],
    afterRead: [addProgramAdminLabelAfterRead],
    afterChange: [
      syncTimetableListingsAfterProgramChange,
      syncProgramWithEventsPageAfterChange,
      revalidateProgramsAfterChange,
    ],
    afterDelete: [syncProgramWithEventsPageAfterDelete, revalidateProgramsAfterDelete],
  },
  fields: [
    {
      name: "adminLabel",
      type: "text",
      admin: {
        hidden: true,
        readOnly: true,
      },
    },
    {
      name: "title",
      label: {
        ja: "企画名",
        en: "Title",
      },
      type: "text",
      required: true,
      maxLength: 120,
    },
    {
      name: "category",
      label: {
        ja: "カテゴリ",
        en: "Category",
      },
      type: "select",
      required: true,
      options: toPayloadSelectOptions(PROGRAM_CATEGORIES),
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "area",
      label: {
        ja: "マップのエリア",
        en: "Area",
      },
      type: "select",
      required: true,
      options: toPayloadSelectOptions(PROGRAM_AREAS),
      admin: {
        position: "sidebar",
        description: {
          ja: "来場者がマップで場所を探すためのエリアです。タイムスケジュールの会場グループとは別に選びます。",
          en: "Area used to find the program on the map. This is separate from timetable groups.",
        },
      },
    },
    {
      name: "locationName",
      label: {
        ja: "マップに表示する場所",
        en: "Location",
      },
      type: "text",
      required: true,
      maxLength: 120,
      admin: {
        placeholder: {
          ja: "例: 講義棟 1F 101講義室",
          en: "e.g. Lecture Building 1F Room 101",
        },
        description: {
          ja: "来場者向けのマップや企画詳細に表示する場所を入力します。例：講義棟 1F 101講義室",
          en: "Enter the visitor-facing location shown on the map and program details.",
        },
      },
    },
    {
      name: "image",
      label: {
        ja: "企画画像",
        en: "Image",
      },
      type: "upload",
      relationTo: "media",
      required: false,
    },
    {
      name: "mapImage",
      label: {
        ja: "地図画像",
        en: "Map Image",
      },
      type: "upload",
      relationTo: "media",
      required: false,
    },
    {
      name: "tags",
      label: {
        ja: "タグ",
        en: "Tags",
      },
      type: "select",
      hasMany: true,
      required: false,
      options: PROGRAM_TAG_SELECT_OPTIONS,
      admin: {
        isClearable: true,
        isSortable: true,
        description: {
          ja: "定義済みのタグから選択してください。選択順は企画詳細での表示順になります。",
          en: "Select from the predefined tags. The selected order is used on the program detail page.",
        },
      },
    },
    {
      name: "catchphrase",
      label: {
        ja: "キャッチコピー",
        en: "Catchphrase",
      },
      type: "text",
      required: false,
      maxLength: 160,
    },
    {
      name: "description",
      label: {
        ja: "説明文",
        en: "Description",
      },
      type: "textarea",
      required: true,
      admin: {
        description: {
          ja: "企画説明、注意事項、参加条件、整理券、雨天時対応など、来場者に伝える必要がある情報をまとめて入力してください。",
          en: "Enter visitor-facing information such as description, notes, requirements, ticketing, and rainy-day handling.",
        },
      },
    },
    {
      name: "scheduleItems",
      label: {
        ja: "開催日時",
        en: "Schedule Items",
      },
      type: "array",
      required: true,
      minRows: 1,
      validate: validateScheduleItems,
      admin: {
        className: "program-schedule-items",
        initCollapsed: false,
        description: {
          ja: "企画を開催する日・天候・時間を1行ずつ登録します。保存すると各行の「掲載設定」が自動作成されます。日・天候・時間を変更した行は会場設定が解除されるため、掲載設定で会場を選び直してください。",
          en: "Register each occurrence. Saving creates its timetable listing; changing its day, weather, or time clears the timetable venue for review.",
        },
      },
      labels: {
        singular: {
          ja: "開催日時",
          en: "Schedule Item",
        },
        plural: {
          ja: "開催日時",
          en: "Schedule Items",
        },
      },
      fields: [
        {
          name: "weather",
          label: {
            ja: "天候",
            en: "Weather",
          },
          type: "select",
          required: true,
          options: toPayloadSelectOptions(PROGRAM_SCHEDULE_WEATHERS),
          admin: {
            description: {
              ja: "「晴れ・雨 共通」は晴天時にも雨天時にも表示されます。晴れの日だけ、雨の日だけ開催時間が違う場合は「晴れのみ」「雨のみ」を分けて登録してください。",
              en: "Use Common for schedules shown in both sunny and rainy modes.",
            },
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
        },
        {
          name: "startTime",
          label: {
            ja: "開始時刻",
            en: "Start Time",
          },
          type: "text",
          required: true,
          minLength: 5,
          maxLength: 5,
          validate: validateProgramTimeValue,
          admin: {
            components: {
              Field: "/components/admin/TimeField#TimeField",
            },
            description: {
              ja: "10:00から20:30までの時刻を1分単位で入力してください。",
              en: "Enter a time from 10:00 to 20:30 in one-minute increments.",
            },
          },
        },
        {
          name: "endTime",
          label: {
            ja: "終了時刻",
            en: "End Time",
          },
          type: "text",
          required: true,
          minLength: 5,
          maxLength: 5,
          validate: validateProgramTimeValue,
          admin: {
            components: {
              Field: "/components/admin/TimeField#TimeField",
            },
            description: {
              ja: "10:00から20:30までの時刻を1分単位で入力し、開始時刻より後にしてください。",
              en: "Enter a time from 10:00 to 20:30 in one-minute increments, after the start time.",
            },
          },
        },
      ],
    },
  ],
  timestamps: true,
};
