import type { ContactFormValues } from "../types";

type SlackPlainText = {
  type: "plain_text";
  text: string;
  emoji?: boolean;
};

type SlackHeaderBlock = {
  type: "header";
  text: SlackPlainText;
};

type SlackSectionBlock = {
  type: "section";
  text: SlackPlainText;
};

export type SlackContactPayload = {
  text: string;
  blocks: Array<SlackHeaderBlock | SlackSectionBlock>;
};

const FIELD_DEFINITIONS = [
  ["inquiryType", "お問い合わせ項目"],
  ["name", "お名前"],
  ["kana", "ふりがな"],
  ["gender", "性別"],
  ["age", "年齢"],
  ["region", "お住まいの地域"],
  ["email", "メールアドレス"],
  ["phone", "電話番号"],
  ["inquiry", "お問い合わせ内容"],
] as const satisfies readonly [keyof ContactFormValues, string][];

export function createSlackContactPayload(values: ContactFormValues): SlackContactPayload {
  const blocks: SlackContactPayload["blocks"] = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "新しいお問い合わせが届きました",
        emoji: true,
      },
    },
  ];

  for (const [field, label] of FIELD_DEFINITIONS) {
    const value = values[field];
    if (value.trim().length === 0) {
      continue;
    }

    blocks.push({
      type: "section",
      text: {
        type: "plain_text",
        text: `${label}\n${value}`,
        emoji: true,
      },
    });
  }

  return {
    text: "新しいお問い合わせが届きました",
    blocks,
  };
}
