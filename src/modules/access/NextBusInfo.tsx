"use client";

import { useEffect, useState } from "react";
import { getNextBusInfo, type BusDeparture } from "./busTimetable";

const BUS_TYPE_LABELS: Record<BusDeparture["type"], string> = {
  shuttle: "シャトル",
  route: "路線バス",
};

function Departure({ departure }: { departure: BusDeparture | null }) {
  if (departure === null) return <>本日の運行は終了しました</>;

  return (
    <>
      <time dateTime={departure.time}>{departure.time}</time>
      <span className="ml-xs">{BUS_TYPE_LABELS[departure.type]}</span>
    </>
  );
}

export default function NextBusInfo() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const updateNow = () => {
      setNow(new Date());
      const delay = 60_000 - (Date.now() % 60_000);
      timeoutId = setTimeout(updateNow, delay);
    };

    updateNow();
    return () => clearTimeout(timeoutId);
  }, []);

  const info = now === null ? null : getNextBusInfo(now);

  return (
    <section
      aria-label="直近のバス案内"
      className="w-full border-y-[1.4px] border-main bg-timetable-base-dark px-3l py-l text-center text-font-main shadow-[0_2px_6px_0_var(--color-base)] md:px-pl md:py-3l"
    >
      <div className="flex min-h-11 items-center justify-center md:min-h-16">
        {info === null ? (
          <p className="text-textb md:text-Ptext-large">バス時刻を確認中</p>
        ) : info.kind === "offFestival" ? (
          <p className="text-textb md:text-Ptext-large">直近のバス案内は技大祭開催日に表示します</p>
        ) : (
          <dl className="flex flex-col items-center justify-center gap-s md:flex-row md:items-start md:gap-pm">
            <div>
              <dt className="text-textb font-bold md:text-Ptitle-small md:leading-8">
                直近の技大行きのバス
              </dt>
              <dd className="text-text whitespace-nowrap md:text-Ptext-large">
                <Departure departure={info.toUniversity} />
              </dd>
            </div>
            <div>
              <dt className="text-textb font-bold md:text-Ptitle-small md:leading-8">
                直近の長岡駅行きのバス
              </dt>
              <dd className="text-text whitespace-nowrap md:text-Ptext-large">
                <Departure departure={info.toStation} />
              </dd>
            </div>
          </dl>
        )}
      </div>
    </section>
  );
}
