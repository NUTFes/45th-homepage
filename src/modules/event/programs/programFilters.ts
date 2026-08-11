import type { EventProgramDTO } from "@/modules/events/types";
import { toFestivalDateTime } from "@/modules/events/presentation";
import type { CategoryFilterDefinition } from "@/modules/event/ui/categoryMenuData";

export type ProgramFilterState = {
  selectedFilterValues: readonly string[];
  activeOnly: boolean;
  now: Date;
};

function matchesDefinition(
  program: EventProgramDTO,
  definition: CategoryFilterDefinition,
): boolean {
  const { match } = definition;

  switch (match.type) {
    case "category":
      return program.category === match.value;
    case "area":
      return program.area === match.value;
    case "day":
      return program.scheduleItems.some((item) => item.day === match.value);
    case "programTag":
      return program.tags.some((tag) => tag.value === match.value);
  }
}

export function isProgramActiveAt(program: EventProgramDTO, now: Date): boolean {
  const nowTime = now.getTime();
  if (!Number.isFinite(nowTime)) {
    return false;
  }

  return program.scheduleItems.some((item) => {
    const startsAt = Date.parse(toFestivalDateTime(item.day, item.startTime));
    const endsAt = Date.parse(toFestivalDateTime(item.day, item.endTime));
    return startsAt <= nowTime && nowTime < endsAt;
  });
}

export function filterPrograms(
  programs: readonly EventProgramDTO[],
  definitions: readonly CategoryFilterDefinition[],
  state: ProgramFilterState,
): EventProgramDTO[] {
  const definitionByValue = new Map(
    definitions.map((definition) => [definition.value, definition]),
  );
  const selectedDefinitions = state.selectedFilterValues.flatMap((value) => {
    const definition = definitionByValue.get(value);
    return definition ? [definition] : [];
  });

  return programs.filter((program) => {
    const matchesFilters =
      selectedDefinitions.length === 0 ||
      selectedDefinitions.some((definition) => matchesDefinition(program, definition));

    return matchesFilters && (!state.activeOnly || isProgramActiveAt(program, state.now));
  });
}
