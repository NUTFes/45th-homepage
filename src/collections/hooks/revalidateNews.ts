import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload";
import { revalidatePath } from "next/cache";
import type { News } from "@/payload-types";

export const revalidateNewsAfterChange: CollectionAfterChangeHook<News> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate && doc._status === "published") {
    payload.logger.info("Revalidating news pages");
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
    revalidatePath("/news");
    revalidatePath("/");
  }
  return doc;
};
