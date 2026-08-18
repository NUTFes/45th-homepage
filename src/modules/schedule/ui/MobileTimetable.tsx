import type { CSSProperties } from "react";

import type { TimetableModel } from "../model";
import TimetableCard from "./TimetableCard";

const SLOT_HEIGHT_PX = 25;

type MobileTimetableProps = {
  highlightedItemId?: string;
  model: TimetableModel;
  laneName?: string;
};

export default function MobileTimetable({
  highlightedItemId,
  model,
  laneName,
}: MobileTimetableProps) {
  if (!laneName) {
    return (
      <section className="flex min-h-96 items-center justify-center px-l py-4l text-center text-text text-font-main md:hidden">
        会場が登録されるとタイムスケジュールを表示します
      </section>
    );
  }

  const timetableStyle = {
    "--timetable-slot-height": `${SLOT_HEIGHT_PX}px`,
    height: `${model.slotCount * SLOT_HEIGHT_PX}px`,
  } as CSSProperties;

  return (
    <section aria-labelledby="timetable-heading" className="bg-base px-m pt-4l pb-4l md:hidden">
      <h2 id="timetable-heading" className="sr-only">
        {laneName}のタイムスケジュール
      </h2>
      {model.items.length === 0 ? (
        <p className="mb-m border border-main bg-base-dark px-s py-xs text-center text-text text-font-main">
          この日付・天候・会場で開催する企画はありません
        </p>
      ) : null}

      <div className="relative" style={timetableStyle}>
        {model.ticks.map((tick) => (
          <div
            key={`${tick.label}-${tick.offsetSlots}`}
            className="pointer-events-none absolute right-0 left-0 z-0 flex items-center gap-xs"
            style={{ top: `calc(${tick.offsetSlots} * var(--timetable-slot-height))` }}
          >
            <time
              className={`w-14 shrink-0 text-right text-text-large text-font-main ${
                tick.isFirst
                  ? "translate-y-0"
                  : tick.isLast
                    ? "-translate-y-full"
                    : "-translate-y-1/2"
              }`}
            >
              {tick.label}
            </time>
            <span className="h-px flex-1 -translate-y-1/2 bg-secondary/50" aria-hidden="true" />
          </div>
        ))}

        <div
          className="absolute top-0 right-0 bottom-0 left-16 grid border-x border-main/70 bg-base-dark/20"
          style={{
            gridTemplateRows: `repeat(${model.slotCount}, var(--timetable-slot-height))`,
          }}
        >
          {model.items.map((item) => (
            <div
              key={item.id}
              className="relative z-10 mx-0.5 my-px min-h-0"
              style={{ gridRow: `${item.startRow} / span ${item.rowSpan}` }}
            >
              <TimetableCard
                endTime={item.endTime}
                href={item.href}
                isHighlighted={item.id === highlightedItemId}
                startTime={item.startTime}
                title={item.title}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
