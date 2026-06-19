import ProgramPageView from "@/modules/event/ui/programs/category/[category]/ProgramPageView";

export default async function Page({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  return <ProgramPageView category={decodeURIComponent(category)} />;
}
