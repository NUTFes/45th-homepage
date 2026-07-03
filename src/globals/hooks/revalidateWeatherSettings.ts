import { revalidatePath, revalidateTag } from "next/cache";
import type { GlobalAfterChangeHook } from "payload";

import { CACHE_TAGS } from "@/lib/cacheTags";

export const revalidateWeatherSettingsAfterChange: GlobalAfterChangeHook = ({
  context,
  doc,
  req: { payload },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info("Revalidating weather settings");
    revalidateTag(CACHE_TAGS.events, "max");
    revalidateTag(CACHE_TAGS.weatherSettings, "max");
    revalidatePath("/");
    revalidatePath("/events");
    revalidatePath("/events/programs");
  }

  return doc;
};
