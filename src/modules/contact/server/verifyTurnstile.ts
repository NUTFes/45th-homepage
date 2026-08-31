import "server-only";

import { isValidTurnstileResponse } from "./turnstileResponse";

const TURNSTILE_SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TURNSTILE_TIMEOUT_MS = 5_000;

const getExpectedHostname = (): string => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    throw new Error("Turnstile hostname is not configured");
  }

  try {
    return new URL(siteUrl).hostname;
  } catch {
    throw new Error("Turnstile hostname is not configured");
  }
};

export async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    throw new Error("Turnstile secret is not configured");
  }

  const expectedHostname = getExpectedHostname();

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
  return isValidTurnstileResponse(body, expectedHostname);
}
