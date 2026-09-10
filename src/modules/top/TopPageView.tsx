import { Suspense, type CSSProperties } from "react";
import { connection } from "next/server";
import Image, { getImageProps } from "next/image";
import { getImportantNewsBody, getLatestNews } from "@/modules/news/server/getNews";
import { getPickUpSlides } from "@/modules/top/server/getPickUpSlides";
import { getEventsPageData } from "@/modules/events/server/getEventsPageData";
import {
  findUpcomingProgramGroup,
  flattenEventCategories,
  toEventFrameProps,
} from "@/modules/events/presentation";
import EventCarousel from "@/modules/event/ui/EventCarousel";
import ButtonMain from "@/components/ui/ButtonMain";
import ImportantFrame from "@/components/ui/ImportantFrame";
import MapFrame from "@/components/ui/MapFrame";
import NewsItem from "@/components/ui/NewsItem";
import ImportantFrameSkeleton from "@/components/ui/ImportantFrameSkeleton";
import SectionTitle from "@/components/ui/SectionTitle";
import NewsItemSkeleton from "@/components/ui/NewsItemSkeleton";
import NewsRichText from "@/components/ui/NewsRichText";
import SponsorAdsBoundary from "@/modules/sponsors/ui/SponsorAdsBoundary";
import LogoInfo from "./ui/LogoInfo";
import PickUpFrame from "./ui/PickUpFrame";
import InfoMenu from "./ui/InfoMenu";
import PickUpCarouselLazy from "./ui/PickUpCarouselLazy";

const LATEST_NEWS_LIMIT = 3;
const NO_IMPORTANT_NEWS_MESSAGE = "現在、重要なお知らせはありません。";
const PICKUP_AUTOPLAY_DELAY_MS = 5000;
const SECTION_TITLE_CLASS_NAME = "w-full max-w-105 md:max-w-full md:self-start md:px-pl";
const TOP_HERO_IMAGE_QUALITY = 60;
const TOP_HERO_IMAGE_SIZES = "100vw";
const TRANSPARENT_PIXEL = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
const logoDecoFrames = [
  { mobile: "Mlogodeco1_1.png", desktop: "PClogodeco1_1.png", delay: "0s" },
  { mobile: "Mlogodeco2_1.png", desktop: "PClogodeco2_1.png", delay: "-4s" },
  { mobile: "Mlogodeco3_1.png", desktop: "PClogodeco3_1.png", delay: "-3s" },
  { mobile: "Mlogodeco4_1.png", desktop: "PClogodeco4_1.png", delay: "-2s" },
  { mobile: "Mlogodeco5_1.png", desktop: "PClogodeco5_1.png", delay: "-1s" },
] as const;

async function getTopPageData() {
  await connection();

  const [latestNews, importantNewsBody, pickUpSlides, eventsPageData] = await Promise.all([
    getLatestNews(LATEST_NEWS_LIMIT),
    getImportantNewsBody(),
    getPickUpSlides(),
    getEventsPageData(),
  ]);
  const upcomingProgramGroup = findUpcomingProgramGroup(
    flattenEventCategories(eventsPageData.categories),
    new Date(),
  );

  return {
    importantNewsBody,
    latestNews,
    pickUpSlides,
    upcomingProgramGroup,
  };
}

function AnimationLayer({
  mobileSrc,
  pcSrc,
  className,
  fetchPriority,
  pictureClassName = "absolute inset-0 block",
  style,
}: {
  mobileSrc: string;
  pcSrc: string;
  className: string;
  fetchPriority?: "high" | "low" | "auto";
  pictureClassName?: string;
  style: CSSProperties;
}) {
  const common = {
    alt: "",
    fetchPriority,
    fill: true,
    quality: TOP_HERO_IMAGE_QUALITY,
    sizes: TOP_HERO_IMAGE_SIZES,
  } as const;
  const {
    props: { srcSet: pcSrcSet },
  } = getImageProps({ ...common, src: pcSrc });
  const { props: mobileProps } = getImageProps({ ...common, src: mobileSrc });

  return (
    <picture className={pictureClassName} style={style}>
      <source media="(min-width: 768px)" srcSet={pcSrcSet} />
      <img {...mobileProps} aria-hidden="true" className={className} />
    </picture>
  );
}

function TopHeroAnime() {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="relative block aspect-1575/2760 w-full md:aspect-4000/2100">
        <AnimationLayer
          mobileSrc="/image/top/animation/Mback_1.png"
          pcSrc="/image/top/animation/PCback_1.png"
          className="object-cover"
          fetchPriority="high"
          style={{ zIndex: 1 }}
        />
        <AnimationLayer
          mobileSrc="/image/top/animation/Mbackrotation_1.png"
          pcSrc="/image/top/animation/PCbackrotation_1.png"
          className="origin-[50%_61%] animate-[spin_50s_linear_infinite] object-cover md:origin-[69%_50%]"
          style={{ zIndex: 2 }}
        />
        <AnimationLayer
          mobileSrc="/image/top/animation/Mtown_1.png"
          pcSrc="/image/top/animation/PCtown_1.png"
          className="object-cover"
          style={{ zIndex: 3 }}
        />
        <AnimationLayer
          mobileSrc={TRANSPARENT_PIXEL}
          pcSrc="/image/top/animation/PCflower_1.png"
          className="hidden object-cover md:block"
          style={{ zIndex: 4 }}
        />
        <AnimationLayer
          mobileSrc="/image/top/animation/Mpeople_2.png"
          pcSrc="/image/top/animation/PCpeople_2.png"
          className="object-cover"
          style={{ zIndex: 5 }}
        />
        <AnimationLayer
          mobileSrc="/image/top/animation/Mtitle_3.png"
          pcSrc="/image/top/animation/PCtitle_3.png"
          className="duration-[3000ms] ease-out animate-in fade-in slide-in-from-top-4"
          style={{ zIndex: 6 }}
        />
        {logoDecoFrames.map((frame) => (
          <AnimationLayer
            key={frame.mobile}
            mobileSrc={`/image/top/animation/${frame.mobile}`}
            pcSrc={`/image/top/animation/${frame.desktop}`}
            className="object-cover"
            pictureClassName="top-logo-deco-frame absolute inset-0 h-full w-full"
            style={{ animationDelay: frame.delay, zIndex: 7 }}
          />
        ))}
      </div>
      <LogoInfo />
    </div>
  );
}

function ImportantNewsSection({
  body,
}: {
  body: Awaited<ReturnType<typeof getImportantNewsBody>>;
}) {
  return (
    <div className="w-full md:max-w-none">
      <ImportantFrame title="重要なお知らせ">
        {body ? <NewsRichText data={body} /> : <p>{NO_IMPORTANT_NEWS_MESSAGE}</p>}
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
      <div className="flex w-full flex-col items-center gap-m md:gap-l">
        <div className="w-full">
          <PickUpFrame>
            {slides.length > 0 ? (
              <PickUpCarouselLazy slides={slides} autoPlay={{ delay: PICKUP_AUTOPLAY_DELAY_MS }} />
            ) : (
              <div className="aspect-video w-full bg-base-dark md:mx-auto md:w-[60%]" />
            )}
          </PickUpFrame>
        </div>
        <ButtonMain href="/event" title="企画一覧を見る" />
      </div>
    </div>
  );
}

function UpcomingProgramsSection({
  group,
}: {
  group: Awaited<ReturnType<typeof getTopPageData>>["upcomingProgramGroup"];
}) {
  const events =
    group?.programs.map((program) => ({
      id: program.id,
      ...toEventFrameProps(program),
    })) ?? [];

  return (
    <section
      aria-label="まもなく開始の企画"
      className="flex w-full flex-col items-center gap-m md:gap-ll"
    >
      <div className={SECTION_TITLE_CLASS_NAME}>
        <SectionTitle
          title={
            <div className="flex flex-row items-center gap-ss md:gap-l">
              まもなく開始の企画
              {group ? (
                <span className="text-[24px] md:text-[40px]">{`<${group.startTime}～>`}</span>
              ) : null}
            </div>
          }
        />
      </div>
      <div className="flex w-full flex-col gap-m md:gap-l">
        <div className="bg-base-dark py-l md:py-3l">
          {events.length > 0 ? (
            <EventCarousel ariaLabel="まもなく開始の企画カルーセル" events={events} />
          ) : (
            <div className="flex h-54 items-center justify-center px-ll md:h-84">
              <p className="text-center text-text text-font-main md:text-Ptext">
                まもなく開始の企画はありません
              </p>
            </div>
          )}
        </div>
        <div className="flex w-full justify-center">
          <ButtonMain href="/schedule" title="タイムスケジュールを見る" />
        </div>
      </div>
    </section>
  );
}

function MapSection() {
  return (
    <section
      aria-label="会場マップ"
      className="relative flex w-full flex-col items-center gap-m md:gap-ll"
    >
      <div className="pointer-events-none absolute -top-41 left-0 -z-10 w-26.25 md:-top-56 md:w-54.25">
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
          width={217}
          height={744}
          className="hidden h-auto w-full md:block"
        />
      </div>
      <div className={SECTION_TITLE_CLASS_NAME}>
        <SectionTitle title="会場マップ" />
      </div>
      <div className="flex w-full flex-col items-center gap-m md:gap-l">
        <div className="w-full md:max-w-200">
          <MapFrame showDecoration={false} />
        </div>
        <ButtonMain href="/map" title="マップを見る" />
      </div>
      <div className="pointer-events-none absolute right-0 -bottom-32 -z-10 w-49.5 md:-bottom-pl md:w-65.5">
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
          width={262}
          height={296}
          className="hidden h-auto w-full md:block"
        />
      </div>
    </section>
  );
}

function NewsSection({ newsItems }: { newsItems: Awaited<ReturnType<typeof getLatestNews>> }) {
  return (
    <div className="flex w-full flex-col items-center gap-m md:gap-ll">
      <div className={SECTION_TITLE_CLASS_NAME}>
        <SectionTitle title="お知らせ" />
      </div>
      <section className="flex w-full flex-col items-center gap-m md:gap-l">
        <div className="w-full bg-base-dark px-ll py-l md:px-pl md:py-3l">
          <div className="mx-auto w-full md:max-w-190">
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
        </div>
        <ButtonMain href="/news" title="お知らせ一覧を見る" />
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
  const { importantNewsBody, latestNews, pickUpSlides, upcomingProgramGroup } =
    await getTopPageData();

  return (
    <div className="flex w-full flex-col gap-4l md:gap-5l">
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
      <UpcomingProgramsSection group={upcomingProgramGroup} />
      <MapSection />
      <NewsSection newsItems={latestNews} />
      <div className="flex w-full flex-col gap-4l md:gap-5l">
        <SponsorAdsBoundary />
        <InfoSection />
      </div>
    </div>
  );
}

function TopPageSkeleton() {
  return (
    <div className="flex w-full flex-col gap-4l md:gap-5l">
      <div className="w-full max-w-105 md:max-w-none">
        <ImportantFrameSkeleton />
      </div>

      <div className="flex w-full flex-col items-center gap-m md:gap-ll">
        <div className={SECTION_TITLE_CLASS_NAME}>
          <SectionTitle title="PICK UP" />
        </div>
        <div className="flex w-full flex-col items-center gap-m md:gap-l">
          <div className="w-full">
            <PickUpFrame>
              <div className="aspect-video w-full animate-pulse bg-base-dark md:mx-auto md:w-[60%]" />
            </PickUpFrame>
          </div>
          <ButtonMain href="/event" title="企画一覧を見る" />
        </div>
      </div>

      <div className="flex w-full flex-col items-center gap-m md:gap-ll">
        <div className={SECTION_TITLE_CLASS_NAME}>
          <SectionTitle title="まもなく開始の企画" />
        </div>
        <div className="flex w-full flex-col gap-m md:gap-l">
          <div className="bg-base-dark py-l md:py-3l">
            <div className="h-54 animate-pulse md:h-84" />
          </div>
          <div className="flex w-full justify-center">
            <ButtonMain href="/schedule" title="タイムスケジュールを見る" />
          </div>
        </div>
      </div>

      <MapSection />

      <div className="flex w-full flex-col items-center gap-m md:gap-ll">
        <div className={SECTION_TITLE_CLASS_NAME}>
          <SectionTitle title="お知らせ" />
        </div>
        <section className="flex w-full flex-col items-center gap-m md:gap-l">
          <div className="w-full bg-base-dark px-ll py-l md:px-pl md:py-3l">
            <div className="mx-auto w-full md:max-w-190">
              <ul className="flex flex-col gap-m md:gap-l">
                <NewsItemSkeleton key="news-skeleton-0" skeletonClassName="bg-base" />
                <NewsItemSkeleton key="news-skeleton-1" skeletonClassName="bg-base" />
                <NewsItemSkeleton key="news-skeleton-2" skeletonClassName="bg-base" />
              </ul>
            </div>
          </div>
          <ButtonMain href="/news" title="お知らせ一覧を見る" />
        </section>
      </div>

      <InfoSection />
    </div>
  );
}

export default function TopPageView() {
  return (
    <div
      className="relative z-0 flex min-h-screen flex-col items-center overflow-x-hidden bg-base"
      id="top"
    >
      <TopHeroAnime />
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
