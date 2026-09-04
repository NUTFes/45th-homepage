import { twMerge } from "tailwind-merge";

import ButtonMain from "@/components/ui/ButtonMain";

import { getSponsorsPageData } from "../server/getSponsorsPageData";
import type { SponsorDTO } from "../types";
import SponsorAdCarousel from "./SponsorAdCarousel";
import SponsorCard from "./SponsorCard";

export type SponsorAdsSurface = "dark" | "transparent";

export type SponsorAdsSectionProps = {
  className?: string;
  surface?: SponsorAdsSurface;
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

function SponsorAdsEmptyState({ surface }: Required<Pick<SponsorAdsSectionProps, "surface">>) {
  return (
    <>
      <p className="sr-only">協賛企業広告は現在準備中です。</p>
      <div
        aria-hidden="true"
        className={`w-full overflow-hidden py-s lg:px-5l ${surface === "dark" ? "bg-base-dark" : "bg-transparent"}`}
      >
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

export default async function SponsorAdsSection({
  className,
  surface = "dark",
}: SponsorAdsSectionProps) {
  const { sponsors } = await getSponsorsPageData();

  return (
    <section
      className={twMerge("flex w-full flex-col items-center gap-m", className)}
      aria-label="協賛企業広告"
    >
      {sponsors.length > 0 ? (
        <SponsorAdCarousel sponsors={sponsors} surface={surface} />
      ) : (
        <SponsorAdsEmptyState surface={surface} />
      )}
      <ButtonMain href="/sponsors" title="ご協賛いただいた企業様" />
    </section>
  );
}
