import { CONTACT_REQUEST_MAX_BYTES } from "@/modules/contact/constants";
import { parseContactRequest } from "@/modules/contact/server/parseContactRequest";
import { postContactToSlack } from "@/modules/contact/server/postContactToSlack";
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

  const contentLengthHeader = request.headers.get("content-length");
  if (contentLengthHeader) {
    const contentLength = Number(contentLengthHeader);
    if (Number.isFinite(contentLength) && contentLength > CONTACT_REQUEST_MAX_BYTES) {
      return Response.json(INVALID_INPUT_RESPONSE, { status: 413 });
    }
  }

  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return Response.json(INVALID_INPUT_RESPONSE, { status: 400 });
  }

  const parsed = parseContactRequest(input);
  if (!parsed.ok) {
    return Response.json(INVALID_INPUT_RESPONSE, { status: 400 });
  }

  const errors = await validateContactForm(parsed.data.values);
  if (Object.values(errors).some(Boolean)) {
    return Response.json(INVALID_INPUT_RESPONSE, { status: 400 });
  }

  if (!(await verifyTurnstile(parsed.data.turnstileToken))) {
    return Response.json(INVALID_INPUT_RESPONSE, { status: 400 });
  }

  try {
    await postContactToSlack(parsed.data.values);
  } catch {
    return Response.json(SEND_FAILURE_RESPONSE, { status: 503 });
  }

  return Response.json({ ok: true });
}
