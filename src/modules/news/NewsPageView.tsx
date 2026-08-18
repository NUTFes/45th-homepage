import { Suspense } from "react";
import { redirect } from "next/navigation";
import Image from "next/image";
import SectionTitle from "@/components/ui/SectionTitle";
import { getImportantNewsBody, getNews, NEWS_PER_PAGE } from "./server/getNews";
import NewsList from "./ui/NewsList";
import NewsPagination from "./ui/NewsPagination";
import NewsItemSkeleton from "@/components/ui/NewsItemSkeleton";
import ImportantFrame from "@/components/ui/ImportantFrame";
import ImportantFrameSkeleton from "@/components/ui/ImportantFrameSkeleton";
import { toSafePage } from "./utils";
import ButtonMain from "@/components/ui/ButtonMain";
import NewsRichText from "@/components/ui/NewsRichText";

type NewsPageViewProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const NO_IMPORTANT_NEWS_MESSAGE = "現在、重要なお知らせはありません。";

const getSingleParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

async function NewsPageContent({ searchParams }: NewsPageViewProps) {
  const resolved = await searchParams;
  const pageNum = toSafePage(getSingleParam(resolved.page));

  const [newsData, importantNewsBody] = await Promise.all([
    getNews(pageNum, NEWS_PER_PAGE),
    getImportantNewsBody(),
  ]);

  if (pageNum > newsData.totalPages && newsData.totalPages > 0) {
    redirect(`/news?page=${newsData.totalPages}`);
  }

  return (
    <>
      <div className="w-full">
        <ImportantFrame title="重要なお知らせ">
          {importantNewsBody ? (
            <NewsRichText data={importantNewsBody} />
          ) : (
            <p>{NO_IMPORTANT_NEWS_MESSAGE}</p>
          )}
        </ImportantFrame>
      </div>

      <div className="relative mx-auto flex w-full flex-col gap-4l pt-4l pb-pm md:pt-5l">
        <Image
          src="/image/PageBack1.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute top-0 right-0 z-0 hidden md:block"
          width={200}
          height={200}
        />

        <div className="relative z-10 flex flex-col gap-s px-ll md:gap-4l md:px-pl">
          <SectionTitle title="お知らせ" />
          <div className="mx-auto w-full max-w-190">
            <NewsList items={newsData.items} />
          </div>
        </div>

        <div className="relative z-10">
          <NewsPagination currentPage={newsData.page} totalPages={newsData.totalPages} />
        </div>
      </div>
      <div className="relative flex items-center justify-center pb-pm">
        <ButtonMain href="/" title="トップへ戻る" />
      </div>
    </>
  );
}

function NewsPageSkeleton() {
  return (
    <>
      <div className="w-full">
        <ImportantFrameSkeleton />
      </div>

      <div className="relative mx-auto flex w-full flex-col gap-4l pt-4l pb-pm md:pt-5l">
        <Image
          src="/image/PageBack1.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute top-0 right-0 z-0 hidden md:block"
          width={200}
          height={200}
        />

        <div className="relative z-20 flex flex-col gap-s px-ll md:gap-4l md:px-pl">
          <SectionTitle title="お知らせ" />
          <div className="mx-auto w-full max-w-190">
            <ul className="flex flex-col gap-l">
              {[...Array(NEWS_PER_PAGE)].map((_, i) => (
                <NewsItemSkeleton key={`skeleton-${i}`} />
              ))}
            </ul>
          </div>
        </div>

        <div className="relative z-20">
          <div className="flex min-h-11 justify-center" aria-hidden="true" />
        </div>
      </div>
    </>
  );
}

export default function NewsPageView(props: NewsPageViewProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center bg-base">
      <Image
        src="/image/PageBack2.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 z-0 hidden md:block"
        width={200}
        height={200}
      />
      <div className="relative z-20 flex w-full flex-col">
        <Suspense fallback={<NewsPageSkeleton />}>
          <NewsPageContent {...props} />
        </Suspense>
      </div>
    </div>
  );
}
