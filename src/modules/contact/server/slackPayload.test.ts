import assert from "node:assert/strict";
import test from "node:test";

import type { ContactFormValues } from "../types";
import { createSlackContactPayload } from "./slackPayload";

const completeValues = (): ContactFormValues => ({
  name: "技大 太郎",
  kana: "ぎだい たろう",
  gender: "その他",
  age: "20",
  region: "新潟県長岡市",
  email: "example@example.com",
  phone: "09012345678",
  inquiryType: "落とし物",
  inquiry: "@here <!channel> <https://example.com|link>",
});

test("includes all entered contact fields", () => {
  const payload = createSlackContactPayload(completeValues());
  const sectionTexts = payload.blocks
    .filter((block) => block.type === "section")
    .map((block) => block.text.text);

  assert.equal(sectionTexts.length, 9);
  assert.ok(sectionTexts.some((text) => text.includes("お問い合わせ項目\n落とし物")));
  assert.ok(sectionTexts.some((text) => text.includes("お名前\n技大 太郎")));
  assert.ok(sectionTexts.some((text) => text.includes("メールアドレス\nexample@example.com")));
  assert.ok(sectionTexts.some((text) => text.includes("お問い合わせ内容\n@here <!channel>")));
});

test("omits optional fields that are blank", () => {
  const values = completeValues();
  values.gender = "";
  values.age = "  ";
  values.region = "";
  values.phone = "";

  const payload = createSlackContactPayload(values);
  const allText = payload.blocks.map((block) => block.text.text).join("\n");

  assert.doesNotMatch(allText, /性別/);
  assert.doesNotMatch(allText, /年齢/);
  assert.doesNotMatch(allText, /お住まいの地域/);
  assert.doesNotMatch(allText, /電話番号/);
});

test("uses plain_text for every block so user input is not mrkdwn", () => {
  const payload = createSlackContactPayload(completeValues());

  for (const block of payload.blocks) {
    assert.equal(block.text.type, "plain_text");
  }
});
