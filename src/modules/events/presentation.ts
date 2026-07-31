import type { EventSchedule } from "@/components/ui/EventInfoCard";
import type { EventFrameProps } from "@/components/ui/EventFrame";
import { FESTIVAL_DAYS, type FestivalDay, type ProgramCategory } from "@/lib/events/constants";

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
  const seenIds = new Set<string>();

  return categories.flatMap((category) =>
    category.programs.filter((program) => {
      const id = String(program.id);
      if (seenIds.has(id)) {
        return false;
      }

      seenIds.add(id);
      return true;
    }),
  );
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
