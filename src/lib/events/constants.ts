export const PROGRAM_CATEGORIES = [
  { value: "program", label: "企画" },
  { value: "exhibition", label: "展示・体験" },
  { value: "food", label: "食品販売" },
  { value: "goods", label: "物品販売" },
  { value: "corporate", label: "企業ブース" },
] as const;

export const FESTIVAL_DAYS = {
  day1: {
    value: "day1",
    label: "1日目",
    adminLabel: "1日目（9/19 土）",
    date: "2026-09-19",
  },
  day2: {
    value: "day2",
    label: "2日目",
    adminLabel: "2日目（9/20 日）",
    date: "2026-09-20",
  },
  timezone: "Asia/Tokyo",
} as const;

export const PROGRAM_AREAS = [
  { value: "lecture", label: "講義棟" },
  { value: "gym", label: "体育館" },
  { value: "outdoor", label: "屋外" },
  { value: "kitchen_car", label: "キッチンカーエリア" },
  { value: "other", label: "その他" },
] as const;

export const PROGRAM_TIME_SLOT_MINUTES = 15;

export const TIMETABLE_START_TIME = "10:00";
export const TIMETABLE_END_TIME = "20:30";

export const TOP_PROGRAM_LIMIT_PER_CATEGORY = 5;

export const UPCOMING_PROGRAM_LIMIT = 5;
export const UPCOMING_PROGRAM_WINDOW_MINUTES = 30;

export const PROGRAM_SCHEDULE_WEATHERS = [
  { value: "both", label: "晴れ・雨 共通" },
  { value: "sunny", label: "晴れのみ" },
  { value: "rainy", label: "雨のみ" },
] as const;

export const WEATHER_OPTIONS = [
  { value: "sunny", label: "晴れ" },
  { value: "rainy", label: "雨" },
] as const;

export type ProgramCategory = (typeof PROGRAM_CATEGORIES)[number]["value"];
export type FestivalDay = keyof Pick<typeof FESTIVAL_DAYS, "day1" | "day2">;
export type ProgramArea = (typeof PROGRAM_AREAS)[number]["value"];
export type ProgramScheduleWeather = (typeof PROGRAM_SCHEDULE_WEATHERS)[number]["value"];
export type Weather = (typeof WEATHER_OPTIONS)[number]["value"];

export const PROGRAM_CATEGORY_ITEM_FIELDS = {
  program: "programItems",
  exhibition: "exhibitionItems",
  food: "foodItems",
  goods: "goodsItems",
  corporate: "corporateItems",
} as const satisfies Record<ProgramCategory, string>;

export type ProgramCategoryItemField =
  (typeof PROGRAM_CATEGORY_ITEM_FIELDS)[keyof typeof PROGRAM_CATEGORY_ITEM_FIELDS];

export const PROGRAM_CATEGORY_LABELS = Object.fromEntries(
  PROGRAM_CATEGORIES.map(({ label, value }) => [value, label]),
) as Record<ProgramCategory, string>;

export const PROGRAM_AREA_LABELS = Object.fromEntries(
  PROGRAM_AREAS.map(({ label, value }) => [value, label]),
) as Record<ProgramArea, string>;

export const PROGRAM_SCHEDULE_WEATHER_LABELS = Object.fromEntries(
  PROGRAM_SCHEDULE_WEATHERS.map(({ label, value }) => [value, label]),
) as Record<ProgramScheduleWeather, string>;

export const FESTIVAL_DAY_LABELS = {
  day1: FESTIVAL_DAYS.day1.label,
  day2: FESTIVAL_DAYS.day2.label,
} as const satisfies Record<FestivalDay, string>;

export const FESTIVAL_DAY_ADMIN_LABELS = {
  day1: FESTIVAL_DAYS.day1.adminLabel,
  day2: FESTIVAL_DAYS.day2.adminLabel,
} as const satisfies Record<FestivalDay, string>;

export const toPayloadSelectOptions = <T extends readonly { label: string; value: string }[]>(
  options: T,
) =>
  options.map(({ label, value }) => ({
    label: {
      ja: label,
      en: value,
    },
    value,
  }));

export const FESTIVAL_DAY_SELECT_OPTIONS = [
  {
    label: {
      ja: FESTIVAL_DAYS.day1.adminLabel,
      en: FESTIVAL_DAYS.day1.value,
    },
    value: FESTIVAL_DAYS.day1.value,
  },
  {
    label: {
      ja: FESTIVAL_DAYS.day2.adminLabel,
      en: FESTIVAL_DAYS.day2.value,
    },
    value: FESTIVAL_DAYS.day2.value,
  },
];
