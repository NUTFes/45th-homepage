import type { CollectionBeforeDeleteHook } from "payload";

export const preventDeleteUsedProgramTags: CollectionBeforeDeleteHook = async ({ id, req }) => {
  const result = await req.payload.find({
    collection: "programs",
    depth: 0,
    limit: 1,
    overrideAccess: true,
    req,
    where: {
      tags: {
        contains: id,
      },
    },
  });

  const program = result.docs[0];

  if (program) {
    throw new Error(
      `このタグは企画「${program.title}」で使用中のため削除できません。先に企画からタグを外してください。`,
    );
  }
};
