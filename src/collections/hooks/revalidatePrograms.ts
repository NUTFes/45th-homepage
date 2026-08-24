import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload";
import { revalidatePath, revalidateTag } from "next/cache";

import { CACHE_TAGS } from "@/lib/cacheTags";

const revalidateEventPages = (payload: { logger: { info: (message: string) => void } }) => {
  payload.logger.info("Revalidating event pages");
  revalidateTag(CACHE_TAGS.events, "max");
  revalidateTag(CACHE_TAGS.eventsPage, "max");
  revalidateTag(CACHE_TAGS.timetable, "max");
  revalidateTag(CACHE_TAGS.weatherSettings, "max");
  revalidatePath("/");
  revalidatePath("/event", "layout");
  revalidatePath("/schedule");
};

export const revalidateProgramsAfterChange: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
  req: { context, payload },
}) => {
  if (
    !context.disableRevalidate &&
    (doc._status === "published" || previousDoc?._status === "published")
  ) {
    revalidateEventPages(payload);
  }

  return doc;
};

export const revalidateProgramsAfterDelete: CollectionAfterDeleteHook = ({
  doc,
  req: { context, payload },
}) => {
  if (!context.disableRevalidate) {
    revalidateEventPages(payload);
  }

  return doc;
};
