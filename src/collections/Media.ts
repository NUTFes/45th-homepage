import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  labels: {
    singular: {
      ja: "画像",
      en: "Media",
    },
    plural: {
      ja: "画像",
      en: "Media",
    },
  },
  admin: {
    group: {
      ja: "サイト設定",
      en: "Site Settings",
    },
    description: {
      ja: "トップページなどで使用する画像を管理します。",
      en: "Manage images used on pages such as the top page.",
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "alt",
      label: {
        ja: "代替テキスト",
        en: "Alt text",
      },
      type: "text",
      required: true,
      admin: {
        placeholder: {
          ja: "画像の説明文（読み上げ用）を入力してください",
          en: "Enter image description for screen readers",
        },
        description: {
          ja: "画像が表示できない時や読み上げ時に使われる説明です。",
          en: "Used when image cannot be displayed or for screen readers.",
        },
      },
    },
  ],
  upload: true,
};
