"use client";

import { useEffect, useState } from "react";

import { CarouselRoot, CarouselSlide, CarouselViewport } from "@/components/ui/carousel";

import type { SponsorWithImageDTO } from "../types";
import SponsorCard from "./SponsorCard";

type SponsorAdCarouselProps = {
  sponsors: SponsorWithImageDTO[];
};

const DESKTOP_SPONSOR_AD_VISIBLE_COUNT = 4;
const MOBILE_SPONSOR_AD_VISIBLE_COUNT = 1;
const SPONSOR_AD_AUTOPLAY_DELAY_MS = 3000;
const SPONSOR_AD_DESKTOP_MEDIA_QUERY = "(min-width: 768px)";

const useIsDesktopSponsorAdViewport = () => {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia(SPONSOR_AD_DESKTOP_MEDIA_QUERY);
    const updateIsDesktop = () => {
      setIsDesktop(mediaQuery.matches);
    };

    updateIsDesktop();
    mediaQuery.addEventListener("change", updateIsDesktop);

    return () => {
      mediaQuery.removeEventListener("change", updateIsDesktop);
    };
  }, []);

  return isDesktop;
};

export default function SponsorAdCarousel({ sponsors }: SponsorAdCarouselProps) {
  const isDesktop = useIsDesktopSponsorAdViewport();
  const visibleSponsorCount =
    isDesktop === false ? MOBILE_SPONSOR_AD_VISIBLE_COUNT : DESKTOP_SPONSOR_AD_VISIBLE_COUNT;
  const shouldAutoPlay = sponsors.length > visibleSponsorCount;

  if (sponsors.length === 0) {
    return null;
  }

  return (
    <CarouselRoot
      ariaLabel="協賛企業広告カルーセル"
      autoPlay={
        shouldAutoPlay
          ? {
              delay: SPONSOR_AD_AUTOPLAY_DELAY_MS,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
            }
          : false
      }
      className="relative w-full"
      loop={shouldAutoPlay}
      options={{ align: "start", containScroll: "trimSnaps", slidesToScroll: 1 }}
    >
      <CarouselViewport
        className="w-full overflow-hidden bg-base-dark py-s md:px-5l"
        trackClassName="items-center"
      >
        {sponsors.map((sponsor, index) => (
          <CarouselSlide
            ariaLabel={`${sponsor.companyName} の広告`}
            className="min-w-0 flex-[0_0_100%] px-ll md:flex-[0_0_25%] md:px-0"
            index={index}
            key={sponsor.id}
          >
            <SponsorCard
              className="mx-auto w-full max-w-75 gap-xs md:w-full md:max-w-62"
              imageSizes="(min-width: 768px) min(248px, calc((100vw - 160px) / 4)), 300px"
              sponsor={sponsor}
            />
          </CarouselSlide>
        ))}
      </CarouselViewport>
    </CarouselRoot>
  );
}
