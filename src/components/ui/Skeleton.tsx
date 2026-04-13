import { twMerge } from "tailwind-merge";

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export default function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={twMerge("animate-pulse rounded bg-base-dark opacity-50", className)}
      {...props}
    />
  );
}
