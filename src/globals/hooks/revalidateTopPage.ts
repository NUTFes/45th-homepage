import { revalidatePath, revalidateTag } from "next/cache";
import type { GlobalAfterChangeHook } from "payload";

import { CACHE_TAGS } from "@/lib/cacheTags";

export const revalidateTopPageAfterChange: GlobalAfterChangeHook = ({
  context,
  doc,
  req: { payload },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info("Revalidating top page");
    revalidateTag(CACHE_TAGS.topPage, "max");
    revalidatePath("/");
  }

  return doc;
};
