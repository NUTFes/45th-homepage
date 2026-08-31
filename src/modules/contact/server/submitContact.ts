"use server";

import { validateContactForm } from "../validation";
import { parseContactRequest } from "./parseContactRequest";
import { postContactToSlack } from "./postContactToSlack";
import { verifyTurnstile } from "./verifyTurnstile";

const INVALID_INPUT_MESSAGE = "入力内容を確認してください";
const SEND_FAILURE_MESSAGE = "送信に失敗しました。時間をおいて再度お試しください。";

export type ContactSubmissionResult = { ok: true } | { ok: false; message: string };

export async function submitContact(input: unknown): Promise<ContactSubmissionResult> {
  const parsed = parseContactRequest(input);
  if (!parsed.ok) {
    return { ok: false, message: INVALID_INPUT_MESSAGE };
  }

  const errors = await validateContactForm(parsed.data.values);
  if (Object.values(errors).some(Boolean)) {
    return { ok: false, message: INVALID_INPUT_MESSAGE };
  }

  let isVerified: boolean;
  try {
    isVerified = await verifyTurnstile(parsed.data.turnstileToken);
  } catch (error) {
    console.error("Turnstile verification failed", error);
    return { ok: false, message: SEND_FAILURE_MESSAGE };
  }

  if (!isVerified) {
    return { ok: false, message: INVALID_INPUT_MESSAGE };
  }

  try {
    await postContactToSlack(parsed.data.values);
  } catch (error) {
    console.error("Contact Slack notification failed", error);
    return { ok: false, message: SEND_FAILURE_MESSAGE };
  }

  return { ok: true };
}
