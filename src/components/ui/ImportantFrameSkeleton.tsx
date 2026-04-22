import ImportantFrame from "@/components/ui/ImportantFrame";

export default function ImportantFrameSkeleton() {
  return (
    <ImportantFrame title="重要なお知らせ">
      <div className="flex w-full flex-col gap-ss">
        <div className="h-6 w-3/4 animate-pulse rounded bg-base" />
        <div className="h-6 w-full animate-pulse rounded bg-base" />
      </div>
    </ImportantFrame>
  );
}
