import type { GlobalConfig } from "payload";

import { revalidateSponsorsPageAfterChange } from "./hooks/revalidateSponsorsPage";

export const SponsorsPage: GlobalConfig = {
  slug: "sponsors-page",
  label: {
    ja: "協賛企業ページ",
    en: "Sponsors Page",
  },
  admin: {
    group: {
      ja: "サイト設定",
      en: "Site Settings",
    },
    description: {
      ja: "協賛企業一覧ページに表示する謝礼メッセージと企業一覧を管理します。行の並び順がページ上の表示順になります。",
      en: "Manage the thank-you message and sponsor list shown on the sponsors page.",
    },
  },
  hooks: {
    afterChange: [revalidateSponsorsPageAfterChange],
  },
  fields: [
    {
      name: "thanksMessage",
      label: {
        ja: "謝礼メッセージ",
        en: "Thank-you Message",
      },
      type: "textarea",
      required: true,
      defaultValue: "第45回技大祭にご協賛いただき、誠にありがとうございます。",
      admin: {
        description: {
          ja: "協賛企業一覧の見出し下に表示されます。改行はページにも反映されます。",
          en: "Shown under the sponsors page title. Line breaks are preserved.",
        },
      },
    },
    {
      name: "sponsors",
      label: {
        ja: "協賛企業",
        en: "Sponsors",
      },
      type: "array",
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: "/components/admin/SponsorRowLabel#SponsorRowLabel",
        },
        description: {
          ja: "表示したい順に並べてください。画像ありの行は広告カード、画像なしの行は企業名のみの一覧に表示されます。",
          en: "Rows are displayed in order. Rows with images become ad cards; rows without images become name-only entries.",
        },
      },
      labels: {
        singular: {
          ja: "協賛企業",
          en: "Sponsor",
        },
        plural: {
          ja: "協賛企業",
          en: "Sponsors",
        },
      },
      fields: [
        {
          name: "companyName",
          label: {
            ja: "企業名",
            en: "Company Name",
          },
          type: "text",
          required: true,
          maxLength: 80,
          admin: {
            description: {
              ja: "ページ上に表示する正式な企業名を入力してください。",
              en: "Enter the official company name displayed on the page.",
            },
          },
        },
        {
          name: "image",
          label: {
            ja: "広告画像",
            en: "Advertisement Image",
          },
          type: "upload",
          relationTo: "media",
          required: false,
          admin: {
            description: {
              ja: "登録すると広告カードとして表示されます。未登録の場合は企業名のみの一覧に表示されます。可能であれば横4:縦3の画像を登録してください。",
              en: "If set, this sponsor is shown as an ad card. If empty, it is shown in the name-only list. Prefer a 4:3 image.",
            },
          },
        },
      ],
    },
  ],
};
