import { Suspense } from "react";
import { connection } from "next/server";
import { getLatestNews } from "@/modules/news/server/getNews";
import NewsTop from "./ui/NewsTop";

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
    <div className="flex min-h-screen flex-col items-center bg-base pt-4l">
      <Suspense fallback={<TopPageSkeleton />}>
        <div className="flex flex-col items-center gap-y-ll">
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
              <div className="absolute right-0 bottom-[-450px] z-0 aspect-[393/638]">
                <Image
                  src="/image/top/TopBack2.svg"
                  alt="45th_Top2"
                  width={393}
                  height={393}
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
            <div className="absolute right-0 bottom-99 z-0">
              <Image
                src="/image/top/TopBack3.svg"
                alt="45th_Top3"
                width={393}
                height={638}
                className="pointer-events-none object-contain object-right-top"
              />
            </div>
            <Footer />
          </div>
        </div>
      </Suspense>
    </div>
  );
}
