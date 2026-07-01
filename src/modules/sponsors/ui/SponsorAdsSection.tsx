import { Suspense } from "react";
import { twMerge } from "tailwind-merge";

import ButtonMain from "@/components/ui/ButtonMain";
import Skeleton from "@/components/ui/Skeleton";

import { getSponsorsPageData } from "../server/getSponsorsPageData";
import { hasSponsorImage } from "../utils";
import SponsorAdCarousel from "./SponsorAdCarousel";

type SponsorAdsSectionProps = {
  className?: string;
};

const SPONSOR_AD_SKELETON_IDS = [
  "sponsor-ad-skeleton-0",
  "sponsor-ad-skeleton-1",
  "sponsor-ad-skeleton-2",
  "sponsor-ad-skeleton-3",
] as const;

export function SponsorAdsSectionSkeleton({ className }: SponsorAdsSectionProps) {
  return (
    <section
      aria-hidden="true"
      className={twMerge("flex w-full flex-col items-center gap-m", className)}
    >
      <div className="w-full overflow-hidden bg-base-dark py-s">
        <div className="flex items-center">
          {SPONSOR_AD_SKELETON_IDS.map((id) => (
            <div className="min-w-0 flex-[0_0_100%] px-ll md:flex-[0_0_25%] md:px-xs" key={id}>
              <div className="mx-auto flex w-full max-w-75 flex-col items-center gap-xs md:w-full md:max-w-62">
                <Skeleton className="h-6 w-3/4 bg-base" />
                <Skeleton className="aspect-4/3 w-full rounded-none border-2 border-main bg-base" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <Skeleton className="min-h-16.5 w-56.25 rounded-full bg-base-dark md:w-75" />
    </section>
  );
}

export function SponsorAdsBoundary({ className }: SponsorAdsSectionProps) {
  return (
    <Suspense fallback={<SponsorAdsSectionSkeleton className={className} />}>
      <SponsorAdsSection className={className} />
    </Suspense>
  );
}

export default async function SponsorAdsSection({ className }: SponsorAdsSectionProps) {
  const { sponsors } = await getSponsorsPageData();
  const sponsorAds = sponsors.filter(hasSponsorImage);

  if (sponsorAds.length === 0) {
    return null;
  }

  return (
    <section
      className={twMerge("flex w-full flex-col items-center gap-m", className)}
      aria-label="協賛企業広告"
    >
      <SponsorAdCarousel sponsors={sponsorAds} />
      <ButtonMain href="/sponsors" title="ご協賛いただいた企業様" />
    </section>
  );
}
