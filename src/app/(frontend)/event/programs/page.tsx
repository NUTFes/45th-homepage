import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";

import ProgramListPageView from "@/modules/event/programs/ProgramListPageView";
import { flattenEventCategories } from "@/modules/events/presentation";
import { getEventsPageData } from "@/modules/events/server/getEventsPageData";
import SponsorAdsBoundary from "@/modules/sponsors/ui/SponsorAdsBoundary";

export const metadata: Metadata = {
  title: "企画一覧",
  description: "第45回技大祭で開催する企画を一覧でご案内します。",
  alternates: {
    canonical: "/event/programs",
  },
};

async function ProgramsPageContent() {
  await connection();
  const data = await getEventsPageData();
  return (
    <ProgramListPageView
      title="企画"
      programs={flattenEventCategories(data.categories)}
      filterVariant="event"
      sponsorAds={<SponsorAdsBoundary surface="transparent" />}
    />
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div aria-label="企画を読み込み中" className="min-h-[60svh] animate-pulse bg-base" />
      }
    >
      <ProgramsPageContent />
    </Suspense>
  );
}
