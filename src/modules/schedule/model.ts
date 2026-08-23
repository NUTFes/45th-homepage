import { FESTIVAL_DAYS, type FestivalDay, type Weather } from "@/lib/events/constants";
import { timeToMinutes } from "@/lib/events/validation";

import type { ScheduleItemDTO, TimetablePageDTO } from "./types";

export type TimetableTick = {
  label: string;
  offsetSlots: number;
  isFirst: boolean;
  isLast: boolean;
};

export type PositionedScheduleItem = ScheduleItemDTO & {
  durationSlots: number;
  displayDurationSlots: number;
  startOffsetSlots: number;
};

export type TimetableModel = {
  items: PositionedScheduleItem[];
  slotCount: number;
  ticks: TimetableTick[];
};

export type ScheduleSpotlight =
  | { kind: "checking" }
  | {
      kind: "ready";
      current: PositionedScheduleItem | null;
      next: PositionedScheduleItem | null;
    };

export type ScheduleDisplaySelection = {
  day: FestivalDay;
  weather: Weather;
};

const MINIMUM_CARD_DISPLAY_MINUTES = 30;

const formatTime = (minutes: number) => {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};

function getRangeMinutes(range: TimetablePageDTO["range"]) {
  const start = timeToMinutes(range.startTime);
  const end = timeToMinutes(range.endTime);

  if (
    start === null ||
    end === null ||
    start >= end ||
    !Number.isInteger(range.slotMinutes) ||
    range.slotMinutes <= 0 ||
    (end - start) % range.slotMinutes !== 0
  ) {
    return null;
  }

  return { start, end };
}

function buildTicks(start: number, end: number, slotMinutes: number): TimetableTick[] {
  const tickMinutes: number[] = [];
  for (let minutes = start; minutes <= end; minutes += 60) {
    tickMinutes.push(minutes);
  }
  if (tickMinutes.at(-1) !== end) {
    tickMinutes.push(end);
  }

  return tickMinutes.map((minutes, index) => ({
    label: formatTime(minutes),
    offsetSlots: (minutes - start) / slotMinutes,
    isFirst: index === 0,
    isLast: index === tickMinutes.length - 1,
  }));
}

export function filterScheduleItemsForDisplay(
  items: readonly ScheduleItemDTO[],
  selection: ScheduleDisplaySelection,
): ScheduleItemDTO[] {
  return items.filter(
    (item) =>
      item.day === selection.day && (item.weather === "both" || item.weather === selection.weather),
  );
}

export function buildTimetableModel(
  data: Pick<TimetablePageDTO, "items" | "range">,
  laneId: string | null,
): TimetableModel {
  const range = getRangeMinutes(data.range);
  if (!range) {
    return { items: [], slotCount: 0, ticks: [] };
  }

  const slotCount = (range.end - range.start) / data.range.slotMinutes;
  const items = laneId
    ? data.items.flatMap((item): PositionedScheduleItem[] => {
        if (item.laneId !== laneId) {
          return [];
        }

        const start = timeToMinutes(item.startTime);
        const end = timeToMinutes(item.endTime);
        if (
          start === null ||
          end === null ||
          start < range.start ||
          end > range.end ||
          start >= end
        ) {
          return [];
        }

        return [
          {
            ...item,
            startOffsetSlots: (start - range.start) / data.range.slotMinutes,
            durationSlots: (end - start) / data.range.slotMinutes,
            displayDurationSlots: (end - start) / data.range.slotMinutes,
          },
        ];
      })
    : [];

  items.sort(
    (left, right) =>
      left.startOffsetSlots - right.startOffsetSlots ||
      left.durationSlots - right.durationSlots ||
      left.title.localeCompare(right.title, "ja"),
  );

  const minimumDisplaySlots = MINIMUM_CARD_DISPLAY_MINUTES / data.range.slotMinutes;
  items.forEach((item, index) => {
    const nextItem = items[index + 1];
    const availableSlotsUntilNext = nextItem
      ? nextItem.startOffsetSlots - item.startOffsetSlots
      : Number.POSITIVE_INFINITY;

    item.displayDurationSlots = Math.max(
      item.durationSlots,
      Math.min(minimumDisplaySlots, availableSlotsUntilNext),
    );
  });

  return {
    items,
    slotCount,
    ticks: buildTicks(range.start, range.end, data.range.slotMinutes),
  };
}

const toFestivalDateTime = (day: FestivalDay, time: string) =>
  Date.parse(`${FESTIVAL_DAYS[day].date}T${time}:00+09:00`);

const festivalDateFormatter = new Intl.DateTimeFormat("en", {
  timeZone: FESTIVAL_DAYS.timezone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const getFestivalLocalDate = (date: Date) => {
  const parts = festivalDateFormatter.formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return year && month && day ? `${year}-${month}-${day}` : null;
};

export function getScheduleSpotlight(
  items: readonly PositionedScheduleItem[],
  now: Date | null,
  selectedDay: FestivalDay,
): ScheduleSpotlight {
  if (!now) {
    return { kind: "checking" };
  }

  const nowTime = now.getTime();
  if (!Number.isFinite(nowTime)) {
    return { kind: "ready", current: null, next: null };
  }

  if (getFestivalLocalDate(now) !== FESTIVAL_DAYS[selectedDay].date) {
    return { kind: "ready", current: null, next: null };
  }

  const current =
    items.find((item) => {
      const startsAt = toFestivalDateTime(item.day, item.startTime);
      const endsAt = toFestivalDateTime(item.day, item.endTime);
      return startsAt <= nowTime && nowTime < endsAt;
    }) ?? null;
  const next = items.find((item) => toFestivalDateTime(item.day, item.startTime) > nowTime) ?? null;

  return { kind: "ready", current, next };
}
