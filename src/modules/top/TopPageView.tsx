import { Suspense } from "react";
import { connection } from "next/server";
import Image from "next/image";
import { getImportantNewsBody, getLatestNews } from "@/modules/news/server/getNews";
import { getPickUpSlides } from "@/modules/top/server/getPickUpSlides";
import ButtonMain from "@/components/ui/ButtonMain";
import ImportantFrame from "@/components/ui/ImportantFrame";
import NewsItem from "@/components/ui/NewsItem";
import ImportantFrameSkeleton from "@/components/ui/ImportantFrameSkeleton";
import SectionTitle from "@/components/ui/SectionTitle";
import NewsItemSkeleton from "@/components/ui/NewsItemSkeleton";
import { SponsorAdsBoundary } from "@/modules/sponsors/ui/SponsorAdsSection";
import LogoInfo from "./ui/LogoInfo";
import SponsorSection from "./ui/SponsorSection";
import PickUpFrame from "./ui/PickUpFrame";
import InfoMenu from "./ui/InfoMenu";
import PickUpCarouselLazy from "./ui/PickUpCarouselLazy";

const LATEST_NEWS_LIMIT = 3;
const NO_IMPORTANT_NEWS_MESSAGE = "現在、重要なお知らせはありません。";
const PICKUP_AUTOPLAY_DELAY_MS = 5000;
const SECTION_TITLE_CLASS_NAME = "w-full max-w-105 md:max-w-full md:self-start md:px-pl";

async function getTopPageData() {
  await connection();

  const [latestNews, importantNewsBody, pickUpSlides] = await Promise.all([
    getLatestNews(LATEST_NEWS_LIMIT),
    getImportantNewsBody(),
    getPickUpSlides(),
  ]);

  return {
    importantNewsBody,
    latestNews,
    pickUpSlides,
  };
}

function TopHero() {
  return (
    <div className="flex w-full flex-col items-center">
      <picture className="block aspect-1575/2760 w-full md:aspect-4000/2100">
        <source
          media="(min-width: 768px)"
          sizes="100vw"
          srcSet="/image/top/Ps_HeroAll-1024.avif 1024w, /image/top/Ps_HeroAll-1920.avif 1920w"
          type="image/avif"
        />
        <img
          alt=""
          className="h-full w-full object-cover"
          decoding="async"
          fetchPriority="high"
          loading="eager"
          sizes="100vw"
          src="/image/top/HeroAll-750.avif"
          srcSet="/image/top/HeroAll-430.avif 430w, /image/top/HeroAll-750.avif 750w"
          width={1575}
          height={2760}
        />
      </picture>
      <LogoInfo />
    </div>
  );
}

function ImportantNewsSection({ body }: { body: string | null }) {
  return (
    <div className="w-full md:max-w-none">
      <ImportantFrame title="重要なお知らせ">
        <p className="whitespace-pre-wrap">{body ?? NO_IMPORTANT_NEWS_MESSAGE}</p>
      </ImportantFrame>
    </div>
  );
}

function PickUpSection({ slides }: { slides: Awaited<ReturnType<typeof getPickUpSlides>> }) {
  return (
    <div className="flex w-full flex-col items-center gap-m md:gap-ll">
      <div className={SECTION_TITLE_CLASS_NAME}>
        <SectionTitle title="PICK UP" />
      </div>
      <div className="w-full">
        <PickUpFrame>
          {slides.length > 0 ? (
            <PickUpCarouselLazy slides={slides} autoPlay={{ delay: PICKUP_AUTOPLAY_DELAY_MS }} />
          ) : (
            <div className="aspect-video w-full bg-base-dark md:mx-auto md:w-[60%]" />
          )}
        </PickUpFrame>
      </div>
    </div>
  );
}

function NewsSection({ newsItems }: { newsItems: Awaited<ReturnType<typeof getLatestNews>> }) {
  return (
    <div className="flex w-full flex-col items-center gap-m md:gap-ll">
      <div className={SECTION_TITLE_CLASS_NAME}>
        <SectionTitle title="お知らせ" />
      </div>
      <section className="w-full md:bg-base-dark md:px-pl md:py-3l">
        <div className="mx-auto flex w-full max-w-105 flex-col items-center gap-m md:max-w-190 md:items-start">
          <div className="flex w-full flex-col items-end gap-m md:w-full md:max-w-none md:items-start md:gap-l">
            <div className="w-full bg-base-dark px-ll py-l md:bg-transparent md:px-ss md:py-0">
              {newsItems.length > 0 ? (
                <ul className="flex flex-col gap-m md:gap-l">
                  {newsItems.map((news) => (
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
            <div className="flex w-full justify-center pb-ss">
              <ButtonMain href="/news" title="お知らせ一覧を見る" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoSection() {
  return (
    <div className="flex w-full flex-col gap-y-s pb-32.5 md:gap-y-ll">
      <div className="w-full max-w-105 md:max-w-full md:px-pl">
        <SectionTitle title="ご案内" />
      </div>
      <div className="w-full md:px-pl">
        <InfoMenu />
      </div>
    </div>
  );
}

async function TopPageContent() {
  const { importantNewsBody, latestNews, pickUpSlides } = await getTopPageData();

  return (
    <div className="flex w-full flex-col gap-4l">
      <ImportantNewsSection body={importantNewsBody} />
      <div className="relative w-full">
        <div className="pointer-events-none absolute -top-20 right-0 -z-10 max-w-62.5">
          <Image
            src="/image/top/TopBack1-1.svg"
            alt=""
            width={220}
            height={151}
            className="h-auto w-full opacity-80 md:hidden"
          />
          <Image
            src="/image/top/PTopBack1-1.svg"
            alt=""
            width={439}
            height={343}
            className="hidden h-auto w-full md:block"
          />
        </div>
        <PickUpSection slides={pickUpSlides} />
      </div>
      <div className="relative flex w-full justify-center">
        <div className="pointer-events-none absolute -top-23 left-0 -z-10">
          <Image
            src="/image/top/TopBack1-2.svg"
            alt=""
            width={105}
            height={170}
            className="h-auto w-full opacity-80 md:hidden"
          />
          <Image
            src="/image/top/PTopBack1-2.svg"
            alt=""
            width={291}
            height={275}
            className="hidden h-auto w-full md:block"
          />
        </div>
        <div className="w-full max-w-200 px-ll">
          <SponsorSection />
        </div>
        <div className="pointer-events-none absolute right-0 -bottom-41 -z-10">
          <Image
            src="/image/top/TopBack2.svg"
            alt=""
            width={198}
            height={215}
            className="h-auto w-full opacity-80 md:hidden"
          />
          <Image
            src="/image/top/PTopBack2.svg"
            alt=""
            width={291}
            height={275}
            className="hidden h-auto w-full md:block"
          />
        </div>
      </div>
      <NewsSection newsItems={latestNews} />
      <SponsorAdsBoundary />
      <InfoSection />
    </div>
  );
}

function TopPageSkeleton() {
  return (
    <div className="flex w-full flex-col gap-4l">
      <div className="w-full max-w-105 md:max-w-none">
        <ImportantFrameSkeleton />
      </div>

      <div className="flex w-full flex-col items-center gap-m md:gap-ll">
        <div className={SECTION_TITLE_CLASS_NAME}>
          <SectionTitle title="PICK UP" />
        </div>
        <div className="w-full">
          <PickUpFrame>
            <div className="aspect-video w-full animate-pulse bg-base-dark md:mx-auto md:w-[60%]" />
          </PickUpFrame>
        </div>
      </div>

      <div className="relative flex w-full justify-center">
        <div className="pointer-events-none absolute -top-16 left-0 -z-10 w-26.25">
          <Image
            src="/image/top/TopBack1-2.svg"
            alt=""
            width={105}
            height={170}
            className="h-auto w-full opacity-80 md:hidden"
          />
          <Image
            src="/image/top/PTopBack1-2.svg"
            alt=""
            width={105}
            height={170}
            className="hidden h-auto w-full md:block"
          />
        </div>
        <div className="w-full max-w-200 px-ll">
          <SponsorSection />
        </div>
        <div className="pointer-events-none absolute right-0 -bottom-16 -z-10 w-49.5">
          <Image
            src="/image/top/TopBack2.svg"
            alt=""
            width={198}
            height={215}
            className="h-auto w-full opacity-80 md:hidden"
          />
          <Image
            src="/image/top/PTopBack2.svg"
            alt=""
            width={198}
            height={215}
            className="hidden h-auto w-full md:block"
          />
        </div>
      </div>

      <div className="flex w-full flex-col items-center gap-m md:gap-ll">
        <div className={SECTION_TITLE_CLASS_NAME}>
          <SectionTitle title="お知らせ" />
        </div>
        <section className="w-full md:bg-base-dark md:px-pl md:py-3l">
          <div className="mx-auto flex w-full max-w-105 flex-col items-center gap-m md:max-w-190 md:items-start">
            <div className="flex w-full flex-col items-end gap-m md:w-full md:max-w-none md:items-start md:gap-l">
              <div className="w-full bg-base-dark px-ll py-l md:bg-transparent md:px-ss md:py-0">
                <ul className="flex flex-col gap-m md:gap-l">
                  <NewsItemSkeleton key="news-skeleton-0" skeletonClassName="bg-base" />
                  <NewsItemSkeleton key="news-skeleton-1" skeletonClassName="bg-base" />
                  <NewsItemSkeleton key="news-skeleton-2" skeletonClassName="bg-base" />
                </ul>
              </div>
              <div className="flex w-full justify-center pb-ss">
                <ButtonMain href="/news" title="お知らせ一覧を見る" />
              </div>
            </div>
          </div>
        </section>
      </div>

      <InfoSection />
    </div>
  );
}

export default function TopPageView() {
  return (
    <div className="relative z-0 flex min-h-screen flex-col items-center overflow-x-hidden bg-base">
      <TopHero />
      <div className="relative flex w-full flex-col gap-4l">
        <Suspense fallback={<TopPageSkeleton />}>
          <TopPageContent />
        </Suspense>
        <div className="pointer-events-none absolute bottom-6 left-6 -z-10 md:bottom-0 md:left-0">
          <Image
            src="/image/top/TopBack3-2.svg"
            alt=""
            width={185}
            height={70}
            className="h-auto w-full opacity-80 md:hidden"
          />
          <Image
            src="/image/top/PTopBack3-2.svg"
            alt=""
            width={185}
            height={70}
            className="hidden h-auto w-full md:block"
          />
        </div>
        <div className="pointer-events-none absolute right-0 bottom-0">
          <Image
            src="/image/top/TopBack3-1.svg"
            alt=""
            width={136}
            height={405}
            className="h-auto w-full opacity-80 md:hidden"
          />
          <Image
            src="/image/top/PTopBack3-1.svg"
            alt=""
            width={183}
            height={537}
            className="hidden h-auto w-full md:block"
          />
        </div>
      </div>
    </div>
  );
}
