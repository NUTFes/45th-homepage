import { FESTIVAL_DAYS } from "@/lib/events/constants";
import { timeToMinutes } from "@/lib/events/validation";

export type BusDeparture = {
  time: string;
  type: "shuttle" | "route";
};

export const BUS_TIMETABLE = {
  toUniversity: [
    { time: "09:35", type: "route" },
    { time: "10:00", type: "shuttle" },
    { time: "10:05", type: "route" },
    { time: "11:00", type: "shuttle" },
    { time: "11:05", type: "route" },
    { time: "12:05", type: "route" },
    { time: "13:00", type: "shuttle" },
    { time: "13:05", type: "route" },
    { time: "14:00", type: "shuttle" },
    { time: "14:05", type: "route" },
    { time: "15:05", type: "route" },
    { time: "16:05", type: "route" },
    { time: "17:35", type: "route" },
    { time: "18:35", type: "route" },
    { time: "19:35", type: "route" },
    { time: "20:30", type: "route" },
  ],
  toStation: [
    { time: "09:25", type: "route" },
    { time: "10:30", type: "shuttle" },
    { time: "11:02", type: "route" },
    { time: "11:30", type: "shuttle" },
    { time: "12:02", type: "route" },
    { time: "13:14", type: "route" },
    { time: "13:30", type: "shuttle" },
    { time: "14:02", type: "route" },
    { time: "14:30", type: "shuttle" },
    { time: "14:55", type: "route" },
    { time: "16:02", type: "route" },
    { time: "17:00", type: "route" },
    { time: "17:39", type: "route" },
    { time: "18:30", type: "route" },
    { time: "19:03", type: "route" },
    { time: "19:45", type: "route" },
  ],
} as const satisfies Record<"toUniversity" | "toStation", readonly BusDeparture[]>;

type FestivalBusInfo = {
  kind: "festival";
  toUniversity: BusDeparture | null;
  toStation: BusDeparture | null;
};

type OffFestivalBusInfo = {
  kind: "offFestival";
};

export type NextBusInfoState = FestivalBusInfo | OffFestivalBusInfo;

const festivalDateTimeFormatter = new Intl.DateTimeFormat("ja-JP-u-ca-gregory", {
  timeZone: FESTIVAL_DAYS.timezone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const getPart = (
  parts: Intl.DateTimeFormatPart[],
  type: "year" | "month" | "day" | "hour" | "minute",
) => {
  const value = parts.find((part) => part.type === type)?.value;
  if (value === undefined) {
    throw new Error(`日時の ${type} を取得できませんでした`);
  }
  return value;
};

const getNextDeparture = (
  departures: readonly BusDeparture[],
  currentMinutes: number,
): BusDeparture | null =>
  departures.find((departure) => {
    const departureMinutes = timeToMinutes(departure.time);
    return departureMinutes !== null && departureMinutes >= currentMinutes;
  }) ?? null;

export const getNextBusInfo = (now: Date): NextBusInfoState => {
  const parts = festivalDateTimeFormatter.formatToParts(now);
  const localDate = `${getPart(parts, "year")}-${getPart(parts, "month")}-${getPart(parts, "day")}`;

  if (localDate !== FESTIVAL_DAYS.day1.date && localDate !== FESTIVAL_DAYS.day2.date) {
    return { kind: "offFestival" };
  }

  const currentMinutes =
    Number(getPart(parts, "hour")) * 60 +
    Number(getPart(parts, "minute")) +
    (now.getSeconds() * 1000 + now.getMilliseconds()) / 60_000;

  return {
    kind: "festival",
    toUniversity: getNextDeparture(BUS_TIMETABLE.toUniversity, currentMinutes),
    toStation: getNextDeparture(BUS_TIMETABLE.toStation, currentMinutes),
  };
};
