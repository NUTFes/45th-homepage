import { TURNSTILE_ACTION } from "../constants";

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);
type TurnstileResponseValidationOptions = {
  allowTestResponse?: boolean;
};

export function isValidTurnstileResponse(
  input: unknown,
  expectedHostname: string,
  { allowTestResponse = false }: TurnstileResponseValidationOptions = {},
): boolean {
  if (!isRecord(input) || input.success !== true) {
    return false;
  }

  if (allowTestResponse) {
    return true;
  }

  return input.action === TURNSTILE_ACTION && input.hostname === expectedHostname;
}
