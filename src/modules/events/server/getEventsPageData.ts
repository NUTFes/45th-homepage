import { cacheLife, cacheTag } from "next/cache";
import { getPayload } from "payload";

import { CACHE_TAGS } from "@/lib/cacheTags";
import {
  PROGRAM_CATEGORIES,
  PROGRAM_CATEGORY_ITEM_FIELDS,
  PROGRAM_CATEGORY_LABELS,
} from "@/lib/events/constants";
import { normalizeProgramOrderIds, relationshipIdKey } from "@/lib/events/validation";
import config from "@/payload.config";

import type { EventProgramDTO, EventsPageDTO } from "../types";
import { filterProgramsForWeather, isWeather } from "../utils";
import { queryPrograms } from "./getPrograms";

export async function getEventsPageData(): Promise<EventsPageDTO> {
  "use cache";
  cacheTag(CACHE_TAGS.events, CACHE_TAGS.eventsPage, CACHE_TAGS.weatherSettings);
  cacheLife("minutes");

  const payload = await getPayload({ config });
  const [eventsPage, runtimeSettings, programs] = await Promise.all([
    payload.findGlobal({
      slug: "events-page",
      depth: 1,
      overrideAccess: true,
    }),
    payload.findGlobal({
      slug: "weather-settings",
      depth: 0,
      overrideAccess: true,
    }),
    queryPrograms(),
  ]);

  const weather = isWeather(runtimeSettings.weather) ? runtimeSettings.weather : "sunny";
  const visiblePrograms = filterProgramsForWeather(programs, weather);
  const programsById = new Map(
    visiblePrograms.map((program) => [relationshipIdKey(program.id), program]),
  );

  const categories = PROGRAM_CATEGORIES.map((category) => {
    const field = PROGRAM_CATEGORY_ITEM_FIELDS[category.value];
    const orderedPrograms = normalizeProgramOrderIds(eventsPage[field])
      .map((id) => programsById.get(relationshipIdKey(id)))
      .filter((program): program is EventProgramDTO => program !== undefined);

    return {
      category: category.value,
      label: PROGRAM_CATEGORY_LABELS[category.value],
      programs: orderedPrograms,
    };
  });

  return {
    categories,
    weather,
  };
}
