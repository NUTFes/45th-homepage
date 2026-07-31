import { cacheLife, cacheTag } from "next/cache";
import { getPayload } from "payload";

import { CACHE_TAGS } from "@/lib/cacheTags";
import config from "@/payload.config";

import type { EventProgramDTO } from "../types";
import { filterProgramScheduleForWeather, isWeather } from "../utils";
import { queryProgram } from "./getProgram";

export async function getProgramDetailPageData(
  id: string | number,
): Promise<EventProgramDTO | null> {
  "use cache";
  cacheTag(CACHE_TAGS.events, CACHE_TAGS.weatherSettings);
  cacheLife("minutes");

  const payload = await getPayload({ config });
  const [program, runtimeSettings] = await Promise.all([
    queryProgram(id),
    payload.findGlobal({
      slug: "weather-settings",
      depth: 0,
      overrideAccess: true,
    }),
  ]);

  if (!program) {
    return null;
  }

  const weather = isWeather(runtimeSettings.weather) ? runtimeSettings.weather : "sunny";
  return filterProgramScheduleForWeather(program, weather);
}
