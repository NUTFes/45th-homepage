"use client";

import { type CSSProperties, useEffect, useRef } from "react";

import type { TimetableModel } from "../model";
import type { ScheduleLaneDTO } from "../types";
import ScheduleCard from "./ScheduleCard";

const GRID_SLOT_HEIGHT_PX = 30.5;

export type MobileLaneModel = {
  lane: ScheduleLaneDTO;
  model: TimetableModel;
  currentItemId?: string;
};

type MobileTimetableProps = {
  laneModels: readonly MobileLaneModel[];
  selectedLaneId: string | null;
  onLaneChange: (laneId: string) => void;
};

export default function MobileTimetable({
  laneModels,
  selectedLaneId,
  onLaneChange,
}: MobileTimetableProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lanePanelRefs = useRef(new Map<string, HTMLElement>());
  const scrollSettledTimerRef = useRef<number | null>(null);
  const firstLaneId = laneModels[0]?.lane.id;

  useEffect(() => {
    if (!selectedLaneId) {
      return;
    }

    const scrollContainer = scrollContainerRef.current;
    const lanePanel = lanePanelRefs.current.get(selectedLaneId);
    if (!scrollContainer || !lanePanel) {
      return;
    }

    const firstLanePanel = firstLaneId ? lanePanelRefs.current.get(firstLaneId) : undefined;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scrollContainer.scrollTo({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      left: lanePanel.offsetLeft - (firstLanePanel?.offsetLeft ?? 0),
    });
  }, [firstLaneId, selectedLaneId]);

  useEffect(
    () => () => {
      if (scrollSettledTimerRef.current !== null) {
        window.clearTimeout(scrollSettledTimerRef.current);
      }
    },
    [],
  );

  const handleScroll = () => {
    if (scrollSettledTimerRef.current !== null) {
      window.clearTimeout(scrollSettledTimerRef.current);
    }

    scrollSettledTimerRef.current = window.setTimeout(() => {
      const scrollContainer = scrollContainerRef.current;
      if (!scrollContainer || scrollContainer.clientWidth === 0) {
        return;
      }

      const laneIndex = Math.round(scrollContainer.scrollLeft / scrollContainer.clientWidth);
      const laneId = laneModels[laneIndex]?.lane.id;
      if (laneId && laneId !== selectedLaneId) {
        onLaneChange(laneId);
      }
    }, 120);
  };

  if (laneModels.length === 0) {
    return (
      <section className="flex min-h-96 items-center justify-center px-l py-4l text-center text-text text-font-main md:hidden">
        会場が登録されるとタイムスケジュールを表示します
      </section>
    );
  }

  return (
    <div
      aria-label="会場別タイムスケジュール"
      className="relative flex snap-x snap-mandatory [scrollbar-width:thin] overflow-x-auto md:hidden"
      onScroll={handleScroll}
      ref={scrollContainerRef}
    >
      {laneModels.map(({ lane, model, currentItemId }) => {
        const isSelected = lane.id === selectedLaneId;
        const timetableStyle = {
          "--timetable-slot-height": `${GRID_SLOT_HEIGHT_PX}px`,
          height: `${model.slotCount * GRID_SLOT_HEIGHT_PX}px`,
        } as CSSProperties;

        return (
          <section
            aria-hidden={isSelected ? undefined : true}
            aria-labelledby={`timetable-heading-${lane.id}`}
            className="w-full shrink-0 snap-start bg-base px-m pt-4l pb-4l"
            id={`timetable-panel-${lane.id}`}
            inert={!isSelected}
            key={lane.id}
            ref={(node) => {
              if (node) {
                lanePanelRefs.current.set(lane.id, node);
              } else {
                lanePanelRefs.current.delete(lane.id);
              }
            }}
          >
            <h2 id={`timetable-heading-${lane.id}`} className="sr-only">
              {lane.name}のタイムスケジュール
            </h2>
            <div className="relative" style={timetableStyle}>
              {model.ticks.map((tick) => (
                <div
                  key={`${lane.id}-${tick.label}-${tick.offsetSlots}`}
                  className="pointer-events-none absolute right-0 left-0 z-0 flex items-start"
                  style={{ top: `calc(${tick.offsetSlots} * var(--timetable-slot-height))` }}
                >
                  <time
                    className={`w-17 shrink-0 pr-xs text-right text-text-large text-font-main ${
                      tick.isFirst
                        ? "translate-y-0"
                        : tick.isLast
                          ? "-translate-y-full"
                          : "-translate-y-1/2"
                    }`}
                  >
                    {tick.label}
                  </time>
                  <span
                    className="h-px flex-1 -translate-y-1/2 bg-secondary/50"
                    aria-hidden="true"
                  />
                </div>
              ))}

              <div className="absolute top-0 right-0 bottom-0 left-17 bg-transparent">
                {model.items.map((item) => (
                  <div
                    key={item.id}
                    className="absolute inset-x-0 z-10 min-h-0"
                    style={{
                      height: `${item.durationSlots * GRID_SLOT_HEIGHT_PX}px`,
                      top: `${item.startOffsetSlots * GRID_SLOT_HEIGHT_PX}px`,
                    }}
                  >
                    <ScheduleCard
                      endTime={item.endTime}
                      href={item.href}
                      isHighlighted={item.id === currentItemId}
                      startTime={item.startTime}
                      title={item.title}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
