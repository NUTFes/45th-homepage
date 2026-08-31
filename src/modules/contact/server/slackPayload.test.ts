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
    .filter((block) => block.type === "section" && block.text.type === "plain_text")
    .map((block) => block.text.text);

  assert.equal(sectionTexts.length, 9);
  assert.ok(sectionTexts.includes("落とし物"));
  assert.ok(sectionTexts.includes("技大 太郎"));
  assert.ok(sectionTexts.includes("example@example.com"));
  assert.ok(sectionTexts.includes("@here <!channel> <https://example.com|link>"));
});

test("formats field labels as app-generated mrkdwn", () => {
  const payload = createSlackContactPayload(completeValues());
  const mrkdwnTexts = payload.blocks
    .filter((block) => block.type === "section" && block.text.type === "mrkdwn")
    .map((block) => block.text.text);

  assert.ok(mrkdwnTexts.includes("*お問い合わせ項目*"));
  assert.ok(mrkdwnTexts.includes("*お名前*"));
  assert.ok(mrkdwnTexts.includes("*お問い合わせ内容*"));
});

test("mentions the channel and registered Slack users for the inquiry type", () => {
  const payload = createSlackContactPayload(completeValues(), ["U0550MPS3QE", "U0123456789"]);
  const mentionBlock = payload.blocks.find(
    (block) => block.type === "section" && block.text.type === "mrkdwn",
  );

  assert.equal(mentionBlock?.text.text, "担当: <!channel> <@U0550MPS3QE> <@U0123456789>");
});

test("mentions the channel when no Slack users are registered", () => {
  const payload = createSlackContactPayload(completeValues());
  const mentionBlock = payload.blocks.find(
    (block) => block.type === "section" && block.text.type === "mrkdwn",
  );

  assert.equal(mentionBlock?.text.text, "担当: <!channel>");
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

test("keeps user input in plain_text and only app-generated content in mrkdwn", () => {
  const payload = createSlackContactPayload(completeValues(), ["U0550MPS3QE"]);
  const mrkdwnTexts = payload.blocks
    .filter((block) => block.type === "section" && block.text.type === "mrkdwn")
    .map((block) => block.text.text);
  const plainTexts = payload.blocks
    .filter((block) => block.text.type === "plain_text")
    .map((block) => block.text.text);

  assert.ok(mrkdwnTexts.includes("担当: <!channel> <@U0550MPS3QE>"));
  assert.ok(mrkdwnTexts.includes("*お問い合わせ内容*"));
  assert.ok(mrkdwnTexts.every((text) => !text.includes("@here <!channel>")));
  assert.ok(plainTexts.includes("@here <!channel> <https://example.com|link>"));
});
