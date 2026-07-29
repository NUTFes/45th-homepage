"use client";

import { useSyncExternalStore } from "react";

import { CarouselRoot, CarouselSlide, CarouselViewport } from "@/components/ui/carousel";

import type { SponsorWithImageDTO } from "../types";
import SponsorCard from "./SponsorCard";
import type { SponsorAdsSurface } from "./SponsorAdsSection";

type SponsorAdCarouselProps = {
  sponsors: SponsorWithImageDTO[];
  surface?: SponsorAdsSurface;
};

const DESKTOP_SPONSOR_AD_VISIBLE_COUNT = 4;
const MOBILE_SPONSOR_AD_VISIBLE_COUNT = 1;
const SPONSOR_AD_AUTOPLAY_DELAY_MS = 3000;
const SPONSOR_AD_DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";

const subscribeToSponsorAdDesktopViewport = (onStoreChange: () => void) => {
  const mediaQuery = window.matchMedia(SPONSOR_AD_DESKTOP_MEDIA_QUERY);

  mediaQuery.addEventListener("change", onStoreChange);

  return () => {
    mediaQuery.removeEventListener("change", onStoreChange);
  };
};

const getSponsorAdDesktopViewportSnapshot = () =>
  window.matchMedia(SPONSOR_AD_DESKTOP_MEDIA_QUERY).matches;

const getSponsorAdDesktopViewportServerSnapshot = () => true;

const useIsDesktopSponsorAdViewport = () =>
  useSyncExternalStore(
    subscribeToSponsorAdDesktopViewport,
    getSponsorAdDesktopViewportSnapshot,
    getSponsorAdDesktopViewportServerSnapshot,
  );

export default function SponsorAdCarousel({ sponsors, surface = "dark" }: SponsorAdCarouselProps) {
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
        className={`w-full overflow-hidden py-s lg:px-5l ${surface === "dark" ? "bg-base-dark" : "bg-transparent"}`}
        trackClassName="items-center"
      >
        {sponsors.map((sponsor, index) => (
          <CarouselSlide
            ariaLabel={`${sponsor.companyName} の広告`}
            className="min-w-0 flex-[0_0_100%] px-ll lg:flex-[0_0_25%] lg:px-0"
            index={index}
            key={sponsor.id}
          >
            <SponsorCard
              className="mx-auto w-full max-w-75 gap-xs md:w-full lg:max-w-62 [&_h2]:w-full [&_h2]:truncate"
              imageSizes="(min-width: 1024px) min(248px, calc((100vw - 160px) / 4)), 300px"
              sponsor={sponsor}
            />
          </CarouselSlide>
        ))}
      </CarouselViewport>
    </CarouselRoot>
  );
}
