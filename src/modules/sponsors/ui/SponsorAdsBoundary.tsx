import { Suspense } from "react";
import { connection } from "next/server";

import SponsorAdsSection, { type SponsorAdsSectionProps } from "./SponsorAdsSection";
import SponsorAdsSectionSkeleton from "./SponsorAdsSectionSkeleton";

async function SponsorAdsContent(props: SponsorAdsSectionProps) {
  await connection();

  return <SponsorAdsSection {...props} />;
}

export default function SponsorAdsBoundary(props: SponsorAdsSectionProps) {
  return (
    <Suspense fallback={<SponsorAdsSectionSkeleton {...props} />}>
      <SponsorAdsContent {...props} />
    </Suspense>
  );
}
