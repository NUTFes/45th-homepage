import { revalidatePath, revalidateTag } from "next/cache";
import type { GlobalAfterChangeHook } from "payload";

import { CACHE_TAGS } from "@/lib/cacheTags";

export const revalidateEventsPageAfterChange: GlobalAfterChangeHook = ({
  context,
  doc,
  req: { payload },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info("Revalidating events page settings");
    revalidateTag(CACHE_TAGS.events, "max");
    revalidateTag(CACHE_TAGS.eventsPage, "max");
    revalidatePath("/");
    revalidatePath("/events");
    revalidatePath("/events/programs");
  }

  return doc;
};
