import { twMerge } from "tailwind-merge";
import Skeleton from "./Skeleton";

interface NewsItemSkeletonProps {
  skeletonClassName?: string;
}

export default function NewsItemSkeleton({ skeletonClassName }: NewsItemSkeletonProps) {
  return (
    <li className="flex flex-col gap-ss border-b border-font-main px-ss pb-ss">
      <Skeleton className={twMerge("h-4 w-24", skeletonClassName)} />
      <Skeleton className={twMerge("-ml-[0.5em] h-6 w-3/4", skeletonClassName)} />
      <div className="flex flex-col gap-1">
        <Skeleton className={twMerge("h-4 w-full", skeletonClassName)} />
        <Skeleton className={twMerge("h-4 w-11/12", skeletonClassName)} />
        <Skeleton className={twMerge("h-4 w-4/5", skeletonClassName)} />
      </div>
    </li>
  );
}
