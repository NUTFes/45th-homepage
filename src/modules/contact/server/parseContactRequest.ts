import { TURNSTILE_TOKEN_MAX_LENGTH } from "../constants";
import type { ContactFormValues } from "../types";

export type ParsedContactRequest = {
  values: ContactFormValues;
  turnstileToken: string;
};

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const parseValues = (input: unknown): ContactFormValues | null => {
  if (!isRecord(input)) {
    return null;
  }

  const { name, kana, gender, age, region, email, phone, inquiryType, inquiry } = input;

  if (
    typeof name !== "string" ||
    typeof kana !== "string" ||
    typeof gender !== "string" ||
    typeof age !== "string" ||
    typeof region !== "string" ||
    typeof email !== "string" ||
    typeof phone !== "string" ||
    typeof inquiryType !== "string" ||
    typeof inquiry !== "string"
  ) {
    return null;
  }

  return { name, kana, gender, age, region, email, phone, inquiryType, inquiry };
};

export function parseContactRequest(
  input: unknown,
): { ok: true; data: ParsedContactRequest } | { ok: false } {
  if (!isRecord(input)) {
    return { ok: false };
  }

  const values = parseValues(input.values);
  if (
    !values ||
    typeof input.turnstileToken !== "string" ||
    input.turnstileToken.length > TURNSTILE_TOKEN_MAX_LENGTH
  ) {
    return { ok: false };
  }

  const turnstileToken = input.turnstileToken.trim();
  if (turnstileToken.length === 0) {
    return { ok: false };
  }

  return {
    ok: true,
    data: {
      values,
      turnstileToken,
    },
  };
}
