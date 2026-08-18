import type { CollectionConfig } from "payload";

import {
  preventReferencedTimetableLaneGroupChange,
  preventTimetableLaneDeleteWhenReferenced,
} from "./hooks/preventReferencedDelete";
import {
  revalidateTimetableAfterChange,
  revalidateTimetableAfterDelete,
} from "./hooks/revalidateTimetable";

export const TimetableLanes: CollectionConfig = {
  slug: "timetable-lanes",
  labels: {
    singular: {
      ja: "会場",
      en: "Timetable Lane",
    },
    plural: {
      ja: "会場",
      en: "Timetable Lanes",
    },
  },
  access: {
    read: ({ req: { user } }) =>
      user
        ? true
        : {
            isActive: {
              equals: true,
            },
            "timetableGroup.isActive": {
              equals: true,
            },
          },
  },
  defaultSort: "sortOrder",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["timetableGroup", "name", "sortOrder", "isActive", "updatedAt"],
    group: {
      ja: "タイムスケジュール",
      en: "Timetable",
    },
    description: {
      ja: "【手順2】タイムスケジュールに表示する会場です。先に会場グループを登録してください。例：メインステージ、講義棟A会場。",
      en: "Manage locations that act as timetable selectors or columns.",
    },
  },
  hooks: {
    afterChange: [revalidateTimetableAfterChange],
    afterDelete: [revalidateTimetableAfterDelete],
    beforeChange: [preventReferencedTimetableLaneGroupChange],
    beforeDelete: [preventTimetableLaneDeleteWhenReferenced],
  },
  fields: [
    {
      name: "timetableGroup",
      label: {
        ja: "会場グループ",
        en: "Timetable Group",
      },
      type: "relationship",
      relationTo: "timetable-groups",
      required: true,
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
          ja: "この会場をまとめる会場グループを選びます。",
          en: "Select the group that contains this venue.",
        },
      },
    },
    {
      name: "name",
      label: {
        ja: "表示名",
        en: "Name",
      },
      type: "text",
      required: true,
      maxLength: 100,
    },
    {
      name: "sortOrder",
      label: {
        ja: "並び順",
        en: "Sort Order",
      },
      type: "number",
      required: true,
      defaultValue: 0,
      min: 0,
      index: true,
      admin: {
        position: "sidebar",
        step: 1,
        description: {
          ja: "数字が小さいものから順に表示します。後から間へ追加しやすいよう、10、20、30のように入力してください。",
          en: "Smaller numbers appear first. Using 10, 20, 30 leaves room for later additions.",
        },
      },
    },
    {
      name: "isActive",
      label: {
        ja: "使用する",
        en: "Active",
      },
      type: "checkbox",
      required: true,
      defaultValue: true,
      index: true,
      admin: {
        position: "sidebar",
        description: {
          ja: "使用しない場合はオフにしてください。削除する必要はありません。オフにすると新しい掲載設定で選べず、今後のタイムスケジュールにも表示されません。",
          en: "Turn off instead of deleting. Inactive venues cannot be selected and are excluded from future timetables.",
        },
      },
    },
  ],
};
