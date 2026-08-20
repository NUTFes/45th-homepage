import Link from "next/link";

export type ScheduleCardVariant = "mobile" | "desktop-even" | "desktop-odd";

export type ScheduleCardProps = {
  endTime: string;
  href: string;
  isHighlighted?: boolean;
  startTime: string;
  title: string;
  variant?: ScheduleCardVariant;
};

/**
 * タイムスケジュール上の企画カード。位置と外寸は親のタイムラインが管理する。
 */
export default function ScheduleCard({
  endTime,
  href,
  isHighlighted = false,
  startTime,
  title,
  variant = "mobile",
}: ScheduleCardProps) {
  const isDesktop = variant !== "mobile";
  const normalClasses =
    variant === "desktop-odd"
      ? "border-timetable-border bg-timetable-dark hover:bg-timetable-dark/90"
      : variant === "desktop-even"
        ? "border-main bg-base-dark hover:bg-base-dark/90"
        : "border-main bg-base-dark hover:bg-base-dark/80";

  return (
    <Link
      aria-label={`${title}、${startTime}から${endTime}`}
      className={`flex h-full min-h-0 flex-col items-start overflow-hidden rounded border-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary ${
        isDesktop ? "px-s py-xs" : "px-xs py-ss"
      } ${
        isHighlighted
          ? "border-main bg-secondary text-base-dark"
          : `${normalClasses} text-font-main`
      }`}
      href={href}
    >
      <span className={`shrink-0 ${isDesktop ? "text-textb" : "text-text-small"}`}>
        {startTime}–{endTime}
      </span>
      <span
        className={`max-w-full font-bold wrap-break-word ${isDesktop ? "text-Ptext" : "text-textb"}`}
      >
        {title}
      </span>
    </Link>
  );
}
