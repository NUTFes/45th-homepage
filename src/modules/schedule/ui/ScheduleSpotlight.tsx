import Link from "next/link";

import type { PositionedScheduleItem, ScheduleSpotlight as ScheduleSpotlightModel } from "../model";

type SpotlightItemProps = {
  item: PositionedScheduleItem;
  label: string;
};

function SpotlightItem({ item, label }: SpotlightItemProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-text">
        {label}　{item.startTime}～
      </p>
      <Link
        className="w-fit rounded-sm text-textb underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main"
        href={item.href}
      >
        {item.title}
      </Link>
    </div>
  );
}

export default function ScheduleSpotlight({ spotlight }: { spotlight: ScheduleSpotlightModel }) {
  return (
    <section
      aria-label="現在・次の企画"
      aria-live="polite"
      className="border-y-2 border-main bg-base-dark px-3l py-m text-font-main shadow-[0_2px_6px_0_var(--color-base-shadow)] md:hidden"
    >
      {spotlight.kind === "checking" ? (
        <p className="text-text">現在の企画を確認しています</p>
      ) : spotlight.current || spotlight.next ? (
        <div className="flex flex-col gap-s">
          {spotlight.current ? <SpotlightItem item={spotlight.current} label="現在開催中" /> : null}
          {spotlight.next ? <SpotlightItem item={spotlight.next} label="まもなく開始" /> : null}
        </div>
      ) : (
        <p className="text-text">この条件で次に始まる企画はありません</p>
      )}
    </section>
  );
}
