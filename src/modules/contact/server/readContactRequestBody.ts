export const CONTACT_REQUEST_BODY_MAX_BYTES = 64 * 1024;

type ReadContactRequestBodyResult =
  | { ok: true; data: unknown }
  | { ok: false; reason: "invalid-json" | "too-large" };

const isDeclaredBodyTooLarge = (request: Request): boolean => {
  const contentLength = request.headers.get("content-length");
  if (contentLength === null) {
    return false;
  }

  const declaredBytes = Number(contentLength);
  return Number.isSafeInteger(declaredBytes) && declaredBytes > CONTACT_REQUEST_BODY_MAX_BYTES;
};

export async function readContactRequestBody(
  request: Request,
): Promise<ReadContactRequestBodyResult> {
  if (isDeclaredBodyTooLarge(request)) {
    return { ok: false, reason: "too-large" };
  }

  if (!request.body) {
    return { ok: false, reason: "invalid-json" };
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      totalBytes += value.byteLength;
      if (totalBytes > CONTACT_REQUEST_BODY_MAX_BYTES) {
        await reader.cancel().catch(() => undefined);
        return { ok: false, reason: "too-large" };
      }

      chunks.push(value);
    }
  } catch {
    return { ok: false, reason: "invalid-json" };
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return { ok: true, data: JSON.parse(new TextDecoder().decode(body)) as unknown };
  } catch {
    return { ok: false, reason: "invalid-json" };
  }
}
