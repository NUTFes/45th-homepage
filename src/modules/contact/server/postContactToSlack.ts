import "server-only";

import type { InquiryType } from "../constants";
import type { ContactFormValues } from "../types";
import { createSlackContactPayload } from "./slackPayload";

const SLACK_TIMEOUT_MS = 5_000;
const SLACK_USER_ID_PATTERN = /^[UW][A-Z0-9]+$/;

const CONTACT_SLACK_USER_IDS_ENV = {
  ご質問: "SLACK_CONTACT_QUESTION_USER_IDS",
  ご協賛について: "SLACK_CONTACT_SPONSOR_USER_IDS",
  出店について: "SLACK_CONTACT_BOOTH_USER_IDS",
  落とし物: "SLACK_CONTACT_LOST_FOUND_USER_IDS",
  その他: "SLACK_CONTACT_OTHER_USER_IDS",
} as const satisfies Record<InquiryType, string>;

function parseSlackUserIds(value: string | undefined, envName: string): string[] {
  if (!value?.trim()) {
    return [];
  }

  const userIds = value.split(",").map((userId) => userId.trim());
  if (userIds.some((userId) => !SLACK_USER_ID_PATTERN.test(userId))) {
    throw new Error(`${envName} contains an invalid Slack user ID`);
  }

  return userIds;
}

function getContactSlackUserIds(inquiryType: InquiryType): readonly string[] {
  const envName = CONTACT_SLACK_USER_IDS_ENV[inquiryType];
  return parseSlackUserIds(process.env[envName], envName);
}

export async function postContactToSlack(values: ContactFormValues): Promise<void> {
  const webhookUrl = process.env.SLACK_CONTACT_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error("Slack webhook is not configured");
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      createSlackContactPayload(values, getContactSlackUserIds(values.inquiryType as InquiryType)),
    ),
    signal: AbortSignal.timeout(SLACK_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error("Slack webhook request failed");
  }
}
