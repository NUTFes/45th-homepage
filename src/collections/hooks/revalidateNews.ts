import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload";
import { revalidatePath, revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cacheTags";
import type { News } from "@/payload-types";

export const revalidateNewsAfterChange: CollectionAfterChangeHook<News> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (
    !context.disableRevalidate &&
    (doc._status === "published" || previousDoc?._status === "published")
  ) {
    payload.logger.info("Revalidating news pages");
    revalidateTag(CACHE_TAGS.news, "max");
    revalidatePath("/news");
    revalidatePath("/");
  }
  return doc;
};

export const revalidateNewsAfterDelete: CollectionAfterDeleteHook<News> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info("Revalidating news pages after delete");
    revalidateTag(CACHE_TAGS.news, "max");
    revalidatePath("/news");
    revalidatePath("/");
  }
  return doc;
};
