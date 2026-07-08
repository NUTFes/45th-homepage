import ProgramPageView from "@/modules/event/ui/programs/category/[category]/ProgramPageView";
import { PROGRAM_CATEGORIES } from "@/lib/events/constants";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type Props = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return PROGRAM_CATEGORIES.map(({ value }) => ({
    category: value,
  }));
}

async function ProgramCategoryPageContent({ params }: Props) {
  const { category } = await params;
  const matched = PROGRAM_CATEGORIES.find(({ value }) => value === category);
  if (!matched) notFound();
  return <ProgramPageView category={matched.value} />;
}

export default function Page(props: Props) {
  return (
    <Suspense fallback={null}>
      <ProgramCategoryPageContent {...props} />
    </Suspense>
  );
}
