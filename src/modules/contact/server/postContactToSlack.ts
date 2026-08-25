import "server-only";

import type { ContactFormValues } from "../types";
import { createSlackContactPayload } from "./slackPayload";

const SLACK_TIMEOUT_MS = 5_000;

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
    body: JSON.stringify(createSlackContactPayload(values)),
    signal: AbortSignal.timeout(SLACK_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error("Slack webhook request failed");
  }
}
