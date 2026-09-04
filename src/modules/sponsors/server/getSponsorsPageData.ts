import { cacheLife, cacheTag } from "next/cache";
import { getPayload } from "payload";

import { CACHE_TAGS } from "@/lib/cacheTags";
import config from "@/payload.config";

import type { SponsorsPageData } from "../types";
import { parseSponsorNameList, toSponsorWithImageDTO } from "../utils";

const DEFAULT_THANKS_MESSAGE = "第45回技大祭にご協賛いただき、誠にありがとうございます。";

export async function getSponsorsPageData(): Promise<SponsorsPageData> {
  "use cache";
  cacheTag(CACHE_TAGS.sponsorsPage);
  cacheLife("minutes");

  const payload = await getPayload({ config });
  const sponsorsPage = await payload.findGlobal({
    slug: "sponsors-page",
    depth: 1,
    overrideAccess: true,
  });

  return {
    sponsorNames: parseSponsorNameList(sponsorsPage.sponsorNames),
    sponsors: (sponsorsPage.sponsors ?? [])
      .map(toSponsorWithImageDTO)
      .filter((sponsor): sponsor is NonNullable<typeof sponsor> => sponsor !== null),
    thanksMessage: sponsorsPage.thanksMessage?.trim() || DEFAULT_THANKS_MESSAGE,
  };
}
