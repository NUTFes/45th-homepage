import Link from "next/link";

export type TimetableCardProps = {
  endTime: string;
  href: string;
  isHighlighted?: boolean;
  startTime: string;
  title: string;
};

/**
 * 本デザインへ差し替えるための最小境界。グリッド上の位置と大きさは親が管理する。
 */
export default function TimetableCard({
  endTime,
  href,
  isHighlighted = false,
  startTime,
  title,
}: TimetableCardProps) {
  return (
    <Link
      aria-label={`${title}、${startTime}から${endTime}`}
      className={`flex h-full min-h-0 items-center gap-1 overflow-hidden rounded border-2 border-main px-1 text-base-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary ${
        isHighlighted ? "bg-main" : "bg-secondary hover:bg-secondary/90"
      }`}
      href={href}
    >
      <span className="shrink-0 text-[10px] leading-4">
        {startTime}–{endTime}
      </span>
      <span className="truncate text-xs leading-4 font-bold">{title}</span>
    </Link>
  );
}
