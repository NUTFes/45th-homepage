import {
  FESTIVAL_DAY_LABELS,
  PROGRAM_AREAS,
  PROGRAM_CATEGORIES,
  PROGRAM_SCHEDULE_WEATHERS,
  PROGRAM_TAG_LABELS,
  PROGRAM_TAGS,
  WEATHER_OPTIONS,
  type FestivalDay,
  type ProgramArea,
  type ProgramCategory,
  type ProgramScheduleWeather,
  type ProgramTagValue,
  type Weather,
} from "@/lib/events/constants";
import type { Media, Program } from "@/payload-types";

import type { EventMediaDTO, EventProgramDTO, EventProgramTagDTO } from "./types";

const programCategoryValues = new Set(PROGRAM_CATEGORIES.map(({ value }) => value));
const programAreaValues = new Set(PROGRAM_AREAS.map(({ value }) => value));
const scheduleWeatherValues = new Set(PROGRAM_SCHEDULE_WEATHERS.map(({ value }) => value));
const programTagValues = new Set(PROGRAM_TAGS.map(({ value }) => value));
const weatherValues = new Set(WEATHER_OPTIONS.map(({ value }) => value));
const festivalDayValues = new Set(Object.keys(FESTIVAL_DAY_LABELS));

export const isProgramCategory = (value: unknown): value is ProgramCategory =>
  typeof value === "string" && programCategoryValues.has(value as ProgramCategory);

export const isProgramArea = (value: unknown): value is ProgramArea =>
  typeof value === "string" && programAreaValues.has(value as ProgramArea);

export const isProgramScheduleWeather = (value: unknown): value is ProgramScheduleWeather =>
  typeof value === "string" && scheduleWeatherValues.has(value as ProgramScheduleWeather);

export const isProgramTagValue = (value: unknown): value is ProgramTagValue =>
  typeof value === "string" && programTagValues.has(value as ProgramTagValue);

export const isWeather = (value: unknown): value is Weather =>
  typeof value === "string" && weatherValues.has(value as Weather);

export const isFestivalDay = (value: unknown): value is FestivalDay =>
  typeof value === "string" && festivalDayValues.has(value);

const isMediaDoc = (value: Program["image"]): value is Media =>
  typeof value === "object" && value !== null && "id" in value;

export const toEventMediaDTO = (value: Program["image"]): EventMediaDTO | undefined => {
  if (!isMediaDoc(value) || !value.url) {
    return undefined;
  }

  return {
    id: value.id,
    url: value.url,
    alt: value.alt,
    ...(value.width ? { width: value.width } : {}),
    ...(value.height ? { height: value.height } : {}),
  };
};

export const toEventProgramTagDTO = (value: unknown): EventProgramTagDTO | null => {
  if (!isProgramTagValue(value)) {
    return null;
  }

  return {
    value,
    label: PROGRAM_TAG_LABELS[value],
  };
};

export const toEventProgramDTO = (program: Program): EventProgramDTO | null => {
  if (program._status !== "published") {
    return null;
  }

  if (!isProgramCategory(program.category) || !isProgramArea(program.area)) {
    return null;
  }

  const scheduleItems = (program.scheduleItems ?? []).flatMap((item) => {
    if (
      !isProgramScheduleWeather(item.weather) ||
      !isFestivalDay(item.day) ||
      !item.startTime ||
      !item.endTime
    ) {
      return [];
    }

    return [
      {
        weather: item.weather,
        day: item.day,
        startTime: item.startTime,
        endTime: item.endTime,
      },
    ];
  });

  return {
    id: program.id,
    title: program.title,
    category: program.category,
    area: program.area,
    locationName: program.locationName,
    image: toEventMediaDTO(program.image),
    mapImage: toEventMediaDTO(program.mapImage),
    tags: (program.tags ?? [])
      .map(toEventProgramTagDTO)
      .filter((tag): tag is EventProgramTagDTO => tag !== null),
    ...(program.catchphrase ? { catchphrase: program.catchphrase } : {}),
    description: program.description,
    scheduleItems,
  };
};

export const filterProgramsForWeather = (
  programs: readonly EventProgramDTO[],
  weather: Weather,
): EventProgramDTO[] =>
  programs
    .map((program) => filterProgramScheduleForWeather(program, weather))
    .filter((program) => program.scheduleItems.length > 0);

export const filterProgramScheduleForWeather = (
  program: EventProgramDTO,
  weather: Weather,
): EventProgramDTO => ({
  ...program,
  scheduleItems: program.scheduleItems.filter(
    (item) => item.weather === "both" || item.weather === weather,
  ),
});
