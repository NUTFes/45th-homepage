import "server-only";

import { isValidTurnstileResponse } from "./turnstileResponse";

const TURNSTILE_SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TURNSTILE_TIMEOUT_MS = 5_000;
const TURNSTILE_ALWAYS_PASS_TEST_SITE_KEY = "1x00000000000000000000AA";
const TURNSTILE_ALWAYS_PASS_TEST_SECRET_KEY = "1x0000000000000000000000000000000AA";

const getExpectedHostname = (): string | undefined => {
  if (process.env.NODE_ENV !== "production") {
    return undefined;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    return undefined;
  }

  try {
    return new URL(siteUrl).hostname;
  } catch {
    return undefined;
  }
};

export async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    throw new Error("Turnstile secret is not configured");
  }

  const expectedHostname = getExpectedHostname();
  if (process.env.NODE_ENV === "production" && !expectedHostname) {
    throw new Error("Turnstile hostname is not configured");
  }

  const response = await fetch(TURNSTILE_SITEVERIFY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ secret, response: token }),
    signal: AbortSignal.timeout(TURNSTILE_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Turnstile verification request failed: ${response.status}`);
  }

  const body: unknown = await response.json();
  const allowTestAction =
    process.env.NODE_ENV !== "production" &&
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY === TURNSTILE_ALWAYS_PASS_TEST_SITE_KEY &&
    secret === TURNSTILE_ALWAYS_PASS_TEST_SECRET_KEY;

  return isValidTurnstileResponse(body, { expectedHostname, allowTestAction });
}
