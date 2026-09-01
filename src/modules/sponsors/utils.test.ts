import assert from "node:assert/strict";
import test from "node:test";

import { parseSponsorNameList } from "./utils";

test("sponsor name list trims lines, removes blank lines, and preserves duplicates", () => {
  assert.deepEqual(
    parseSponsorNameList("株式会社サンプルA\r\n\r\n  株式会社サンプルB　\n株式会社サンプルA"),
    ["株式会社サンプルA", "株式会社サンプルB", "株式会社サンプルA"],
  );
});

test("empty sponsor name list returns no names", () => {
  assert.deepEqual(parseSponsorNameList(), []);
  assert.deepEqual(parseSponsorNameList(null), []);
  assert.deepEqual(parseSponsorNameList(" \n\t"), []);
});
