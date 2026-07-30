import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";

import EventPageView from "@/modules/event/ui/EventPageView";
import { getEventsPageData } from "@/modules/events/server/getEventsPageData";
import SponsorAdsBoundary from "@/modules/sponsors/ui/SponsorAdsBoundary";

export const metadata: Metadata = {
  title: "企画情報",
  description: "第45回技大祭のゲスト、企画、展示・体験、食品販売などをご案内します。",
  alternates: {
    canonical: "/event",
  },
};

async function EventPageContent() {
  await connection();
  const data = await getEventsPageData();
  return <EventPageView data={data} sponsorAds={<SponsorAdsBoundary />} />;
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div aria-label="企画情報を読み込み中" className="min-h-[60svh] animate-pulse bg-base" />
      }
    >
      <EventPageContent />
    </Suspense>
  );
}
