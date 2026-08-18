import type { CollectionConfig } from "payload";

import { preventTimetableGroupDeleteWhenReferenced } from "./hooks/preventReferencedDelete";

export const TimetableGroups: CollectionConfig = {
  slug: "timetable-groups",
  labels: {
    singular: {
      ja: "会場グループ",
      en: "Timetable Group",
    },
    plural: {
      ja: "会場グループ",
      en: "Timetable Groups",
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
          },
  },
  defaultSort: "sortOrder",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "sortOrder", "isActive", "updatedAt"],
    group: {
      ja: "タイムスケジュール",
      en: "Timetable",
    },
    description: {
      ja: "【手順1】タイムスケジュールで会場をまとめる単位です。例：屋外、講義棟。マップのエリアとは別に登録します。",
      en: "Manage timetable-only groups independently from map classifications.",
    },
  },
  hooks: {
    beforeDelete: [preventTimetableGroupDeleteWhenReferenced],
  },
  fields: [
    {
      name: "name",
      label: {
        ja: "表示名",
        en: "Name",
      },
      type: "text",
      required: true,
      maxLength: 80,
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
          en: "Turn off instead of deleting. Inactive groups cannot be selected and are excluded from future timetables.",
        },
      },
    },
  ],
};
