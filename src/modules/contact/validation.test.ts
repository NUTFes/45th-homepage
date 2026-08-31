import assert from "node:assert/strict";
import test from "node:test";

import { CONTACT_FIELD_MAX_LENGTHS } from "./constants";
import type { ContactFormValues } from "./types";
import { validateContactForm } from "./validation";

const validValues = (): ContactFormValues => ({
  name: "技大 太郎",
  kana: "ぎだい たろう",
  gender: "男性",
  age: "20",
  region: "新潟県長岡市",
  email: "example@example.com",
  phone: "09012345678",
  inquiryType: "ご質問",
  inquiry: "お問い合わせ内容です。",
});

test("valid values have no errors", async () => {
  assert.deepEqual(await validateContactForm(validValues()), {});
});

test("required fields reject whitespace-only values", async () => {
  const values = validValues();
  values.name = "   ";
  values.kana = "\n\t";
  values.email = " ";
  values.inquiryType = "\t";
  values.inquiry = "\n";

  const errors = await validateContactForm(values);

  assert.ok(errors.name);
  assert.ok(errors.kana);
  assert.ok(errors.email);
  assert.ok(errors.inquiryType);
  assert.ok(errors.inquiry);
});

test("select fields reject values outside the allowlist", async () => {
  const values = validValues();
  values.gender = "回答しない";
  values.inquiryType = "営業";

  const errors = await validateContactForm(values);

  assert.ok(errors.gender);
  assert.ok(errors.inquiryType);
});

test("fields reject raw strings over their maximum lengths", async () => {
  const values = validValues();
  values.name = "a".repeat(CONTACT_FIELD_MAX_LENGTHS.name + 1);
  values.kana = "a".repeat(CONTACT_FIELD_MAX_LENGTHS.kana + 1);
  values.age = "1".repeat(CONTACT_FIELD_MAX_LENGTHS.age + 1);
  values.region = "a".repeat(CONTACT_FIELD_MAX_LENGTHS.region + 1);
  values.email = `${"a".repeat(CONTACT_FIELD_MAX_LENGTHS.email)}@example.com`;
  values.phone = "1".repeat(CONTACT_FIELD_MAX_LENGTHS.phone + 1);
  values.inquiry = "a".repeat(CONTACT_FIELD_MAX_LENGTHS.inquiry + 1);

  const errors = await validateContactForm(values);

  assert.ok(errors.name);
  assert.ok(errors.kana);
  assert.ok(errors.age);
  assert.ok(errors.region);
  assert.ok(errors.email);
  assert.ok(errors.phone);
  assert.ok(errors.inquiry);
});

test("optional numeric fields are validated after trimming", async () => {
  const values = validValues();
  values.age = "20 ";
  values.phone = " 09012345678 ";

  assert.deepEqual(await validateContactForm(values), {});
});
