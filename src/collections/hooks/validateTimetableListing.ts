import { sql, type PostgresAdapter } from "@payloadcms/db-postgres";
import {
  APIError,
  type CollectionBeforeChangeHook,
  type PayloadRequest,
  type Where,
} from "payload";

import {
  PROGRAM_SCHEDULE_WEATHER_LABELS,
  PROGRAM_SCHEDULE_WEATHERS,
  type ProgramScheduleWeather,
} from "@/lib/events/constants";
import {
  normalizeRelationshipId,
  relationshipIdKey,
  type RelationshipId,
} from "@/lib/events/validation";
import { availableTimetableLaneWhere } from "../TimetableLanes";

type ListingInput = {
  id?: number | string | null;
  timetableLane?: unknown;
  day?: string | null;
  weather?: string | null;
  startTime?: string | null;
  endTime?: string | null;
};

const toRecord = (value: unknown): Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

const validationError = (message: string) => new APIError(message, 400, null, true);

const TIMETABLE_LISTING_LOCK_NAMESPACE = 45_000_002;

const lockTimetableLaneDay = async (
  req: PayloadRequest,
  timetableLaneId: RelationshipId,
  day: string,
) => {
  const transactionID = await req.transactionID;
  const adapter = req.payload.db as unknown as PostgresAdapter;
  const transaction = transactionID ? adapter.sessions[transactionID]?.db : undefined;

  if (!transaction) {
    throw new Error("Timetable listing validation requires an active PostgreSQL transaction.");
  }

  const lockKey = `${relationshipIdKey(timetableLaneId)}:${day}`;
  await transaction.execute(
    sql`SELECT pg_advisory_xact_lock(${TIMETABLE_LISTING_LOCK_NAMESPACE}, hashtext(${lockKey}))`,
  );
};

const weatherValuesThatOverlap = (weather: ProgramScheduleWeather) =>
  weather === "both" ? PROGRAM_SCHEDULE_WEATHERS.map(({ value }) => value) : ["both", weather];

export const validateTimetableListingBeforeChange: CollectionBeforeChangeHook = async ({
  data,
  originalDoc,
  req,
}) => {
  if (req.context.syncTimetableListingSource) {
    return data;
  }

  const listing: ListingInput = {
    ...toRecord(originalDoc),
    ...toRecord(data),
  };
  const timetableLaneId = normalizeRelationshipId(listing.timetableLane);

  if (timetableLaneId === null) {
    return {
      ...data,
      configurationStatus: "0_unconfigured",
    };
  }

  const laneResult = await req.payload.find({
    collection: "timetable-lanes",
    depth: 0,
    limit: 1,
    overrideAccess: true,
    pagination: false,
    req,
    where: {
      and: [
        {
          id: {
            equals: timetableLaneId,
          },
        },
        availableTimetableLaneWhere,
      ],
    },
  });
  const lane = laneResult.docs[0];

  if (!lane) {
    throw validationError(
      "この会場は現在使用できません。「会場」で使用する項目を選び直してください。",
    );
  }

  const weather = listing.weather as ProgramScheduleWeather | null | undefined;
  if (!listing.day || !weather || !listing.startTime || !listing.endTime) {
    throw validationError(
      "開催日時を確認できません。企画画面で開催日時を確認してから、もう一度保存してください。",
    );
  }

  await lockTimetableLaneDay(req, timetableLaneId, listing.day);

  const clauses: Where[] = [
    {
      configurationStatus: {
        equals: "1_configured",
      },
    },
    {
      timetableLane: {
        equals: timetableLaneId,
      },
    },
    {
      day: {
        equals: listing.day,
      },
    },
    {
      weather: {
        in: weatherValuesThatOverlap(weather),
      },
    },
    {
      startTime: {
        less_than: listing.endTime,
      },
    },
    {
      endTime: {
        greater_than: listing.startTime,
      },
    },
  ];
  const currentId = normalizeRelationshipId(listing.id ?? originalDoc?.id);
  if (currentId !== null) {
    clauses.push({
      id: {
        not_equals: currentId,
      },
    });
  }

  const conflict = await req.payload.find({
    collection: "timetable-listings",
    depth: 0,
    limit: 1,
    overrideAccess: true,
    pagination: false,
    req,
    select: {
      startTime: true,
      endTime: true,
      weather: true,
    },
    where: {
      and: clauses,
    },
  });

  if (conflict.docs.length > 0) {
    const existing = conflict.docs[0];
    const weatherLabel =
      existing.weather && existing.weather in PROGRAM_SCHEDULE_WEATHER_LABELS
        ? PROGRAM_SCHEDULE_WEATHER_LABELS[existing.weather as ProgramScheduleWeather]
        : "天候未設定";
    throw validationError(
      `同じ会場の ${existing.startTime ?? "開始未設定"}-${existing.endTime ?? "終了未設定"}（${weatherLabel}）と重なっています。どちらかの会場または開催日時を変更してください。`,
    );
  }

  return {
    ...data,
    configurationStatus: "1_configured",
  };
};
