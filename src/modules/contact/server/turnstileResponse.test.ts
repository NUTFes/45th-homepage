import assert from "node:assert/strict";
import test from "node:test";

import { TURNSTILE_ACTION } from "../constants";
import { isValidTurnstileResponse } from "./turnstileResponse";

const validResponse = () => ({
  success: true,
  action: TURNSTILE_ACTION,
  hostname: "example.com",
});

test("accepts a successful response with the expected action and hostname", () => {
  assert.equal(isValidTurnstileResponse(validResponse(), "example.com"), true);
});

test("requires the expected hostname", () => {
  assert.equal(isValidTurnstileResponse(validResponse(), "example.com"), true);
  assert.equal(isValidTurnstileResponse(validResponse(), "other.example.com"), false);
});

test("requires the expected action", () => {
  assert.equal(isValidTurnstileResponse({ success: true }, "example.com"), false);
  assert.equal(
    isValidTurnstileResponse(
      { success: true, action: "other_action", hostname: "example.com" },
      "example.com",
    ),
    false,
  );
});

test("rejects unsuccessful and mismatched action responses", () => {
  assert.equal(
    isValidTurnstileResponse({ ...validResponse(), success: false }, "example.com"),
    false,
  );
  assert.equal(
    isValidTurnstileResponse({ ...validResponse(), action: "other_action" }, "example.com"),
    false,
  );
});

test("rejects malformed responses", () => {
  assert.equal(isValidTurnstileResponse(null, "example.com"), false);
  assert.equal(isValidTurnstileResponse([], "example.com"), false);
  assert.equal(isValidTurnstileResponse({ success: true }, "example.com"), false);
  assert.equal(
    isValidTurnstileResponse({ success: "true", action: TURNSTILE_ACTION }, "example.com"),
    false,
  );
});
