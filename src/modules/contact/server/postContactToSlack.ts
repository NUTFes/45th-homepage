import "server-only";

import { INQUIRY_TYPE_OPTIONS, type InquiryType } from "../constants";
import type { ContactFormValues } from "../types";
import { createSlackContactPayload, type SlackContactUserIds } from "./slackPayload";

const SLACK_TIMEOUT_MS = 5_000;
const SLACK_USER_ID_PATTERN = /^[UW][A-Z0-9]+$/;

const CONTACT_SLACK_USER_IDS_ENV = {
  ご質問: "SLACK_CONTACT_QUESTION_USER_IDS",
  ご協賛について: "SLACK_CONTACT_SPONSOR_USER_IDS",
  出店について: "SLACK_CONTACT_BOOTH_USER_IDS",
  落とし物: "SLACK_CONTACT_LOST_FOUND_USER_IDS",
  その他: "SLACK_CONTACT_OTHER_USER_IDS",
} as const satisfies Record<InquiryType, string>;

function parseSlackUserIds(value: string | undefined): string[] {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((userId) => userId.trim())
    .filter((userId) => SLACK_USER_ID_PATTERN.test(userId));
}

function getContactSlackUserIds(): SlackContactUserIds {
  const userIdsByInquiryType: SlackContactUserIds = {};

  for (const inquiryType of INQUIRY_TYPE_OPTIONS) {
    const userIds = parseSlackUserIds(process.env[CONTACT_SLACK_USER_IDS_ENV[inquiryType]]);
    if (userIds.length > 0) {
      userIdsByInquiryType[inquiryType] = userIds;
    }
  }

  return userIdsByInquiryType;
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
    body: JSON.stringify(createSlackContactPayload(values, getContactSlackUserIds())),
    signal: AbortSignal.timeout(SLACK_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error("Slack webhook request failed");
  }
}
