export const GENDER_OPTIONS = ["男性", "女性", "その他"] as const;

export const INQUIRY_TYPE_OPTIONS = [
  "ご質問",
  "ご協賛について",
  "出店について",
  "落とし物",
  "その他",
] as const;

export const CONTACT_FIELD_MAX_LENGTHS = {
  name: 100,
  kana: 100,
  age: 3,
  region: 100,
  email: 254,
  phone: 20,
  inquiry: 2000,
} as const;

export const CONTACT_REQUEST_MAX_BYTES = 16 * 1024;
export const TURNSTILE_TOKEN_MAX_LENGTH = 2048;
export const TURNSTILE_ACTION = "contact_submit" as const;
