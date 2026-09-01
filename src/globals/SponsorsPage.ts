import type { GlobalConfig } from "payload";
import { parseSponsorNameList, SPONSOR_NAME_MAX_LENGTH } from "@/modules/sponsors/utils";

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
      ja: "協賛企業一覧ページに表示する謝礼メッセージ、広告掲載企業、企業名一覧を管理します。",
      en: "Manage the thank-you message, sponsor advertisements, and sponsor name list shown on the sponsors page.",
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
      name: "sponsorNames",
      label: {
        ja: "協賛企業名一覧",
        en: "Sponsor Name List",
      },
      type: "textarea",
      required: false,
      validate: (value) => {
        const invalidName = parseSponsorNameList(value).find(
          (name) => name.length > SPONSOR_NAME_MAX_LENGTH,
        );

        return invalidName
          ? `企業名は1行${SPONSOR_NAME_MAX_LENGTH}文字以内で入力してください。`
          : true;
      },
      admin: {
        description: {
          ja: "企業名を1行に1社ずつ入力してください。ExcelやGoogle Sheetsの企業名列をまとめて貼り付けられます。",
          en: "Enter one company name per line. You can paste a company-name column from Excel or Google Sheets.",
        },
      },
    },
    {
      name: "sponsors",
      label: {
        ja: "広告掲載企業",
        en: "Sponsor Advertisements",
      },
      type: "array",
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: "/components/admin/SponsorRowLabel#SponsorRowLabel",
        },
        description: {
          ja: "広告画像を掲載する企業を表示順に並べてください。",
          en: "Arrange companies with advertisement images in display order.",
        },
      },
      labels: {
        singular: {
          ja: "広告掲載企業",
          en: "Sponsor Advertisement",
        },
        plural: {
          ja: "広告掲載企業",
          en: "Sponsor Advertisements",
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
          maxLength: SPONSOR_NAME_MAX_LENGTH,
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
          required: true,
          admin: {
            description: {
              ja: "広告画像を登録してください。可能であれば横4:縦3の画像を使用してください。",
              en: "Upload an advertisement image. Prefer a 4:3 image.",
            },
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
              ja: "未入力の場合、広告画像はリンクされません。",
              en: "If empty, the advertisement image will not be clickable.",
            },
          },
        },
      ],
    },
  ],
};
