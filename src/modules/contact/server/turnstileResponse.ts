import { TURNSTILE_ACTION } from "../constants";

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export function isValidTurnstileResponse(input: unknown, expectedHostname: string): boolean {
  if (!isRecord(input) || input.success !== true) {
    return false;
  }

  if (input.action !== TURNSTILE_ACTION || input.hostname !== expectedHostname) {
    return false;
  }

  return true;
}
