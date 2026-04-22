import type { CollectionConfig } from "payload";

import { ensureSingleImportantNewsBeforeChange } from "./hooks/ensureSingleImportantNews";
import { revalidateNewsAfterChange, revalidateNewsAfterDelete } from "./hooks/revalidateNews";

export const News: CollectionConfig = {
  slug: "news",
  labels: {
    singular: {
      ja: "お知らせ",
      en: "News",
    },
    plural: {
      ja: "お知らせ",
      en: "News",
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
    useAsTitle: "title",
    defaultColumns: ["_status", "important", "title", "date", "updatedAt"],
    group: {
      ja: "コンテンツ",
      en: "Content",
    },
    description: {
      ja: "トップページやお知らせ一覧に表示するお知らせを管理します。",
      en: "Manage notices shown on the top and news pages.",
    },
  },
  versions: {
    drafts: true,
  },
  defaultSort: "-date",
  hooks: {
    beforeChange: [ensureSingleImportantNewsBeforeChange],
    afterChange: [revalidateNewsAfterChange],
    afterDelete: [revalidateNewsAfterDelete],
  },
  fields: [
    {
      name: "date",
      label: {
        ja: "日付",
        en: "Date",
      },
      type: "date",
      required: true,
      index: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: "sidebar",
        date: {
          displayFormat: "yyyy年MM月dd日",
          pickerAppearance: "dayOnly",
        },
      },
    },
    {
      name: "important",
      label: {
        ja: "重要表示",
        en: "Importance",
      },
      type: "select",
      required: true,
      defaultValue: "normal",
      options: [
        {
          label: {
            ja: "通常",
            en: "Normal",
          },
          value: "normal",
        },
        {
          label: {
            ja: "重要",
            en: "Important",
          },
          value: "important",
        },
      ],
      admin: {
        position: "sidebar",
        description: {
          ja: "「重要」を選ぶとトップページの重要なお知らせに表示されます。",
          en: "Select “Important” to show this in the top-page important notice frame.",
        },
      },
    },
    {
      name: "title",
      label: {
        ja: "タイトル",
        en: "Title",
      },
      type: "text",
      required: true,
      maxLength: 120,
    },
    {
      name: "body",
      label: {
        ja: "本文",
        en: "Body",
      },
      type: "textarea",
      required: true,
    },
  ],
  timestamps: true,
};
