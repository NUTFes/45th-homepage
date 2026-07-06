import { Suspense } from "react";

import SponsorAdsSection, { type SponsorAdsSectionProps } from "./SponsorAdsSection";
import SponsorAdsSectionSkeleton from "./SponsorAdsSectionSkeleton";

export default function SponsorAdsBoundary({ className }: SponsorAdsSectionProps) {
  return (
    <Suspense fallback={<SponsorAdsSectionSkeleton className={className} />}>
      <SponsorAdsSection className={className} />
    </Suspense>
  );
}
