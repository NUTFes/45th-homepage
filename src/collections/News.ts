import type { CollectionConfig } from "payload";

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
    defaultColumns: ["_status", "title", "date", "updatedAt"],
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
