import { Suspense } from "react";
import { connection } from "next/server";
import { getLatestNews } from "@/modules/news/server/getNews";
import NewsTop from "./ui/NewsTop";

import SectionTitle from "@/components/ui/SectionTitle";
import NewsItemSkeleton from "@/components/ui/NewsItemSkeleton";

async function TopPageContent() {
  await connection();
  const latestNews = await getLatestNews(3);

  return <NewsTop items={latestNews} />;
}

function TopPageSkeleton() {
  return (
    <section className="flex w-full max-w-105 flex-col items-center gap-m">
      <div className="flex w-full flex-col gap-s">
        <SectionTitle title="お知らせ" />
        <div className="w-full bg-base-dark px-ll py-m">
          <ul className="flex flex-col gap-m">
            {[...Array(3)].map((_, i) => (
              <NewsItemSkeleton key={i} skeletonClassName="bg-base" />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default function TopPageView() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-base py-4l">
      <Suspense fallback={<TopPageSkeleton />}>
        <TopPageContent />
      </Suspense>
    </div>
  );
}
