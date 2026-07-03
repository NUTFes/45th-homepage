import { cacheLife, cacheTag } from "next/cache";
import { getPayload } from "payload";

import { CACHE_TAGS } from "@/lib/cacheTags";
import config from "@/payload.config";

import type { SchedulePageDTO } from "../types";
import { filterProgramsForWeather, isWeather } from "../utils";
import { getPrograms } from "./getPrograms";

export async function getSchedulePageData(): Promise<SchedulePageDTO> {
  "use cache";
  cacheTag(CACHE_TAGS.events, CACHE_TAGS.weatherSettings);
  cacheLife("minutes");

  const payload = await getPayload({ config });
  const [runtimeSettings, programs] = await Promise.all([
    payload.findGlobal({
      slug: "weather-settings",
      depth: 0,
      overrideAccess: true,
    }),
    getPrograms(),
  ]);
  const weather = isWeather(runtimeSettings.weather) ? runtimeSettings.weather : "sunny";

  return {
    programs: filterProgramsForWeather(programs, weather),
    weather,
  };
}
