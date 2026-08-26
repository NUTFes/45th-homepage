import type { InquiryType } from "../constants";
import type { ContactFormValues } from "../types";

type SlackPlainText = {
  type: "plain_text";
  text: string;
  emoji?: boolean;
};

type SlackMrkdwn = {
  type: "mrkdwn";
  text: string;
};

type SlackHeaderBlock = {
  type: "header";
  text: SlackPlainText;
};

type SlackSectionBlock = {
  type: "section";
  text: SlackPlainText | SlackMrkdwn;
};

export type SlackContactPayload = {
  text: string;
  blocks: Array<SlackHeaderBlock | SlackSectionBlock>;
};

export type SlackContactUserIds = Partial<Record<InquiryType, readonly string[]>>;

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

export function createSlackContactPayload(
  values: ContactFormValues,
  userIdsByInquiryType: SlackContactUserIds = {},
): SlackContactPayload {
  const userIds = userIdsByInquiryType[values.inquiryType as InquiryType] ?? [];
  const mention = ["<!channel>", ...userIds.map((userId) => `<@${userId}>`)].join(" ");

  const blocks: SlackContactPayload["blocks"] = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "新しいお問い合わせが届きました",
        emoji: true,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `担当: ${mention}`,
      },
    },
  ];

  for (const [field, label] of FIELD_DEFINITIONS) {
    const value = values[field];
    if (value.trim().length === 0) {
      continue;
    }

    blocks.push(
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${label}*`,
        },
      },
      {
        type: "section",
        text: {
          type: "plain_text",
          text: value,
          emoji: true,
        },
      },
    );
  }

  return {
    text: "新しいお問い合わせが届きました",
    blocks,
  };
}
