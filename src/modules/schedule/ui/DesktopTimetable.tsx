import type { CSSProperties } from "react";

import type { TimetableModel } from "../model";
import type { ScheduleLaneDTO } from "../types";
import TimetableCard from "./TimetableCard";

const SLOT_HEIGHT_PX = 38;
const LANE_HEADER_HEIGHT_PX = 58;
const LANE_WIDTH_PX = 279;
const TIME_GUTTER_WIDTH_PX = 72;

export type DesktopLaneModel = {
  lane: ScheduleLaneDTO;
  model: TimetableModel;
};

type DesktopTimetableProps = {
  groupName?: string;
  laneModels: readonly DesktopLaneModel[];
};

export default function DesktopTimetable({ groupName, laneModels }: DesktopTimetableProps) {
  if (!groupName || laneModels.length === 0) {
    return (
      <section className="hidden min-h-120 items-center justify-center border-y-2 border-main px-pm py-4l text-center text-Ptext text-font-main md:flex">
        {groupName ? "この会場グループには使用中の会場がありません" : "会場グループを準備中です"}
      </section>
    );
  }

  const referenceModel = laneModels[0].model;
  const gridHeight = referenceModel.slotCount * SLOT_HEIGHT_PX;
  const timetableWidth = TIME_GUTTER_WIDTH_PX + laneModels.length * LANE_WIDTH_PX;
  const timetableStyle = {
    "--desktop-grid-height": `${gridHeight}px`,
    "--desktop-header-height": `${LANE_HEADER_HEIGHT_PX}px`,
    gridTemplateColumns: `${TIME_GUTTER_WIDTH_PX}px repeat(${laneModels.length}, ${LANE_WIDTH_PX}px)`,
    minWidth: `${timetableWidth}px`,
  } as CSSProperties;

  return (
    <section
      aria-label={`${groupName}のタイムスケジュール`}
      className="hidden border-y-2 border-main bg-base/60 px-pm py-4l md:block"
    >
      {laneModels.every(({ model }) => model.items.length === 0) ? (
        <p className="mx-auto mb-l max-w-260 border border-main bg-base-dark px-l py-s text-center text-Ptext text-font-main">
          この日付・天候・会場グループで開催する企画はありません
        </p>
      ) : null}

      <div className="mx-auto max-w-260 [scrollbar-color:var(--color-main)_var(--color-base-dark)] overflow-x-auto">
        <div className="grid w-max" style={timetableStyle}>
          <div
            aria-hidden="true"
            className="relative"
            style={{ height: `calc(var(--desktop-header-height) + var(--desktop-grid-height))` }}
          >
            {referenceModel.ticks.map((tick) => (
              <time
                key={`${tick.label}-${tick.offsetSlots}`}
                className={`absolute right-s text-Ptext-large text-font-main ${
                  tick.isFirst
                    ? "translate-y-0"
                    : tick.isLast
                      ? "-translate-y-full"
                      : "-translate-y-1/2"
                }`}
                style={{
                  top: `calc(var(--desktop-header-height) + ${tick.offsetSlots * SLOT_HEIGHT_PX}px)`,
                }}
              >
                {tick.label}
              </time>
            ))}
          </div>

          {laneModels.map(({ lane, model }, laneIndex) => (
            <article
              aria-label={`${lane.name}の予定`}
              className={`border-r-2 border-secondary/50 ${
                laneIndex % 2 === 0 ? "bg-base-dark/40" : "bg-[#14185b]/60"
              }`}
              key={lane.id}
            >
              <h2 className="flex h-14.5 items-center justify-center border-y-2 border-main bg-base-dark px-m text-center text-Pbutton text-font-main">
                {lane.name}
              </h2>
              <div className="relative" style={{ height: `${gridHeight}px` }}>
                {model.ticks.map((tick) => (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-0 left-0 h-px bg-secondary/50"
                    key={`${lane.id}-${tick.label}-${tick.offsetSlots}`}
                    style={{ top: `${tick.offsetSlots * SLOT_HEIGHT_PX}px` }}
                  />
                ))}
                {model.items.map((item) => (
                  <div
                    className="absolute right-1 left-1 z-10"
                    key={item.id}
                    style={{
                      height: `${item.rowSpan * SLOT_HEIGHT_PX}px`,
                      top: `${(item.startRow - 1) * SLOT_HEIGHT_PX}px`,
                    }}
                  >
                    <TimetableCard
                      desktop
                      endTime={item.endTime}
                      href={item.href}
                      startTime={item.startTime}
                      title={item.title}
                    />
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
