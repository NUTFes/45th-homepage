import { twMerge } from "tailwind-merge";

import Skeleton from "@/components/ui/Skeleton";

import type { SponsorAdsSectionProps } from "./SponsorAdsSection";

const SPONSOR_AD_SKELETON_IDS = [
  "sponsor-ad-skeleton-0",
  "sponsor-ad-skeleton-1",
  "sponsor-ad-skeleton-2",
  "sponsor-ad-skeleton-3",
] as const;

export default function SponsorAdsSectionSkeleton({
  className,
  surface = "dark",
}: SponsorAdsSectionProps) {
  return (
    <section
      aria-hidden="true"
      className={twMerge("flex w-full flex-col items-center gap-m", className)}
    >
      <div
        className={`w-full overflow-hidden py-s lg:px-5l ${surface === "dark" ? "bg-base-dark" : "bg-transparent"}`}
      >
        <div className="flex items-center">
          {SPONSOR_AD_SKELETON_IDS.map((id) => (
            <div className="min-w-0 flex-[0_0_100%] px-ll lg:flex-[0_0_25%] lg:px-0" key={id}>
              <div className="mx-auto flex w-full max-w-75 flex-col items-center gap-xs md:w-full lg:max-w-62">
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
