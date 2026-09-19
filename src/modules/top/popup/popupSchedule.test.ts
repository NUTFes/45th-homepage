import assert from "node:assert/strict";
import test from "node:test";

import { nowWindowStart, shouldShow } from "./popupSchedule";

// ローカル時刻で Date を組み立てる。nowWindowStart もローカル時刻で判定するため、
// 実行環境のタイムゾーンに関係なく同じ結果になる。
const at = (day: number, hour: number, minute = 0) => new Date(2026, 8, day, hour, minute);

test("first window starts at its own boundary", () => {
  assert.equal(nowWindowStart(at(10, 11)), at(10, 11).getTime());
});

test("time inside the first window returns that window start", () => {
  assert.equal(nowWindowStart(at(10, 15, 59)), at(10, 11).getTime());
});

test("second window starts where the first one ends", () => {
  assert.equal(nowWindowStart(at(10, 16)), at(10, 16).getTime());
});

test("after midnight still belongs to the previous day's second window", () => {
  assert.equal(nowWindowStart(at(11, 1)), at(10, 16).getTime());
  assert.equal(nowWindowStart(at(11, 2, 59)), at(10, 16).getTime());
});

test("no window is active once the second one ends at 3:00", () => {
  assert.equal(nowWindowStart(at(11, 3)), null);
  assert.equal(nowWindowStart(at(11, 5)), null);
});

test("no window is active between 3:00 and the first window", () => {
  assert.equal(nowWindowStart(at(10, 10, 59)), null);
});

test("midnight belongs to the previous day, not to a gap", () => {
  assert.equal(nowWindowStart(at(10, 0)), at(9, 16).getTime());
});

test("shouldShow is false before the active period starts", () => {
  assert.equal(shouldShow(at(18, 11), null), false);
});

test("shouldShow is true on the first day of the active period", () => {
  assert.equal(shouldShow(at(19, 11), null), true);
});

test("shouldShow is true on the last day's second window, even past midnight", () => {
  // 9/26 の2回目の区間の続き(9/27 の午前2時)。区間の開始日は 9/26 なので対象内。
  assert.equal(shouldShow(at(27, 2), null), true);
});

test("shouldShow is false once a fresh window starts after the active period ends", () => {
  // 9/27 の11時は、区間の開始日が 9/27 になるため対象外。
  assert.equal(shouldShow(at(27, 11), null), false);
});
