import assert from "node:assert/strict";
import test from "node:test";

import { CONTACT_REQUEST_BODY_MAX_BYTES, readContactRequestBody } from "./readContactRequestBody";

const createRequest = (body: string, headers?: HeadersInit) =>
  new Request("http://localhost/api/contact", {
    method: "POST",
    headers,
    body,
  });

test("parses JSON within the contact request limit", async () => {
  const result = await readContactRequestBody(createRequest('{"message":"お問い合わせ"}'));

  assert.deepEqual(result, { ok: true, data: { message: "お問い合わせ" } });
});

test("rejects a declared oversized body before reading it", async () => {
  const request = createRequest("{}", {
    "Content-Length": String(CONTACT_REQUEST_BODY_MAX_BYTES + 1),
  });

  assert.deepEqual(await readContactRequestBody(request), { ok: false, reason: "too-large" });
});

test("rejects an oversized streamed body without a Content-Length header", async () => {
  const request = createRequest("x".repeat(CONTACT_REQUEST_BODY_MAX_BYTES + 1));
  assert.equal(request.headers.has("content-length"), false);

  assert.deepEqual(await readContactRequestBody(request), { ok: false, reason: "too-large" });
});

test("rejects malformed JSON", async () => {
  assert.deepEqual(await readContactRequestBody(createRequest("{")), {
    ok: false,
    reason: "invalid-json",
  });
});
