import assert from "node:assert/strict";
import test from "node:test";
import { timeToMinutes } from "@/lib/events/validation";
import { BUS_TIMETABLE, getNextBusInfo } from "./busTimetable";

const festivalInfo = (iso: string) => {
  const info = getNextBusInfo(new Date(iso));
  assert.equal(info.kind, "festival");
  if (info.kind !== "festival") throw new Error("開催日のバス案内を取得できませんでした");
  return info;
};

test("時刻表の全時刻が有効で、方向ごとに重複なく昇順になっている", () => {
  for (const [direction, departures] of Object.entries(BUS_TIMETABLE)) {
    let previousMinutes = -1;
    const seen = new Set<number>();

    for (const departure of departures) {
      const minutes = timeToMinutes(departure.time);
      assert.notEqual(minutes, null, `${direction}: ${departure.time} が HH:mm 形式ではありません`);
      if (minutes === null) continue;

      assert.ok(minutes > previousMinutes, `${direction}: ${departure.time} が昇順ではありません`);
      assert.ok(!seen.has(minutes), `${direction}: ${departure.time} が重複しています`);

      previousMinutes = minutes;
      seen.add(minutes);
    }
  }
});

test("始発前は各方向の最初の便を返す", () => {
  const info = festivalInfo("2026-09-19T08:00:00+09:00");
  assert.deepEqual(info.toUniversity, { time: "09:35", type: "route" });
  assert.deepEqual(info.toStation, { time: "09:25", type: "route" });
});

test("発車時刻ちょうどはその便を返す", () => {
  const info = festivalInfo("2026-09-19T10:00:00+09:00");
  assert.deepEqual(info.toUniversity, { time: "10:00", type: "shuttle" });
});

test("発車時刻を過ぎたら同じ分でも次の便を返す", () => {
  const info = festivalInfo("2026-09-19T10:30:00.001+09:00");
  assert.deepEqual(info.toStation, { time: "11:02", type: "route" });
});

test("便間では各方向の次便を独立して返す", () => {
  const info = festivalInfo("2026-09-19T14:10:00+09:00");
  assert.deepEqual(info.toUniversity, { time: "15:05", type: "route" });
  assert.deepEqual(info.toStation, { time: "14:30", type: "shuttle" });
});

test("一方向だけ最終便後になった状態を返せる", () => {
  const info = festivalInfo("2026-09-19T20:00:00+09:00");
  assert.deepEqual(info.toUniversity, { time: "20:30", type: "route" });
  assert.equal(info.toStation, null);
});

test("両方向の最終便後はどちらも運行終了になる", () => {
  const info = festivalInfo("2026-09-19T20:31:00+09:00");
  assert.equal(info.toUniversity, null);
  assert.equal(info.toStation, null);
});

test("9月19日と20日は同じ時刻表を使う", () => {
  const day1 = festivalInfo("2026-09-19T13:15:00+09:00");
  const day2 = festivalInfo("2026-09-20T13:15:00+09:00");
  assert.deepEqual(day1, day2);
});

test("開催日外は時刻を返さない", () => {
  assert.deepEqual(getNextBusInfo(new Date("2026-09-21T10:00:00+09:00")), {
    kind: "offFestival",
  });
});

test("実行環境のローカルタイムゾーンではなく Asia/Tokyo で判定する", () => {
  const previousTimezone = process.env.TZ;
  process.env.TZ = "Pacific/Honolulu";

  try {
    const info = festivalInfo("2026-09-19T01:00:00.000Z");
    assert.deepEqual(info.toUniversity, { time: "10:00", type: "shuttle" });
  } finally {
    if (previousTimezone === undefined) delete process.env.TZ;
    else process.env.TZ = previousTimezone;
  }
});
