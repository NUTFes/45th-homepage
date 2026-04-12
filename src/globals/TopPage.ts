import type { GlobalConfig } from "payload";

export const TopPage: GlobalConfig = {
  slug: "top-page",
  label: {
    ja: "トップページ",
    en: "Top Page",
  },
  admin: {
    group: {
      ja: "サイト設定",
      en: "Site Settings",
    },
    description: {
      ja: "トップページに表示する各セクション（PICKUP/お知らせなど）を設定します。",
      en: "Configure top-page sections such as pickup and news.",
    },
  },
  fields: [
    {
      name: "pickups",
      label: {
        ja: "PICKUP カルーセル",
        en: "PICKUP Carousel",
      },
      type: "array",
      minRows: 1,
      maxRows: 10,
      admin: {
        description: {
          ja: "表示順でスライドが並びます。必要な分だけ追加してください。",
          en: "Slides are displayed in order. Add as many as needed.",
        },
      },
      fields: [
        {
          name: "image",
          label: {
            ja: "画像",
            en: "Image",
          },
          type: "upload",
          relationTo: "media",
          required: false,
          validate: (val: unknown) => {
            if (!val) {
              return "画像は必須です。";
            }
            return true;
          },
        },
        {
          name: "href",
          label: {
            ja: "リンクURL",
            en: "Link URL",
          },
          type: "text",
          required: false,
          admin: {
            placeholder: {
              ja: "例: /news または https://example.com",
              en: "e.g. /news or https://example.com",
            },
            description: {
              ja: "未入力の場合、画像はリンクされません。",
              en: "If empty, the image will not be clickable.",
            },
          },
        },
      ],
    },
  ],
};
