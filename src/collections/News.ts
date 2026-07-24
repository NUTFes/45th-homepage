import {
  BoldFeature,
  FixedToolbarFeature,
  ItalicFeature,
  LinkFeature,
  ParagraphFeature,
  UnderlineFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import type { CollectionConfig, TextFieldSingleValidation } from "payload";

import { ensureSingleImportantNewsBeforeChange } from "./hooks/ensureSingleImportantNews";
import { revalidateNewsAfterChange, revalidateNewsAfterDelete } from "./hooks/revalidateNews";

const INVALID_LINK_MESSAGE =
  "http(s) URL、サイト内パス（/から開始）、ページ内リンク（#から開始）、メール、電話番号を入力してください。";

const validateNewsLink: TextFieldSingleValidation = (value) => {
  if (typeof value !== "string" || value.length === 0) {
    return "リンク先を入力してください。";
  }

  if (value !== value.trim() || /\s/.test(value)) {
    return INVALID_LINK_MESSAGE;
  }

  if (
    (value.startsWith("/") && !value.startsWith("//")) ||
    (value.startsWith("#") && value.length > 1) ||
    /^mailto:[^@\s]+@[^@\s]+\.[^@\s]+$/i.test(value) ||
    /^tel:\+?[0-9().-]+$/i.test(value)
  ) {
    return true;
  }

  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) && Boolean(url.hostname)
      ? true
      : INVALID_LINK_MESSAGE;
  } catch {
    return INVALID_LINK_MESSAGE;
  }
};

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
      type: "richText",
      required: true,
      editor: lexicalEditor({
        features: () => [
          ParagraphFeature(),
          BoldFeature(),
          ItalicFeature(),
          UnderlineFeature(),
          LinkFeature({
            enabledCollections: [],
            fields: ({ defaultFields }) => [
              ...defaultFields.filter((field) => !("name" in field && field.name === "url")),
              {
                name: "url",
                type: "text",
                label: {
                  ja: "リンク先",
                  en: "URL",
                },
                required: true,
                validate: validateNewsLink,
              },
            ],
          }),
          FixedToolbarFeature(),
        ],
      }),
    },
  ],
  timestamps: true,
};
