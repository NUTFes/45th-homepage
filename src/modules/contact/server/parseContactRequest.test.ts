import assert from "node:assert/strict";
import test from "node:test";

import { TURNSTILE_TOKEN_MAX_LENGTH } from "../constants";
import type { ContactFormValues } from "../types";
import { parseContactRequest } from "./parseContactRequest";

const validValues = (): ContactFormValues => ({
  name: "技大 太郎",
  kana: "ぎだい たろう",
  gender: "",
  age: "",
  region: "",
  email: "example@example.com",
  phone: "",
  inquiryType: "落とし物",
  inquiry: "  1行目\n2行目  ",
});

test("parses known fields and preserves raw form values", () => {
  const values = validValues();
  const result = parseContactRequest({
    values: { ...values, ignored: "extra" },
    turnstileToken: "  token-value  ",
    ignored: true,
  });

  assert.deepEqual(result, {
    ok: true,
    data: {
      values,
      turnstileToken: "token-value",
    },
  });
});

test("rejects non-object payloads and values", () => {
  assert.deepEqual(parseContactRequest(null), { ok: false });
  assert.deepEqual(parseContactRequest([]), { ok: false });
  assert.deepEqual(parseContactRequest({ values: null, turnstileToken: "token" }), {
    ok: false,
  });
});

test("rejects missing and non-string form fields", () => {
  const values = validValues();
  const { email: _email, ...missingEmail } = values;

  assert.deepEqual(parseContactRequest({ values: missingEmail, turnstileToken: "token" }), {
    ok: false,
  });
  assert.deepEqual(
    parseContactRequest({
      values: { ...values, age: 20 },
      turnstileToken: "token",
    }),
    { ok: false },
  );
});

test("rejects invalid Turnstile token values", () => {
  const values = validValues();

  assert.deepEqual(parseContactRequest({ values }), { ok: false });
  assert.deepEqual(parseContactRequest({ values, turnstileToken: 123 }), { ok: false });
  assert.deepEqual(parseContactRequest({ values, turnstileToken: "   " }), { ok: false });
  assert.deepEqual(
    parseContactRequest({
      values,
      turnstileToken: "a".repeat(TURNSTILE_TOKEN_MAX_LENGTH + 1),
    }),
    { ok: false },
  );
  assert.deepEqual(
    parseContactRequest({
      values,
      turnstileToken: `${" ".repeat(TURNSTILE_TOKEN_MAX_LENGTH)}a`,
    }),
    { ok: false },
  );
});

test("accepts a Turnstile token at the maximum length", () => {
  const result = parseContactRequest({
    values: validValues(),
    turnstileToken: "a".repeat(TURNSTILE_TOKEN_MAX_LENGTH),
  });

  assert.equal(result.ok, true);
});
