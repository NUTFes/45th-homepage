import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";

import GuestPageView from "@/modules/event/guest/GuestPageView";
import { getGuestPageData } from "@/modules/events/server/getGuestPageData";

export const metadata: Metadata = {
  title: "ゲスト",
  description:
    "第45回技大祭のゲストは、お笑いコンビのヨネダ2000です。9月20日(日)13:00~14:00に体育館で開催します。",
  alternates: {
    canonical: "/event/guest",
  },
};

async function GuestPageContent() {
  await connection();
  const data = await getGuestPageData();
  return <GuestPageView data={data} />;
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div aria-label="ゲスト情報を読み込み中" className="min-h-[60svh] animate-pulse bg-base" />
      }
    >
      <GuestPageContent />
    </Suspense>
  );
}
