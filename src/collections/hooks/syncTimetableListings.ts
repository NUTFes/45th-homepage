import { APIError, type CollectionAfterChangeHook, type CollectionBeforeDeleteHook } from "payload";

import {
  FESTIVAL_DAY_ADMIN_LABELS,
  PROGRAM_SCHEDULE_WEATHER_LABELS,
  type FestivalDay,
  type ProgramScheduleWeather,
} from "@/lib/events/constants";
import { validateScheduleItems } from "@/lib/events/validation";
import type { Program, TimetableListing } from "@/payload-types";

type ScheduleItem = Program["scheduleItems"][number];

type TimetableListingSource = Pick<
  TimetableListing,
  "id" | "scheduleItemId" | "day" | "weather" | "startTime" | "endTime"
>;

const sourceFieldsChanged = (listing: TimetableListingSource, item: ScheduleItem) =>
  listing.day !== item.day ||
  listing.weather !== item.weather ||
  listing.startTime !== item.startTime ||
  listing.endTime !== item.endTime;

const buildListingLabel = (programTitle: string, item: ScheduleItem) => {
  const day =
    item.day && item.day in FESTIVAL_DAY_ADMIN_LABELS
      ? FESTIVAL_DAY_ADMIN_LABELS[item.day as FestivalDay]
      : "開催日未設定";
  const weather =
    item.weather && item.weather in PROGRAM_SCHEDULE_WEATHER_LABELS
      ? PROGRAM_SCHEDULE_WEATHER_LABELS[item.weather as ProgramScheduleWeather]
      : "天候未設定";

  return `${programTitle} / ${day} ${item.startTime ?? "開始未設定"}-${item.endTime ?? "終了未設定"} / ${weather}`;
};

const getScheduleItems = (value: unknown): ScheduleItem[] =>
  Array.isArray(value)
    ? value.filter(
        (item): item is ScheduleItem =>
          typeof item === "object" && item !== null && !Array.isArray(item),
      )
    : [];

const areScheduleItemsSyncable = (scheduleItems: ScheduleItem[]) =>
  scheduleItems.length > 0 &&
  scheduleItems.every(
    (item) =>
      item.day &&
      item.day in FESTIVAL_DAY_ADMIN_LABELS &&
      item.weather &&
      item.weather in PROGRAM_SCHEDULE_WEATHER_LABELS,
  ) &&
  validateScheduleItems(scheduleItems) === true;

export const syncTimetableListingsAfterProgramChange: CollectionAfterChangeHook = async ({
  doc,
  req,
}) => {
  if (req.context.syncTimetableListingSource) {
    return doc;
  }

  const programId = doc.id;
  if (typeof programId !== "number") {
    throw new APIError(
      "企画を保存できませんでした。ページを再読み込みして、もう一度お試しください。",
      400,
      null,
      true,
    );
  }

  const scheduleItems = getScheduleItems(doc.scheduleItems);
  const itemIds = new Set<string>();
  for (const item of scheduleItems) {
    if (typeof item.id !== "string" || item.id.trim() === "") {
      throw new APIError(
        "開催日時を保存できませんでした。ページを再読み込みして、もう一度お試しください。",
        400,
        null,
        true,
      );
    }
    if (itemIds.has(item.id)) {
      throw new APIError(
        "同じ開催日時が重複しています。行を追加し直してから保存してください。",
        400,
        null,
        true,
      );
    }
    itemIds.add(item.id);
  }

  const syncableScheduleItems = areScheduleItemsSyncable(scheduleItems) ? scheduleItems : [];
  const syncableItemIds = new Set(syncableScheduleItems.map((item) => item.id as string));

  const existingResult = await req.payload.find({
    collection: "timetable-listings",
    depth: 0,
    limit: 1000,
    overrideAccess: true,
    pagination: false,
    req,
    where: {
      program: {
        equals: programId,
      },
    },
  });
  const existingListings = existingResult.docs as TimetableListingSource[];
  const listingByItemId = new Map(
    existingListings.flatMap((listing) =>
      listing.scheduleItemId ? [[listing.scheduleItemId, listing] as const] : [],
    ),
  );
  const context = {
    ...req.context,
    syncTimetableListingSource: true,
  };
  const programTitle =
    typeof doc.title === "string" && doc.title.trim() !== "" ? doc.title : "企画名未設定";

  for (const item of syncableScheduleItems) {
    const scheduleItemId = item.id as string;
    const sourceData = {
      adminLabel: buildListingLabel(programTitle, item),
      program: programId,
      programTitle,
      scheduleItemId,
      day: item.day,
      weather: item.weather,
      startTime: item.startTime,
      endTime: item.endTime,
    };
    const existing = listingByItemId.get(scheduleItemId);

    if (!existing) {
      await req.payload.create({
        collection: "timetable-listings",
        context,
        data: {
          ...sourceData,
          configurationStatus: "0_unconfigured",
        },
        overrideAccess: true,
        req,
      });
      continue;
    }

    const changed = sourceFieldsChanged(existing, item);
    await req.payload.update({
      collection: "timetable-listings",
      context,
      data: {
        ...sourceData,
        ...(changed
          ? {
              timetableGroup: null,
              timetableLane: null,
              configurationStatus: "0_unconfigured",
            }
          : {}),
      },
      id: existing.id,
      overrideAccess: true,
      req,
    });
  }

  for (const listing of existingListings) {
    if (listing.scheduleItemId && syncableItemIds.has(listing.scheduleItemId)) {
      continue;
    }

    await req.payload.delete({
      collection: "timetable-listings",
      context,
      id: listing.id,
      overrideAccess: true,
      req,
    });
  }

  return doc;
};

export const deleteTimetableListingsBeforeProgramDelete: CollectionBeforeDeleteHook = async ({
  id,
  req,
}) => {
  await req.payload.delete({
    collection: "timetable-listings",
    context: {
      ...req.context,
      syncTimetableListingSource: true,
    },
    overrideAccess: true,
    req,
    where: {
      program: {
        equals: id,
      },
    },
  });
};
