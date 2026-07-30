import { cacheLife, cacheTag } from "next/cache";
import { getPayload } from "payload";

import { CACHE_TAGS } from "@/lib/cacheTags";
import config from "@/payload.config";

import type { GuestPageDTO } from "../types";

const TICKET_DISTRIBUTION_STATUS_FALLBACK = "配布状況を確認しています";

export async function getGuestPageData(): Promise<GuestPageDTO> {
  "use cache";
  cacheTag(CACHE_TAGS.eventsPage);
  cacheLife("minutes");

  const payload = await getPayload({ config });
  const eventsPage = await payload.findGlobal({
    slug: "events-page",
    depth: 0,
    overrideAccess: true,
    select: {
      guestTicketInformation: {
        statusText: true,
      },
    },
  });

  return {
    ticketDistributionStatusText:
      eventsPage.guestTicketInformation?.statusText?.trim() || TICKET_DISTRIBUTION_STATUS_FALLBACK,
  };
}
