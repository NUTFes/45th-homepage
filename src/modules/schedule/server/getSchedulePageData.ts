import { cacheLife, cacheTag } from "next/cache";
import { getPayload } from "payload";

import { CACHE_TAGS } from "@/lib/cacheTags";
import {
  FESTIVAL_DAYS,
  PROGRAM_TIME_SLOT_MINUTES,
  TIMETABLE_DISPLAY_END_TIME,
  TIMETABLE_START_TIME,
} from "@/lib/events/constants";
import { normalizeRelationshipId } from "@/lib/events/validation";
import { isWeather } from "@/modules/events/utils";
import config from "@/payload.config";

import type { ScheduleGroupDTO, ScheduleItemDTO, TimetablePageDTO } from "../types";

const bySortOrderThenName = (
  left: { name: string; sortOrder: number },
  right: { name: string; sortOrder: number },
) => left.sortOrder - right.sortOrder || left.name.localeCompare(right.name, "ja");

const relationshipKey = (value: unknown) => {
  const id = normalizeRelationshipId(value);
  return id === null ? null : String(id);
};

export async function getSchedulePageData(): Promise<TimetablePageDTO> {
  "use cache";
  cacheTag(CACHE_TAGS.timetable, CACHE_TAGS.weatherSettings);
  cacheLife("minutes");

  const payload = await getPayload({ config });
  const [runtimeSettings, groupResult, laneResult, listingResult, programResult] =
    await Promise.all([
      payload.findGlobal({
        slug: "weather-settings",
        depth: 0,
        overrideAccess: true,
      }),
      payload.find({
        collection: "timetable-groups",
        depth: 0,
        limit: 1000,
        overrideAccess: true,
        pagination: false,
        select: {
          id: true,
          name: true,
          sortOrder: true,
        },
        where: { isActive: { equals: true } },
      }),
      payload.find({
        collection: "timetable-lanes",
        depth: 0,
        limit: 1000,
        overrideAccess: true,
        pagination: false,
        select: {
          id: true,
          timetableGroup: true,
          name: true,
          sortOrder: true,
        },
        where: { isActive: { equals: true } },
      }),
      payload.find({
        collection: "timetable-listings",
        depth: 0,
        limit: 1000,
        overrideAccess: true,
        pagination: false,
        select: {
          id: true,
          program: true,
          timetableGroup: true,
          timetableLane: true,
          weather: true,
          day: true,
          startTime: true,
          endTime: true,
        },
        where: { configurationStatus: { equals: "1_configured" } },
      }),
      payload.find({
        collection: "programs",
        depth: 0,
        limit: 1000,
        overrideAccess: true,
        pagination: false,
        select: { id: true, title: true },
        where: { _status: { equals: "published" } },
      }),
    ]);

  const activeGroupIds = new Set(groupResult.docs.map((group) => String(group.id)));
  const activeLanes = laneResult.docs.filter((lane) => {
    const groupId = relationshipKey(lane.timetableGroup);
    return groupId !== null && activeGroupIds.has(groupId);
  });
  const laneById = new Map(activeLanes.map((lane) => [String(lane.id), lane]));
  const publishedProgramTitles = new Map(
    programResult.docs.map((program) => [String(program.id), program.title]),
  );

  const groups: ScheduleGroupDTO[] = groupResult.docs
    .map((group) => {
      const groupId = String(group.id);
      return {
        id: groupId,
        name: group.name,
        sortOrder: group.sortOrder,
        lanes: activeLanes
          .filter((lane) => relationshipKey(lane.timetableGroup) === groupId)
          .map((lane) => ({
            id: String(lane.id),
            name: lane.name,
            sortOrder: lane.sortOrder,
          }))
          .sort(bySortOrderThenName),
      };
    })
    .filter((group) => group.lanes.length > 0)
    .sort(bySortOrderThenName);

  const items = listingResult.docs.flatMap((listing): ScheduleItemDTO[] => {
    const programId = relationshipKey(listing.program);
    const groupId = relationshipKey(listing.timetableGroup);
    const laneId = relationshipKey(listing.timetableLane);
    if (programId === null || groupId === null || laneId === null) {
      return [];
    }

    const lane = laneById.get(laneId);
    const title = publishedProgramTitles.get(programId);
    if (
      !lane ||
      !title ||
      relationshipKey(lane.timetableGroup) !== groupId ||
      !activeGroupIds.has(groupId)
    ) {
      return [];
    }

    return [
      {
        id: String(listing.id),
        title,
        href: `/event/programs/${programId}`,
        weather: listing.weather,
        day: listing.day,
        startTime: listing.startTime,
        endTime: listing.endTime,
        laneId,
      },
    ];
  });

  return {
    days: [
      {
        value: FESTIVAL_DAYS.day1.value,
        label: FESTIVAL_DAYS.day1.scheduleLabel,
        date: FESTIVAL_DAYS.day1.date,
      },
      {
        value: FESTIVAL_DAYS.day2.value,
        label: FESTIVAL_DAYS.day2.scheduleLabel,
        date: FESTIVAL_DAYS.day2.date,
      },
    ],
    range: {
      startTime: TIMETABLE_START_TIME,
      endTime: TIMETABLE_DISPLAY_END_TIME,
      slotMinutes: PROGRAM_TIME_SLOT_MINUTES,
    },
    groups,
    items,
    weather: isWeather(runtimeSettings.weather) ? runtimeSettings.weather : "sunny",
  };
}
