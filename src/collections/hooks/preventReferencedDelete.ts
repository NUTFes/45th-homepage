import {
  APIError,
  type CollectionBeforeChangeHook,
  type CollectionBeforeDeleteHook,
} from "payload";

import { normalizeRelationshipId, relationshipIdKey } from "@/lib/events/validation";

const referencedError = (message: string) => new APIError(message, 409, null, true);

export const preventTimetableGroupDeleteWhenReferenced: CollectionBeforeDeleteHook = async ({
  id,
  req,
}) => {
  const [laneResult, entryResult] = await Promise.all([
    req.payload.count({
      collection: "timetable-lanes",
      overrideAccess: true,
      req,
      where: {
        timetableGroup: {
          equals: id,
        },
      },
    }),
    req.payload.count({
      collection: "timetable-listings",
      overrideAccess: true,
      req,
      where: {
        timetableGroup: {
          equals: id,
        },
      },
    }),
  ]);

  if (laneResult.totalDocs > 0 || entryResult.totalDocs > 0) {
    throw referencedError(
      "この会場グループは会場または掲載設定で使用されています。削除せず、「使用する」をオフにしてください。",
    );
  }
};

export const preventTimetableLaneDeleteWhenReferenced: CollectionBeforeDeleteHook = async ({
  id,
  req,
}) => {
  const { totalDocs } = await req.payload.count({
    collection: "timetable-listings",
    overrideAccess: true,
    req,
    where: {
      timetableLane: {
        equals: id,
      },
    },
  });

  if (totalDocs > 0) {
    throw referencedError(
      "この会場は掲載設定で使用されています。削除せず、「使用する」をオフにしてください。",
    );
  }
};

export const preventReferencedTimetableLaneGroupChange: CollectionBeforeChangeHook = async ({
  data,
  operation,
  originalDoc,
  req,
}) => {
  if (operation !== "update") {
    return data;
  }

  const previousGroupId = normalizeRelationshipId(originalDoc?.timetableGroup);
  const nextGroupId = normalizeRelationshipId(data.timetableGroup ?? originalDoc?.timetableGroup);
  if (
    previousGroupId === null ||
    nextGroupId === null ||
    relationshipIdKey(previousGroupId) === relationshipIdKey(nextGroupId)
  ) {
    return data;
  }

  const laneId = normalizeRelationshipId(originalDoc?.id);
  if (laneId === null) {
    return data;
  }

  const { totalDocs } = await req.payload.count({
    collection: "timetable-listings",
    overrideAccess: true,
    req,
    where: {
      timetableLane: {
        equals: laneId,
      },
    },
  });

  if (totalDocs > 0) {
    throw referencedError(
      "この会場は掲載設定で使用されているため、会場グループを変更できません。掲載設定で別の会場を選んでから変更してください。",
    );
  }

  return data;
};
