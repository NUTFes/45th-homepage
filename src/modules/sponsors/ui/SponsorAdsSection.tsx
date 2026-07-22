import { twMerge } from "tailwind-merge";

import ButtonMain from "@/components/ui/ButtonMain";

import { getSponsorsPageData } from "../server/getSponsorsPageData";
import type { SponsorDTO } from "../types";
import { hasSponsorImage } from "../utils";
import SponsorAdCarousel from "./SponsorAdCarousel";
import SponsorCard from "./SponsorCard";

export type SponsorAdsSectionProps = {
  className?: string;
};

const SPONSOR_AD_PLACEHOLDER_IDS = [
  "sponsor-ad-placeholder-0",
  "sponsor-ad-placeholder-1",
  "sponsor-ad-placeholder-2",
  "sponsor-ad-placeholder-3",
] as const;

const SPONSOR_AD_PLACEHOLDER = {
  companyName: "企業名",
  id: "sponsor-ad-placeholder",
} satisfies SponsorDTO;

function SponsorAdsEmptyState() {
  return (
    <>
      <p className="sr-only">協賛企業広告は現在準備中です。</p>
      <div aria-hidden="true" className="w-full overflow-hidden bg-base-dark py-s lg:px-5l">
        <div className="flex items-center">
          {SPONSOR_AD_PLACEHOLDER_IDS.map((id, index) => (
            <div
              className={`min-w-0 flex-[0_0_100%] px-ll lg:block lg:flex-[0_0_25%] lg:px-0 ${index === 0 ? "" : "hidden"}`}
              key={id}
            >
              <SponsorCard
                className="mx-auto w-full max-w-75 gap-xs md:w-full lg:max-w-62"
                sponsor={SPONSOR_AD_PLACEHOLDER}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default async function SponsorAdsSection({ className }: SponsorAdsSectionProps) {
  const { sponsors } = await getSponsorsPageData();
  const sponsorAds = sponsors.filter(hasSponsorImage);

  return (
    <section
      className={twMerge("flex w-full flex-col items-center gap-m", className)}
      aria-label="協賛企業広告"
    >
      {sponsorAds.length > 0 ? (
        <SponsorAdCarousel sponsors={sponsorAds} />
      ) : (
        <SponsorAdsEmptyState />
      )}
      <ButtonMain href="/sponsors" title="ご協賛いただいた企業様" />
    </section>
  );
}
