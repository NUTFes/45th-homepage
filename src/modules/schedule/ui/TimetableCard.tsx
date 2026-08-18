import Link from "next/link";

export type TimetableCardProps = {
  desktop?: boolean;
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
  desktop = false,
  endTime,
  href,
  isHighlighted = false,
  startTime,
  title,
}: TimetableCardProps) {
  return (
    <Link
      aria-label={`${title}、${startTime}から${endTime}`}
      className={`flex h-full min-h-0 flex-col items-start overflow-hidden rounded border-2 px-xs py-ss transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary ${
        desktop ? "border-secondary/60 bg-base-dark" : "border-main bg-base-dark"
      } ${
        isHighlighted
          ? "border-main bg-secondary text-base-dark"
          : "text-font-main hover:bg-base-dark/80"
      }`}
      href={href}
    >
      <span className={`shrink-0 ${desktop ? "text-textb" : "text-text-small"}`}>
        {startTime}–{endTime}
      </span>
      <span
        className={`max-w-full font-bold wrap-break-word ${desktop ? "text-Ptext" : "text-textb"}`}
      >
        {title}
      </span>
    </Link>
  );
}
