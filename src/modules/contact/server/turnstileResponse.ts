import { TURNSTILE_ACTION } from "../constants";

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

type TurnstileResponseValidationOptions = {
  expectedHostname?: string;
  allowMissingAction?: boolean;
};

export function isValidTurnstileResponse(
  input: unknown,
  { expectedHostname, allowMissingAction = false }: TurnstileResponseValidationOptions = {},
): boolean {
  if (!isRecord(input) || input.success !== true) {
    return false;
  }

  if (input.action !== TURNSTILE_ACTION && !(allowMissingAction && input.action === undefined)) {
    return false;
  }

  if (expectedHostname && input.hostname !== expectedHostname) {
    return false;
  }

  return true;
}
