import "server-only";

import { isValidTurnstileResponse } from "./turnstileResponse";

const TURNSTILE_SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TURNSTILE_TIMEOUT_MS = 5_000;

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
    return false;
  }

  const expectedHostname = getExpectedHostname();
  if (process.env.NODE_ENV === "production" && !expectedHostname) {
    return false;
  }

  try {
    const response = await fetch(TURNSTILE_SITEVERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ secret, response: token }),
      signal: AbortSignal.timeout(TURNSTILE_TIMEOUT_MS),
    });

    if (!response.ok) {
      return false;
    }

    const body: unknown = await response.json();
    return isValidTurnstileResponse(body, expectedHostname);
  } catch {
    return false;
  }
}
