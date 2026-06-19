import ProgramPageView from "@/modules/event/ui/programs/category/[category]/ProgramPageView";
import { PROGRAM_CATEGORIES } from "@/lib/events/constants";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const matched = PROGRAM_CATEGORIES.find(({ value }) => value === category);
  if (!matched) notFound();
  return <ProgramPageView category={matched.label} />;
}
