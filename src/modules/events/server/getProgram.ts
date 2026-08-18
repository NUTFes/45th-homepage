import { cacheLife, cacheTag } from "next/cache";
import { getPayload } from "payload";

import { CACHE_TAGS } from "@/lib/cacheTags";
import config from "@/payload.config";

import type { EventProgramDTO } from "../types";
import { toEventProgramDTO } from "../utils";

export const normalizeProgramId = (id: string | number) => {
  if (typeof id === "number") {
    return Number.isSafeInteger(id) && id > 0 ? id : null;
  }

  if (!/^[1-9]\d*$/.test(id)) {
    return null;
  }

  const numericId = Number(id);
  return Number.isSafeInteger(numericId) ? numericId : null;
};

export async function queryProgram(id: string | number): Promise<EventProgramDTO | null> {
  const programId = normalizeProgramId(id);
  if (programId === null) {
    return null;
  }

  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "programs",
    depth: 1,
    limit: 1,
    overrideAccess: true,
    pagination: false,
    select: {
      id: true,
      title: true,
      category: true,
      area: true,
      locationName: true,
      image: true,
      mapImage: true,
      tags: true,
      catchphrase: true,
      description: true,
      scheduleItems: true,
      _status: true,
    },
    where: {
      and: [
        {
          id: {
            equals: programId,
          },
        },
        {
          _status: {
            equals: "published",
          },
        },
      ],
    },
  });

  const program = result.docs[0];
  return program ? toEventProgramDTO(program) : null;
}

export async function getProgram(id: string | number): Promise<EventProgramDTO | null> {
  "use cache";
  cacheTag(CACHE_TAGS.events);
  cacheLife("minutes");

  return queryProgram(id);
}
