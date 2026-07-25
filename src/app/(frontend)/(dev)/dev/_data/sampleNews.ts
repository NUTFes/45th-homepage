import type { NewsItem } from "@/modules/news/types";

type RichTextSegment =
  | string
  | {
      text: string;
      url: string;
      newTab?: boolean;
    };

const createTextNode = (text: string) => ({
  type: "text",
  detail: 0,
  format: 0,
  mode: "normal",
  style: "",
  text,
  version: 1,
});

const createRichTextBody = (...segments: RichTextSegment[]): NewsItem["body"] => ({
  root: {
    type: "root",
    children: [
      {
        type: "paragraph",
        children: segments.map((segment) =>
          typeof segment === "string"
            ? createTextNode(segment)
            : {
                type: "link",
                children: [createTextNode(segment.text)],
                direction: null,
                fields: {
                  linkType: "custom",
                  newTab: segment.newTab ?? false,
                  url: segment.url,
                },
                format: "",
                indent: 0,
                version: 3,
              },
        ),
        direction: null,
        format: "",
        indent: 0,
        textFormat: 0,
        textStyle: "",
        version: 1,
      },
    ],
    direction: null,
    format: "",
    indent: 0,
    version: 1,
  },
});

export const sampleNewsItems: NewsItem[] = [
  {
    id: 1,
    date: "2026.04.12",
    dateTime: "2026-04-12",
    title: "新発売こんにちは",
    body: createRichTextBody("猫ふんじゃったネコふんじゃったネコふんじゃった猫猫猫猫"),
    important: false,
  },
  {
    id: 2,
    date: "2026.04.11",
    dateTime: "2026-04-11",
    title: "重要なお知らせ",
    body: createRichTextBody(
      "本日のイベントは予定通り開催いたします。詳細については",
      { text: "公式サイト", url: "/" },
      "をご確認ください。",
    ),
    important: true,
  },
  {
    id: 3,
    date: "2026.04.10",
    dateTime: "2026-04-10",
    title: "システムメンテナンスのお知らせ",
    body: createRichTextBody(
      "4月10日 午前2時から午前6時まで、システムメンテナンスを実施いたします。",
    ),
    important: false,
  },
  {
    id: 4,
    date: "2026.04.09",
    dateTime: "2026-04-09",
    title: "春の特別企画",
    body: createRichTextBody("春の特別企画を開催します。皆様のご参加をお待ちしております。"),
    important: false,
  },
  {
    id: 5,
    date: "2026.04.08",
    dateTime: "2026-04-08",
    title: "新メニュー追加",
    body: createRichTextBody("新しいメニューが追加されました。ぜひお試しください。"),
    important: false,
  },
  {
    id: 6,
    date: "2026.04.07",
    dateTime: "2026-04-07",
    title: "アンケート実施中",
    body: createRichTextBody(
      "ご意見をお聞かせください。",
      {
        text: "アンケート",
        url: "https://www.nutfes.jp/",
        newTab: true,
      },
      "にご協力お願いいたします。",
    ),
    important: false,
  },
];

export const sampleNewsItemsWithoutImportant: NewsItem[] = sampleNewsItems.map((item) => ({
  ...item,
  important: false,
}));
