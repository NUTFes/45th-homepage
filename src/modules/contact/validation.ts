import type { ContactFormErrors, ContactFormValidator, ContactFormValues } from "./types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9+\-()\s]{10,20}$/;

const REQUIRED_FIELD_MESSAGES = {
  name: "お名前を入力してください",
  kana: "ふりがなを入力してください",
  gender: "性別を選択してください",
  age: "年齢を入力してください",
  region: "お住まいの地域を入力してください",
  email: "メールアドレスを入力してください",
  inquiryType: "お問い合わせ項目を選択してください",
  inquiry: "お問い合わせ内容を入力してください",
} satisfies Partial<Record<keyof ContactFormValues, string>>;

const isBlank = (value: string) => value.trim().length === 0;

export const validateContactForm: ContactFormValidator = (values: ContactFormValues) => {
  const errors: ContactFormErrors = {};

  for (const [field, message] of Object.entries(REQUIRED_FIELD_MESSAGES)) {
    const contactField = field as keyof typeof REQUIRED_FIELD_MESSAGES;
    if (isBlank(values[contactField])) {
      errors[contactField] = message;
    }
  }

  if (!errors.email && !EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "メールアドレスの形式が正しくありません";
  }

  if (!isBlank(values.phone) && !PHONE_PATTERN.test(values.phone.trim())) {
    errors.phone = "電話番号の形式が正しくありません";
  }

  return errors;
};
