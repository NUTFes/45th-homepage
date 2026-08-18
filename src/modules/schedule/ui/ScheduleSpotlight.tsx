import Link from "next/link";

import type { ScheduleSpotlight as ScheduleSpotlightModel } from "../model";

export default function ScheduleSpotlight({ spotlight }: { spotlight: ScheduleSpotlightModel }) {
  return (
    <section
      aria-label="現在・次の企画"
      aria-live="polite"
      className="border-b-2 border-main bg-base-dark px-3l py-m text-font-main shadow-[0_2px_6px_0_var(--color-base-shadow)]"
    >
      {spotlight.kind === "checking" ? (
        <p className="text-text">現在の企画を確認しています</p>
      ) : spotlight.kind === "none" ? (
        <p className="text-text">この条件で次に始まる企画はありません</p>
      ) : (
        <div className="flex flex-col gap-0.5">
          <p className="text-text">
            {spotlight.kind === "current" ? "現在開催中" : "次の企画"}　{spotlight.item.startTime}～
          </p>
          <Link
            className="w-fit rounded-sm text-textb underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main"
            href={spotlight.item.href}
          >
            {spotlight.item.title}
          </Link>
        </div>
      )}
    </section>
  );
}
