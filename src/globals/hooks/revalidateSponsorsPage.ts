import { revalidatePath, revalidateTag } from "next/cache";
import type { GlobalAfterChangeHook } from "payload";

import { CACHE_TAGS } from "@/lib/cacheTags";

export const revalidateSponsorsPageAfterChange: GlobalAfterChangeHook = ({
  context,
  doc,
  req: { payload },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info("Revalidating sponsors page and top sponsor ads");
    revalidateTag(CACHE_TAGS.sponsorsPage, "max");
    revalidatePath("/");
    revalidatePath("/sponsors");
  }

  return doc;
};
