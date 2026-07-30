import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";

import { PROGRAM_CATEGORIES, PROGRAM_CATEGORY_LABELS } from "@/lib/events/constants";
import ProgramListPageView from "@/modules/event/programs/ProgramListPageView";
import { findEventCategory } from "@/modules/events/presentation";
import { getEventsPageData } from "@/modules/events/server/getEventsPageData";
import { isProgramCategory } from "@/modules/events/utils";
import SponsorAdsBoundary from "@/modules/sponsors/ui/SponsorAdsBoundary";

type Props = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return PROGRAM_CATEGORIES.map(({ value }) => ({
    category: value,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  if (!isProgramCategory(category)) {
    notFound();
  }

  const label = PROGRAM_CATEGORY_LABELS[category];
  return {
    title: label,
    description: `第45回技大祭の${label}企画をご案内します。`,
    alternates: {
      canonical: `/event/programs/category/${category}`,
    },
  };
}

async function ProgramCategoryPageContent({ category }: { category: string }) {
  await connection();
  if (!isProgramCategory(category)) {
    notFound();
  }

  const data = await getEventsPageData();
  const matched = findEventCategory(data.categories, category);
  if (!matched) {
    notFound();
  }

  return (
    <ProgramListPageView
      title={matched.label}
      programs={matched.programs}
      filterVariant={category}
      sponsorAds={<SponsorAdsBoundary />}
    />
  );
}

export default async function Page({ params }: Props) {
  const { category } = await params;
  if (!isProgramCategory(category)) {
    notFound();
  }

  return (
    <Suspense
      fallback={
        <div
          aria-label="カテゴリ別企画一覧を読み込み中"
          className="min-h-[60svh] animate-pulse bg-base"
        />
      }
    >
      <ProgramCategoryPageContent category={category} />
    </Suspense>
  );
}
