import assert from "node:assert/strict";
import test from "node:test";

import { TURNSTILE_ACTION } from "../constants";
import { isValidTurnstileResponse } from "./turnstileResponse";

const validResponse = () => ({
  success: true,
  action: TURNSTILE_ACTION,
  hostname: "example.com",
});

test("accepts a successful response with the expected action", () => {
  assert.equal(isValidTurnstileResponse(validResponse()), true);
});

test("requires the expected hostname when one is provided", () => {
  assert.equal(
    isValidTurnstileResponse(validResponse(), { expectedHostname: "example.com" }),
    true,
  );
  assert.equal(
    isValidTurnstileResponse(validResponse(), { expectedHostname: "other.example.com" }),
    false,
  );
});

test("allows Cloudflare's test response without an action only when explicitly enabled", () => {
  assert.equal(isValidTurnstileResponse({ success: true }), false);
  assert.equal(
    isValidTurnstileResponse({ success: true }, { allowTestResponseWithoutAction: true }),
    true,
  );
  assert.equal(
    isValidTurnstileResponse(
      { success: true, action: "other_action" },
      { allowTestResponseWithoutAction: true },
    ),
    false,
  );
});

test("rejects unsuccessful and mismatched action responses", () => {
  assert.equal(isValidTurnstileResponse({ ...validResponse(), success: false }), false);
  assert.equal(isValidTurnstileResponse({ ...validResponse(), action: "other_action" }), false);
});

test("rejects malformed responses", () => {
  assert.equal(isValidTurnstileResponse(null), false);
  assert.equal(isValidTurnstileResponse([]), false);
  assert.equal(isValidTurnstileResponse({ success: true }), false);
  assert.equal(isValidTurnstileResponse({ success: "true", action: TURNSTILE_ACTION }), false);
});
