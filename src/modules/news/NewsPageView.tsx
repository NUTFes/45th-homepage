import { Suspense } from "react";
import { redirect } from "next/navigation";
import SectionTitle from "@/components/ui/SectionTitle";
import { getNews, NEWS_PER_PAGE } from "./server/getNews";
import NewsList from "./ui/NewsList";
import NewsPagination from "./ui/NewsPagination";
import NewsItemSkeleton from "@/components/ui/NewsItemSkeleton";
import { toSafePage } from "./utils";

type NewsPageViewProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const getSingleParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

async function NewsPageContent({ searchParams }: NewsPageViewProps) {
  const resolved = await searchParams;
  const pageNum = toSafePage(getSingleParam(resolved.page));

  const newsData = await getNews(pageNum, NEWS_PER_PAGE);

  if (pageNum > newsData.totalPages && newsData.totalPages > 0) {
    redirect(`/news?page=${newsData.totalPages}`);
  }

  return (
    <>
      <div className="flex flex-col gap-s">
        <SectionTitle title="お知らせ" />
        <div className="w-full px-ll">
          <NewsList items={newsData.items} />
        </div>
      </div>

      <NewsPagination currentPage={newsData.page} totalPages={newsData.totalPages} />
    </>
  );
}

function NewsPageSkeleton() {
  return (
    <>
      <div className="flex flex-col gap-s">
        <SectionTitle title="お知らせ" />
        <div className="w-full px-ll">
          <ul className="flex flex-col gap-l">
            {[...Array(NEWS_PER_PAGE)].map((_, i) => (
              <NewsItemSkeleton key={i} />
            ))}
          </ul>
        </div>
      </div>

      <div className="flex min-h-11 justify-center" aria-hidden="true" />
    </>
  );
}

export default function NewsPageView(props: NewsPageViewProps) {
  return (
    <div className="flex min-h-screen flex-col items-center bg-base py-4l">
      <div className="flex w-full max-w-105 flex-col gap-4l">
        <Suspense fallback={<NewsPageSkeleton />}>
          <NewsPageContent {...props} />
        </Suspense>
      </div>
    </div>
  );
}
