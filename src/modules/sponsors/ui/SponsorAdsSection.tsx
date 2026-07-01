import { twMerge } from "tailwind-merge";

import ButtonMain from "@/components/ui/ButtonMain";

import { getSponsorsPageData } from "../server/getSponsorsPageData";
import { hasSponsorImage } from "../utils";
import SponsorAdCarousel from "./SponsorAdCarousel";

export type SponsorAdsSectionProps = {
  className?: string;
};

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
