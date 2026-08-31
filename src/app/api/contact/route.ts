import { parseContactRequest } from "@/modules/contact/server/parseContactRequest";
import { postContactToSlack } from "@/modules/contact/server/postContactToSlack";
import { readContactRequestBody } from "@/modules/contact/server/readContactRequestBody";
import { verifyTurnstile } from "@/modules/contact/server/verifyTurnstile";
import { validateContactForm } from "@/modules/contact/validation";

const INVALID_INPUT_RESPONSE = {
  ok: false,
  message: "入力内容を確認してください",
} as const;

const SEND_FAILURE_RESPONSE = {
  ok: false,
  message: "送信に失敗しました。時間をおいて再度お試しください。",
} as const;

export async function POST(request: Request): Promise<Response> {
  const contentType = request.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase();
  if (contentType !== "application/json") {
    return Response.json(INVALID_INPUT_RESPONSE, { status: 415 });
  }

  const bodyResult = await readContactRequestBody(request);
  if (!bodyResult.ok) {
    const status = bodyResult.reason === "too-large" ? 413 : 400;
    return Response.json(INVALID_INPUT_RESPONSE, { status });
  }

  const input = bodyResult.data;

  const parsed = parseContactRequest(input);
  if (!parsed.ok) {
    return Response.json(INVALID_INPUT_RESPONSE, { status: 400 });
  }

  const errors = await validateContactForm(parsed.data.values);
  if (Object.values(errors).some(Boolean)) {
    return Response.json(INVALID_INPUT_RESPONSE, { status: 400 });
  }

  let isVerified: boolean;
  try {
    isVerified = await verifyTurnstile(parsed.data.turnstileToken);
  } catch (error) {
    console.error("Turnstile verification failed", error);
    return Response.json(SEND_FAILURE_RESPONSE, { status: 503 });
  }

  if (!isVerified) {
    return Response.json(INVALID_INPUT_RESPONSE, { status: 400 });
  }

  try {
    await postContactToSlack(parsed.data.values);
  } catch (error) {
    console.error("Contact Slack notification failed", error);
    return Response.json(SEND_FAILURE_RESPONSE, { status: 503 });
  }

  return Response.json({ ok: true });
}
