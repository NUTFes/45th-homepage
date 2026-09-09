import assert from "node:assert/strict";
import test from "node:test";

import type { EventProgramDTO, EventScheduleItemDTO } from "./types";
import { findUpcomingProgramGroup } from "./presentation";

const schedule = (startTime: string, day: "day1" | "day2" = "day1"): EventScheduleItemDTO => ({
  weather: "both",
  day,
  startTime,
  endTime: "20:30",
});

const program = (id: number, scheduleItems: EventScheduleItemDTO[]): EventProgramDTO =>
  ({
    id,
    title: `企画${id}`,
    scheduleItems,
  }) as EventProgramDTO;

test("groups future programs in the nearest hourly slot", () => {
  const result = findUpcomingProgramGroup(
    [
      program(1, [schedule("10:00")]),
      program(2, [schedule("10:15")]),
      program(3, [schedule("10:30")]),
      program(4, [schedule("11:00")]),
    ],
    new Date("2026-09-19T09:45:00+09:00"),
  );

  assert.equal(result?.startTime, "10:00");
  assert.deepEqual(
    result?.programs.map(({ id }) => id),
    [1, 2, 3],
  );
});

test("excludes already-started programs and does not mix the next hourly slot", () => {
  const result = findUpcomingProgramGroup(
    [
      program(1, [schedule("10:00")]),
      program(2, [schedule("10:15")]),
      program(3, [schedule("10:45")]),
      program(4, [schedule("11:00")]),
    ],
    new Date("2026-09-19T10:05:00+09:00"),
  );

  assert.equal(result?.startTime, "10:00");
  assert.deepEqual(
    result?.programs.map(({ id }) => id),
    [2, 3],
  );
});

test("uses a 60 minute upcoming window and includes the full selected hourly slot", () => {
  const result = findUpcomingProgramGroup(
    [program(1, [schedule("11:00")]), program(2, [schedule("11:30")])],
    new Date("2026-09-19T10:00:00+09:00"),
  );

  assert.equal(result?.startTime, "11:00");
  assert.deepEqual(
    result?.programs.map(({ id }) => id),
    [1, 2],
  );

  assert.equal(
    findUpcomingProgramGroup(
      [program(3, [schedule("11:01")])],
      new Date("2026-09-19T10:00:00+09:00"),
    ),
    null,
  );
});

test("does not mix programs from another festival day", () => {
  const result = findUpcomingProgramGroup(
    [program(1, [schedule("20:30", "day1")]), program(2, [schedule("20:30", "day2")])],
    new Date("2026-09-19T20:00:00+09:00"),
  );

  assert.equal(result?.startTime, "20:00");
  assert.deepEqual(
    result?.programs.map(({ id }) => id),
    [1],
  );
});

test("preserves all matching programs so the carousel can navigate beyond five", () => {
  const result = findUpcomingProgramGroup(
    Array.from({ length: 6 }, (_, index) => program(index + 1, [schedule("10:15")])),
    new Date("2026-09-19T10:00:00+09:00"),
  );

  assert.deepEqual(
    result?.programs.map(({ id }) => id),
    [1, 2, 3, 4, 5, 6],
  );
});

test("returns null when there is no valid candidate or now is invalid", () => {
  assert.equal(
    findUpcomingProgramGroup(
      [program(1, [schedule("invalid")]), program(2, [schedule("11:01")])],
      new Date("2026-09-19T10:00:00+09:00"),
    ),
    null,
  );

  assert.equal(
    findUpcomingProgramGroup([program(1, [schedule("10:10")])], new Date("invalid")),
    null,
  );
});
