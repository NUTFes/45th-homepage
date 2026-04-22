import type { CollectionBeforeChangeHook } from "payload";

import type { News } from "@/payload-types";

export const ensureSingleImportantNewsBeforeChange: CollectionBeforeChangeHook<News> = async ({
  context,
  data,
  operation,
  originalDoc,
  req,
}) => {
  if (context.skipEnsureSingleImportantNews) {
    return data;
  }

  const nextImportantValue =
    data?.important ?? (operation === "update" ? originalDoc?.important : "normal");
  const nextImportant = nextImportantValue === "important";
  const nextStatus = data?._status ?? originalDoc?._status ?? "draft";

  if (!nextImportant || nextStatus !== "published") {
    return data;
  }

  const currentId = operation === "update" ? originalDoc?.id : undefined;

  const { docs } = await req.payload.find({
    collection: "news",
    depth: 0,
    pagination: false,
    overrideAccess: true,
    req,
    where: {
      and: [
        {
          important: {
            equals: "important",
          },
        },
        {
          _status: {
            equals: "published",
          },
        },
        ...(currentId
          ? [
              {
                id: {
                  not_equals: currentId,
                },
              },
            ]
          : []),
      ],
    },
  });

  if (docs.length === 0) {
    return data;
  }

  await Promise.all(
    docs.map(({ id }) =>
      req.payload.update({
        collection: "news",
        id,
        data: {
          important: "normal",
        },
        overrideAccess: true,
        req,
        context: {
          ...context,
          disableRevalidate: true,
          skipEnsureSingleImportantNews: true,
        },
      }),
    ),
  );

  return data;
};
