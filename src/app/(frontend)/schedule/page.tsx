import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";

import SchedulePageView from "@/modules/schedule/SchedulePageView";
import { getSchedulePageData } from "@/modules/schedule/server/getSchedulePageData";

export const metadata: Metadata = {
  title: "タイムスケジュール",
  description: "第45回技大祭の企画を、開催日・天候・会場ごとにご案内します。",
  alternates: {
    canonical: "/schedule",
  },
};

async function SchedulePageContent() {
  await connection();
  const data = await getSchedulePageData();
  return <SchedulePageView data={data} />;
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div
          aria-label="タイムスケジュールを読み込み中"
          className="min-h-[70svh] animate-pulse bg-base"
        />
      }
    >
      <SchedulePageContent />
    </Suspense>
  );
}
