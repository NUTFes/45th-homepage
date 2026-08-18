import { cacheLife, cacheTag } from "next/cache";
import { getPayload } from "payload";

import { CACHE_TAGS } from "@/lib/cacheTags";
import config from "@/payload.config";

import type { EventProgramDTO } from "../types";
import { toEventProgramDTO } from "../utils";

export async function queryPrograms(): Promise<EventProgramDTO[]> {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "programs",
    depth: 1,
    limit: 1000,
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
      _status: {
        equals: "published",
      },
    },
  });

  return result.docs
    .map(toEventProgramDTO)
    .filter((program): program is EventProgramDTO => program !== null);
}

export async function getPrograms(): Promise<EventProgramDTO[]> {
  "use cache";
  cacheTag(CACHE_TAGS.events);
  cacheLife("minutes");

  return queryPrograms();
}
