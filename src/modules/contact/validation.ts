import { CONTACT_FIELD_MAX_LENGTHS, GENDER_OPTIONS, INQUIRY_TYPE_OPTIONS } from "./constants";
import type { ContactFormErrors, ContactFormValidator, ContactFormValues } from "./types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const AGE_PATTERN = /^[0-9]+$/;
const PHONE_PATTERN = /^[0-9]+$/;

const REQUIRED_FIELD_MESSAGES = {
  name: "お名前を入力してください",
  kana: "ふりがなを入力してください",
  email: "メールアドレスを入力してください",
  inquiryType: "お問い合わせ項目を選択してください",
  inquiry: "お問い合わせ内容を入力してください",
} satisfies Partial<Record<keyof ContactFormValues, string>>;

const isBlank = (value: string) => value.trim().length === 0;
const includesOption = (options: readonly string[], value: string) => options.includes(value);

export const validateContactForm: ContactFormValidator = (values: ContactFormValues) => {
  const errors: ContactFormErrors = {};

  for (const [field, message] of Object.entries(REQUIRED_FIELD_MESSAGES)) {
    const contactField = field as keyof typeof REQUIRED_FIELD_MESSAGES;
    if (isBlank(values[contactField])) {
      errors[contactField] = message;
    }
  }

  for (const [field, maxLength] of Object.entries(CONTACT_FIELD_MAX_LENGTHS)) {
    const contactField = field as keyof typeof CONTACT_FIELD_MAX_LENGTHS;
    if (values[contactField].length > maxLength) {
      errors[contactField] = `${maxLength}文字以内で入力してください`;
    }
  }

  if (!isBlank(values.gender) && !includesOption(GENDER_OPTIONS, values.gender)) {
    errors.gender = "性別を選択肢から選んでください";
  }

  if (!errors.inquiryType && !includesOption(INQUIRY_TYPE_OPTIONS, values.inquiryType)) {
    errors.inquiryType = "お問い合わせ項目を選択肢から選んでください";
  }

  if (!errors.email && !EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "メールアドレスの形式が正しくありません";
  }

  if (!errors.age && !isBlank(values.age) && !AGE_PATTERN.test(values.age.trim())) {
    errors.age = "年齢は半角数字で入力してください";
  }

  if (!errors.phone && !isBlank(values.phone) && !PHONE_PATTERN.test(values.phone.trim())) {
    errors.phone = "電話番号はハイフンなしの半角数字で入力してください";
  }

  return errors;
};
