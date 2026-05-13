import { Suspense } from "react";
import { connection } from "next/server";
import { getImportantNewsBody, getLatestNews } from "@/modules/news/server/getNews";
import { getPickUpSlides } from "@/modules/top/server/getPickUpSlides";
import ButtonMain from "@/components/ui/ButtonMain";
import ImportantFrame from "@/components/ui/ImportantFrame";
import NewsItem from "@/components/ui/NewsItem";

import ImportantFrameSkeleton from "@/components/ui/ImportantFrameSkeleton";
import SectionTitle from "@/components/ui/SectionTitle";
import NewsItemSkeleton from "@/components/ui/NewsItemSkeleton";

import Image from "next/image";
import LogoInfo from "./ui/LogoInfo";
import PickUpCarousel from "./ui/PickUpCarousel";
import { sampleNewsItems } from "@/app/(frontend)/(dev)/dev/_data/sampleNews";
import SponsorSection from "./ui/SponsorSection";
import PickUpFrame from "./ui/PickUpFrame";
import { topModuleSlides } from "@/app/(frontend)/(dev)/dev/_data/topModuleSlides";
import InfoMenu from "./ui/InfoMenu";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
const NO_IMPORTANT_NEWS_MESSAGE = "現在、重要なお知らせはありません。";

async function TopPageContent() {
  await connection();
  const [latestNews, importantNewsBody, pickUpSlides] = await Promise.all([
    getLatestNews(3),
    getImportantNewsBody(),
    getPickUpSlides(),
  ]);

  return (
    <div className="flex w-full flex-col gap-l">
      {/* 重要なお知らせ */}
      <div className="w-full max-w-105 md:max-w-none">
        <ImportantFrame title="重要なお知らせ">
          <p className="whitespace-pre-wrap">{importantNewsBody ?? NO_IMPORTANT_NEWS_MESSAGE}</p>
        </ImportantFrame>
      </div>

      {/* PICKUP カルーセル */}
      <div className="w-full">
        <PickUpFrame>
          {pickUpSlides.length > 0 ? (
            <PickUpCarousel slides={pickUpSlides} autoPlay={{ delay: 5000 }} />
          ) : (
            <div className="aspect-video w-full bg-base-dark md:mx-auto md:w-[60%]" />
          )}
        </PickUpFrame>
      </div>

      {/* お知らせ一覧 */}
      <div className="flex w-full flex-col items-center gap-m md:gap-ll">
        <div className="w-full max-w-105 md:max-w-full md:self-start md:px-pl">
          <SectionTitle title="お知らせ" />
        </div>
        <section className="w-full md:bg-base-dark md:px-pl md:py-3l">
          <div className="mx-auto flex w-full max-w-105 flex-col items-center gap-m md:max-w-190 md:items-start">
            <div className="flex w-full flex-col items-end gap-m md:w-full md:max-w-none md:items-start md:gap-l">
              <div className="w-full bg-base-dark px-ll py-m md:bg-transparent md:px-ss md:py-0">
                {latestNews.length > 0 ? (
                  <ul className="flex flex-col gap-m md:gap-l">
                    {latestNews.map((news) => (
                      <NewsItem
                        key={news.id}
                        date={news.date}
                        dateTime={news.dateTime}
                        title={news.title}
                        content={news.body}
                        important={news.important}
                      />
                    ))}
                  </ul>
                ) : (
                  <p className="px-ll py-m text-center text-text text-font-main">
                    お知らせはまだありません
                  </p>
                )}
              </div>
              <div className="flex w-full justify-center pb-ss md:justify-center">
                <ButtonMain href="/news" title="お知らせ一覧を見る ＞" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function TopPageSkeleton() {
  return (
    <div className="flex w-full flex-col items-center gap-l">
      {/* 重要なお知らせスケルトン */}
      <div className="w-full max-w-105 md:max-w-none">
        <ImportantFrameSkeleton />
      </div>

      {/* PICKUP カルーセルスケルトン */}
      <div className="w-full">
        <PickUpFrame>
          <div className="aspect-video w-full animate-pulse bg-base-dark md:mx-auto md:w-[60%]" />
        </PickUpFrame>
      </div>

      {/* お知らせ一覧スケルトン */}
      <div className="flex w-full flex-col items-center gap-m md:gap-ll">
        <div className="w-full max-w-105 md:max-w-full md:self-start md:px-pl">
          <SectionTitle title="お知らせ" />
        </div>
        <section className="w-full md:bg-base-dark md:px-pl md:py-3l">
          <div className="mx-auto flex w-full max-w-105 flex-col items-center gap-m md:max-w-190 md:items-start">
            <div className="flex w-full flex-col items-end gap-m md:w-full md:max-w-none md:items-start md:gap-l">
              <div className="w-full bg-base-dark px-ll py-m md:bg-transparent md:px-ss md:py-0">
                <ul className="flex flex-col gap-m md:gap-l">
                  <NewsItemSkeleton key="news-skeleton-0" skeletonClassName="bg-base" />
                  <NewsItemSkeleton key="news-skeleton-1" skeletonClassName="bg-base" />
                  <NewsItemSkeleton key="news-skeleton-2" skeletonClassName="bg-base" />
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function TopPageView() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-base">
      <Suspense fallback={<TopPageSkeleton />}>
        <div className="flex w-full flex-col items-center gap-y-ll">
          <div className="relative aspect-[393/638] w-full">
            <Image
              src="/image/top/HeroAll.png"
              alt="45thNutfes_HeroHeader"
              fill
              className="object-cover"
            />
          </div>
          <LogoInfo />
        </div>
        <div className="relative flex w-full flex-col gap-4l">
          <div className="relative flex flex-col gap-4l">
            --重要なお知らせ--
            <div className="relative">
              <div className="absolute right-0 bottom-[-200px] z-0 aspect-[393/638]">
                <Image
                  src="/image/top/TopBack1.svg"
                  alt="45th_Top1"
                  width={393}
                  height={638}
                  className="pointer-events-none object-contain object-right-top"
                />
              </div>
              <div className="z-10 flex flex-col gap-y-m">
                <SectionTitle title="PICK UP" />
                <PickUpFrame>
                  <PickUpCarousel slides={[...topModuleSlides]} autoPlay={{ delay: 2500 }} />
                </PickUpFrame>
              </div>
            </div>
            <div className="z-10">
              <SponsorSection />
            </div>
            <div className="relative">
              <div className="absolute right-0 bottom-[-50px] z-0">
                <Image
                  src="/image/top/TopBack2.svg"
                  alt="45th_Top2"
                  width={210}
                  height={198}
                  className="pointer-events-none object-contain object-right-bottom"
                />
              </div>
            </div>
            <div className="z-10">
              <TopPageContent />
            </div>
            <div className="flex w-full flex-col gap-y-s pb-3l">
              <SectionTitle title="ご案内" />
              <InfoMenu />
            </div>
          </div>
          <div className="relative w-full">
            <div className="absolute right-0 bottom-0 z-0">
              <Image
                src="/image/top/TopBack3.svg"
                alt="45th_Top3"
                width={393}
                height={638}
                className="pointer-events-none object-contain object-right-top"
              />
            </div>
          </div>
        </div>
      </Suspense>
      <div className="fixed right-0 bottom-0 left-0 z-50 md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
