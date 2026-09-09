import type { EventSchedule } from "@/components/ui/EventInfoCard";
import type { EventFrameProps } from "@/components/ui/EventFrame";
import {
  FESTIVAL_DAYS,
  UPCOMING_PROGRAM_WINDOW_MINUTES,
  type FestivalDay,
  type ProgramCategory,
} from "@/lib/events/constants";

import type { EventProgramDTO, EventScheduleItemDTO, EventsPageCategoryDTO } from "./types";

const EVENT_CARD_FALLBACK_IMAGE = "/favicon/45th-LogoBlue.svg";

const FESTIVAL_DATE_LABELS = {
  day1: "9月19日(土)",
  day2: "9月20日(日)",
} as const satisfies Record<FestivalDay, string>;

export function toEventFrameProps(program: EventProgramDTO): EventFrameProps {
  return {
    name: program.title,
    href: `/event/programs/${program.id}`,
    imageUrl: program.image?.url ?? EVENT_CARD_FALLBACK_IMAGE,
  };
}

export function toFestivalDateTime(day: FestivalDay, time: string): string {
  return `${FESTIVAL_DAYS[day].date}T${time}:00+09:00`;
}

export function toEventSchedules(scheduleItems: readonly EventScheduleItemDTO[]): EventSchedule[] {
  return scheduleItems
    .map((item) => ({
      dateLabel: FESTIVAL_DATE_LABELS[item.day],
      startLabel: item.startTime,
      endLabel: item.endTime,
      startsAt: toFestivalDateTime(item.day, item.startTime),
      endsAt: toFestivalDateTime(item.day, item.endTime),
    }))
    .sort((left, right) => left.startsAt.localeCompare(right.startsAt));
}

export function flattenEventCategories(
  categories: readonly EventsPageCategoryDTO[],
): EventProgramDTO[] {
  return categories.flatMap((category) => category.programs);
}

export function findUpcomingProgramGroup(
  programs: readonly EventProgramDTO[],
  now: Date,
): { startTime: string; programs: EventProgramDTO[] } | null {
  const nowTime = now.getTime();
  if (!Number.isFinite(nowTime)) {
    return null;
  }

  const windowEndTime = nowTime + UPCOMING_PROGRAM_WINDOW_MINUTES * 60_000;
  let nearestStartTime = Number.POSITIVE_INFINITY;
  let nearestDay: FestivalDay | null = null;
  let nearestHour: string | null = null;

  for (const program of programs) {
    for (const item of program.scheduleItems) {
      const startTime = Date.parse(toFestivalDateTime(item.day, item.startTime));
      if (!Number.isFinite(startTime) || startTime <= nowTime || startTime > windowEndTime) {
        continue;
      }

      if (startTime < nearestStartTime) {
        nearestStartTime = startTime;
        nearestDay = item.day;
        nearestHour = item.startTime.slice(0, 2);
      }
    }
  }

  if (nearestDay === null || nearestHour === null) {
    return null;
  }

  const upcomingPrograms = programs.filter((program) =>
    program.scheduleItems.some((item) => {
      if (item.day !== nearestDay || !item.startTime.startsWith(`${nearestHour}:`)) {
        return false;
      }

      const startTime = Date.parse(toFestivalDateTime(item.day, item.startTime));
      return Number.isFinite(startTime) && startTime > nowTime;
    }),
  );

  return {
    startTime: `${nearestHour}:00`,
    programs: upcomingPrograms,
  };
}

export function filterEventCategoriesByPrograms(
  categories: readonly EventsPageCategoryDTO[],
  programs: readonly EventProgramDTO[],
): EventsPageCategoryDTO[] {
  const visibleProgramIds = new Set(programs.map((program) => String(program.id)));

  return categories.map((category) => ({
    ...category,
    programs: category.programs.filter((program) => visibleProgramIds.has(String(program.id))),
  }));
}

export function findEventCategory(
  categories: readonly EventsPageCategoryDTO[],
  category: ProgramCategory,
): EventsPageCategoryDTO | undefined {
  return categories.find((item) => item.category === category);
}
