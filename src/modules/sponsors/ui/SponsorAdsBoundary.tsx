import { Suspense } from "react";
import { connection } from "next/server";

import SponsorAdsSection, { type SponsorAdsSectionProps } from "./SponsorAdsSection";
import SponsorAdsSectionSkeleton from "./SponsorAdsSectionSkeleton";

async function SponsorAdsContent(props: SponsorAdsSectionProps) {
  await connection();

  return <SponsorAdsSection {...props} />;
}

export default function SponsorAdsBoundary({ className }: SponsorAdsSectionProps) {
  return (
    <Suspense fallback={<SponsorAdsSectionSkeleton className={className} />}>
      <SponsorAdsContent className={className} />
    </Suspense>
  );
}
