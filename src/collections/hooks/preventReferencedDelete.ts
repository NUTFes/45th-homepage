import { APIError, type CollectionBeforeDeleteHook } from "payload";

const referencedError = (message: string) => new APIError(message, 409, null, true);

export const preventTimetableGroupDeleteWhenReferenced: CollectionBeforeDeleteHook = async ({
  id,
  req,
}) => {
  const { totalDocs } = await req.payload.count({
    collection: "timetable-lanes",
    overrideAccess: true,
    req,
    where: {
      timetableGroup: {
        equals: id,
      },
    },
  });

  if (totalDocs > 0) {
    throw referencedError(
      "この会場グループは会場で使用されています。先に各会場の「会場グループ」を解除または変更してください。",
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
