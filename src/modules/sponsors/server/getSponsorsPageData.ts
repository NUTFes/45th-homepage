import { getPayload } from "payload";

import config from "@/payload.config";

import type { SponsorsPageData } from "../types";
import { toSponsorDTO } from "../utils";

const DEFAULT_THANKS_MESSAGE = "第45回技大祭にご協賛いただき、誠にありがとうございます。";

export async function getSponsorsPageData(): Promise<SponsorsPageData> {
  const payload = await getPayload({ config });
  const sponsorsPage = await payload.findGlobal({
    slug: "sponsors-page",
    depth: 1,
    overrideAccess: true,
  });

  return {
    sponsors: (sponsorsPage.sponsors ?? [])
      .map(toSponsorDTO)
      .filter((sponsor): sponsor is NonNullable<typeof sponsor> => sponsor !== null),
    thanksMessage: sponsorsPage.thanksMessage?.trim() || DEFAULT_THANKS_MESSAGE,
  };
}
