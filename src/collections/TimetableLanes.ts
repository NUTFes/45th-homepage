import type { CollectionConfig, Where } from "payload";

import { preventTimetableLaneDeleteWhenReferenced } from "./hooks/preventReferencedDelete";
import {
  revalidateTimetableAfterChange,
  revalidateTimetableAfterDelete,
} from "./hooks/revalidateTimetable";

export const availableTimetableLaneWhere: Where = {
  and: [
    {
      isActive: {
        equals: true,
      },
    },
    {
      or: [
        {
          timetableGroup: {
            exists: false,
          },
        },
        {
          "timetableGroup.isActive": {
            equals: true,
          },
        },
      ],
    },
  ],
};

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
    read: ({ req: { user } }) => (user ? true : availableTimetableLaneWhere),
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
      ja: "【手順1】タイムスケジュールに表示する会場です。複数会場を1つの表示枠で切り替える場合だけ、会場グループを選択します。",
      en: "Step 1: Create a timetable venue. Select a group only when multiple venues share one timetable column.",
    },
  },
  hooks: {
    afterChange: [revalidateTimetableAfterChange],
    afterDelete: [revalidateTimetableAfterDelete],
    beforeDelete: [preventTimetableLaneDeleteWhenReferenced],
  },
  fields: [
    {
      name: "timetableGroup",
      label: {
        ja: "会場グループ（任意）",
        en: "Timetable Group (optional)",
      },
      type: "relationship",
      relationTo: "timetable-groups",
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
          ja: "複数会場を同じ表示枠で切り替える場合だけ選択します。単独会場は未選択のまま保存してください。",
          en: "Select a group only when multiple venues share one timetable column. Leave this blank for a standalone venue.",
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
          ja: "数字が小さいものから順に表示します。会場グループ内では会場候補の順、グループ未設定では表示枠の順になります。後から間へ追加しやすいよう、10、20、30のように入力してください。",
          en: "Smaller numbers appear first. This orders venue options within a group, or timetable columns for standalone venues. Use 10, 20, 30 to leave room for later additions.",
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
