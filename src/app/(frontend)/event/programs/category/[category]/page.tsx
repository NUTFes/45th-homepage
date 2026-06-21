import ProgramPageView from "@/modules/event/ui/programs/category/[category]/ProgramPageView";
import { PROGRAM_CATEGORIES } from "@/lib/events/constants";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type Props = {
  params: Promise<{ category: string }>;
};

async function ProgramCategoryPageContent({ params }: Props) {
  const { category } = await params;
  const matched = PROGRAM_CATEGORIES.find(({ value }) => value === category);
  if (!matched) notFound();
  return <ProgramPageView category={matched.label} />;
}

export default function Page(props: Props) {
  return (
    <Suspense>
      <ProgramCategoryPageContent {...props} />
    </Suspense>
  );
}
