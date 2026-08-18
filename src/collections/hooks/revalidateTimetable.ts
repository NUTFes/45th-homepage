import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload";
import { revalidatePath, revalidateTag } from "next/cache";

import { CACHE_TAGS } from "@/lib/cacheTags";

const revalidateTimetable = (payload: { logger: { info: (message: string) => void } }) => {
  payload.logger.info("Revalidating timetable");
  revalidateTag(CACHE_TAGS.timetable, "max");
  revalidatePath("/schedule");
};

export const revalidateTimetableAfterChange: CollectionAfterChangeHook = ({ doc, req }) => {
  if (!req.context.disableRevalidate && !req.context.syncTimetableListingSource) {
    revalidateTimetable(req.payload);
  }

  return doc;
};

export const revalidateTimetableAfterDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
  if (!req.context.disableRevalidate && !req.context.syncTimetableListingSource) {
    revalidateTimetable(req.payload);
  }

  return doc;
};
