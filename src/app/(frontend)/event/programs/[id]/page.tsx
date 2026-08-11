import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { connection } from "next/server";

import ProgramDetailPageView from "@/modules/event/programs/ProgramDetailPageView";
import { toEventSchedules } from "@/modules/events/presentation";
import { getProgramDetailPageData } from "@/modules/events/server/getProgramDetailPageData";
import SponsorAdsBoundary from "@/modules/sponsors/ui/SponsorAdsBoundary";

type Props = {
  params: Promise<{ id: string }>;
};

const BUILD_PLACEHOLDER_PROGRAM_ID = "__placeholder__";

export function generateStaticParams() {
  return [{ id: BUILD_PLACEHOLDER_PROGRAM_ID }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  if (id === BUILD_PLACEHOLDER_PROGRAM_ID) {
    notFound();
  }
  const program = await getProgramDetailPageData(id);

  if (!program) {
    notFound();
  }

  return {
    title: `${program.title} | 企画情報`,
    description: program.description.slice(0, 160),
    alternates: {
      canonical: `/event/programs/${program.id}`,
    },
  };
}

async function ProgramDetailPageContent({ params }: Props) {
  const { id } = await params;
  if (id === BUILD_PLACEHOLDER_PROGRAM_ID) {
    notFound();
  }
  await connection();
  const program = await getProgramDetailPageData(id);
  if (!program) {
    notFound();
  }

  return (
    <ProgramDetailPageView
      hero={{
        title: program.title,
        imageSrc: program.image?.url,
        imageAlt: program.image?.alt || `${program.title}の画像`,
        tags: program.tags,
      }}
      intro={{
        title: program.catchphrase?.trim() || program.title,
        body: program.description,
      }}
      info={{
        location: program.locationName,
        schedules: toEventSchedules(program.scheduleItems),
        map: {
          title: program.locationName,
          imageSrc: program.mapImage?.url,
          alt: program.mapImage?.alt || `${program.locationName}の地図`,
        },
      }}
      sponsorAds={
        <SponsorAdsBoundary className="relative z-10 mx-auto w-full pb-4l" surface="transparent" />
      }
    />
  );
}

export default function Page(props: Props) {
  return (
    <Suspense
      fallback={
        <div aria-label="企画詳細を読み込み中" className="min-h-[60svh] animate-pulse bg-base" />
      }
    >
      <ProgramDetailPageContent {...props} />
    </Suspense>
  );
}
