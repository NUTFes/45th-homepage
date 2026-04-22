import { Suspense } from "react";
import { connection } from "next/server";
import { getImportantNewsBody, getLatestNews } from "@/modules/news/server/getNews";
import NewsTop from "./ui/NewsTop";

import ImportantFrameSkeleton from "@/components/ui/ImportantFrameSkeleton";
import SectionTitle from "@/components/ui/SectionTitle";
import NewsItemSkeleton from "@/components/ui/NewsItemSkeleton";

async function TopPageContent() {
  await connection();
  const [latestNews, importantNewsBody] = await Promise.all([
    getLatestNews(3),
    getImportantNewsBody(),
  ]);

  return <NewsTop items={latestNews} importantBody={importantNewsBody} />;
}

function TopPageSkeleton() {
  return (
    <div className="flex w-full flex-col items-center gap-l">
      <div className="w-full max-w-105 md:max-w-none">
        <ImportantFrameSkeleton />
      </div>
      <section className="w-full md:bg-base-dark md:px-3l md:py-3l">
        <div className="mx-auto flex w-full max-w-105 flex-col items-center gap-m md:max-w-260 md:flex-row md:items-start md:justify-start md:gap-4l">
          <div className="w-full md:w-auto md:shrink-0">
            <SectionTitle title="お知らせ" />
          </div>
          <div className="flex w-full flex-col items-end gap-m md:max-w-190">
            <div className="w-full bg-base-dark px-ll py-m md:bg-transparent md:px-ss md:py-0">
              <ul className="flex flex-col gap-m md:gap-l">
                {[...Array(3)].map((_, i) => (
                  <NewsItemSkeleton key={i} skeletonClassName="bg-base" />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
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
