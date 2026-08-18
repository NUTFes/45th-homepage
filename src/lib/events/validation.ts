import {
  FESTIVAL_DAY_ADMIN_LABELS,
  PROGRAM_AREA_LABELS,
  PROGRAM_CATEGORY_LABELS,
  PROGRAM_SCHEDULE_WEATHER_LABELS,
  PROGRAM_TIME_SLOT_MINUTES,
  TIMETABLE_END_TIME,
  TIMETABLE_START_TIME,
  type FestivalDay,
  type ProgramArea,
  type ProgramCategory,
  type ProgramScheduleWeather,
} from "./constants";

export type RelationshipId = number | string;

export type ProgramOrderRowInput = {
  id?: string | null;
  program?: unknown;
  programLabel?: string | null;
};

export type ScheduleItemInput = {
  id?: RelationshipId | null;
  weather?: string | null;
  day?: string | null;
  startTime?: string | null;
  endTime?: string | null;
};

type LabelableProgram = {
  title?: string | null;
  category?: string | null;
  area?: string | null;
  locationName?: string | null;
  _status?: "draft" | "published" | null;
};

const timePattern = /^\d{2}:\d{2}$/;

export const timeToMinutes = (time: string): number | null => {
  if (!timePattern.test(time)) return null;

  const [hour, minute] = time.split(":").map(Number);
  if (!Number.isInteger(hour) || !Number.isInteger(minute)) return null;
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;

  return hour * 60 + minute;
};

const formatMinutes = (minutes: number) => {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};

export const PROGRAM_TIME_OPTIONS = (() => {
  const start = timeToMinutes(TIMETABLE_START_TIME);
  const end = timeToMinutes(TIMETABLE_END_TIME);

  if (start === null || end === null) {
    return [];
  }

  const options: { label: string; value: string }[] = [];
  for (let minutes = start; minutes <= end; minutes += PROGRAM_TIME_SLOT_MINUTES) {
    const value = formatMinutes(minutes);
    options.push({ label: value, value });
  }

  return options;
})();

const validTimeValues = new Set(PROGRAM_TIME_OPTIONS.map(({ value }) => value));

export const isValidProgramTime = (value: unknown): value is string =>
  typeof value === "string" && validTimeValues.has(value);

export const validateProgramTimeValue = (value: unknown) => {
  if (isValidProgramTime(value)) {
    return true;
  }

  return `時刻は ${TIMETABLE_START_TIME} から ${TIMETABLE_END_TIME} までの ${PROGRAM_TIME_SLOT_MINUTES}分刻みで選択してください。`;
};

const scheduleItemLabel = (item: ScheduleItemInput) => {
  const dayLabel =
    item.day && item.day in FESTIVAL_DAY_ADMIN_LABELS
      ? FESTIVAL_DAY_ADMIN_LABELS[item.day as FestivalDay]
      : "日付未設定";
  const startTime = item.startTime ?? "開始未設定";
  const endTime = item.endTime ?? "終了未設定";
  const weatherLabel =
    item.weather && item.weather in PROGRAM_SCHEDULE_WEATHER_LABELS
      ? PROGRAM_SCHEDULE_WEATHER_LABELS[item.weather as ProgramScheduleWeather]
      : "天候未設定";

  return `${dayLabel} ${startTime}-${endTime} / ${weatherLabel}`;
};

const isIncludedInSunnySchedule = (weather: string | null | undefined) =>
  weather === "both" || weather === "sunny";

const isIncludedInRainySchedule = (weather: string | null | undefined) =>
  weather === "both" || weather === "rainy";

const hasTimeOverlap = (a: ScheduleItemInput, b: ScheduleItemInput) => {
  if (a.day !== b.day) return false;
  if (!a.startTime || !a.endTime || !b.startTime || !b.endTime) return false;

  const aStart = timeToMinutes(a.startTime);
  const aEnd = timeToMinutes(a.endTime);
  const bStart = timeToMinutes(b.startTime);
  const bEnd = timeToMinutes(b.endTime);

  if (aStart === null || aEnd === null || bStart === null || bEnd === null) {
    return false;
  }

  return aStart < bEnd && bStart < aEnd;
};

export const validateScheduleItems = (scheduleItems: unknown) => {
  if (!Array.isArray(scheduleItems) || scheduleItems.length === 0) {
    return "開催日時を1件以上登録してください。";
  }

  for (const item of scheduleItems as ScheduleItemInput[]) {
    if (!item.weather) return "開催日時の天候を選択してください。";
    if (!item.day) return "開催日時の日付を選択してください。";
    if (!item.startTime) return "開催日時の開始時刻を選択してください。";
    if (!item.endTime) return "開催日時の終了時刻を選択してください。";

    const startResult = validateProgramTimeValue(item.startTime);
    if (startResult !== true) return startResult;

    const endResult = validateProgramTimeValue(item.endTime);
    if (endResult !== true) return endResult;

    const start = timeToMinutes(item.startTime);
    const end = timeToMinutes(item.endTime);

    if (start === null || end === null || start >= end) {
      return "開始時刻は終了時刻より前にしてください。";
    }
  }

  for (let i = 0; i < scheduleItems.length; i += 1) {
    const current = scheduleItems[i] as ScheduleItemInput;

    for (let j = i + 1; j < scheduleItems.length; j += 1) {
      const next = scheduleItems[j] as ScheduleItemInput;
      const overlaps = hasTimeOverlap(current, next);

      if (!overlaps) {
        continue;
      }

      if (isIncludedInSunnySchedule(current.weather) && isIncludedInSunnySchedule(next.weather)) {
        return `${scheduleItemLabel(current)} と ${scheduleItemLabel(next)} が晴れスケジュール上で重複しています。`;
      }

      if (isIncludedInRainySchedule(current.weather) && isIncludedInRainySchedule(next.weather)) {
        return `${scheduleItemLabel(current)} と ${scheduleItemLabel(next)} が雨スケジュール上で重複しています。`;
      }
    }
  }

  return true;
};

export const normalizeRelationshipId = (value: unknown): RelationshipId | null => {
  if (typeof value === "number" || typeof value === "string") {
    return value;
  }

  if (typeof value === "object" && value !== null && "id" in value) {
    const id = (value as { id?: unknown }).id;
    if (typeof id === "number" || typeof id === "string") {
      return id;
    }
  }

  return null;
};

export const normalizeRelationshipIds = (value: unknown): RelationshipId[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    const id = normalizeRelationshipId(item);
    return id === null ? [] : [id];
  });
};

export const getProgramOrderRowProgramId = (row: unknown): RelationshipId | null => {
  if (typeof row !== "object" || row === null || Array.isArray(row) || !("program" in row)) {
    return null;
  }

  return normalizeRelationshipId(row.program);
};

export const normalizeProgramOrderIds = (value: unknown): RelationshipId[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((row) => {
    const id = getProgramOrderRowProgramId(row);
    return id === null ? [] : [id];
  });
};

export const relationshipIdKey = (id: RelationshipId) => String(id);

export const buildProgramAdminLabel = (program: LabelableProgram) => {
  const title = program.title?.trim() || "企画名未設定";
  const categoryLabel =
    program.category && program.category in PROGRAM_CATEGORY_LABELS
      ? PROGRAM_CATEGORY_LABELS[program.category as ProgramCategory]
      : "カテゴリ未設定";
  const areaLabel =
    program.area && program.area in PROGRAM_AREA_LABELS
      ? PROGRAM_AREA_LABELS[program.area as ProgramArea]
      : "エリア未設定";
  const locationName = program.locationName?.trim() || "場所未設定";
  const status = program._status === "published" ? "公開中" : "下書き";

  return `${title} / ${categoryLabel} / ${areaLabel} / ${locationName} / ${status}`;
};
