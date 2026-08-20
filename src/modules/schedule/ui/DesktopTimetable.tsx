"use client";

import { type CSSProperties, useRef, useState } from "react";
import Image from "next/image";

import type { TimetableModel } from "../model";
import type { ScheduleGroupDTO, ScheduleLaneDTO } from "../types";
import DesktopLaneSelect from "./DesktopLaneSelect";
import ScheduleCard from "./ScheduleCard";
import TimetableTabs from "./TimetableTabs";

const SLOT_HEIGHT_PX = 38;
const LANE_HEADER_HEIGHT_PX = 58;
const LANE_WIDTH_PX = 279;
const TIME_GUTTER_WIDTH_PX = 72;

export type DesktopGroupModel = {
  group: ScheduleGroupDTO;
  selectedLane: ScheduleLaneDTO;
  model: TimetableModel;
  currentItemId?: string;
};

type DesktopTimetableProps = {
  groupModels: readonly DesktopGroupModel[];
  onLaneChange: (groupId: string, laneId: string) => void;
};

export default function DesktopTimetable({ groupModels, onLaneChange }: DesktopTimetableProps) {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(
    groupModels[0]?.group.id ?? null,
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const groupColumnRefs = useRef(new Map<string, HTMLElement>());

  if (groupModels.length === 0) {
    return (
      <section className="hidden min-h-120 items-center justify-center border-y-2 border-main px-pm py-4l text-center text-Ptext text-font-main md:flex">
        会場グループを準備中です
      </section>
    );
  }

  const referenceModel = groupModels[0].model;
  const gridHeight =
    Math.max(...groupModels.map(({ model }) => model.displaySlotCount)) * SLOT_HEIGHT_PX;
  const timetableWidth = TIME_GUTTER_WIDTH_PX + groupModels.length * LANE_WIDTH_PX;
  const timetableStyle = {
    "--desktop-grid-height": `${gridHeight}px`,
    "--desktop-header-height": `${LANE_HEADER_HEIGHT_PX}px`,
    gridTemplateColumns: `${TIME_GUTTER_WIDTH_PX}px repeat(${groupModels.length}, ${LANE_WIDTH_PX}px)`,
    minWidth: `${timetableWidth}px`,
  } as CSSProperties;

  const handleGroupNavigation = (groupId: string) => {
    setSelectedGroupId(groupId);

    const scrollContainer = scrollContainerRef.current;
    const groupColumn = groupColumnRefs.current.get(groupId);
    if (!scrollContainer || !groupColumn) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const groupOffsetWithinScroller =
      groupColumn.getBoundingClientRect().left -
      scrollContainer.getBoundingClientRect().left +
      scrollContainer.scrollLeft;

    scrollContainer.scrollTo({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      left: groupOffsetWithinScroller - TIME_GUTTER_WIDTH_PX,
    });
  };

  return (
    <div className="hidden pb-pm md:block">
      <TimetableTabs
        ariaLabel="会場グループ"
        controlName="schedule-desktop-group"
        items={groupModels.map(({ group }) => group)}
        onChange={handleGroupNavigation}
        selectedItemId={selectedGroupId}
      />
      <section
        aria-label="会場グループ別タイムスケジュール"
        className="relative border-b-2 border-main bg-base-dark/40 px-pm pt-4l pb-4l"
      >
        <Image
          src="/image/PageBack2.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-[15px] z-0 h-[644px] w-[243px] -translate-y-1/2"
          width={243}
          height={644}
        />
        {groupModels.every(({ model }) => model.items.length === 0) ? (
          <p className="mb-l border border-main bg-base-dark px-l py-s text-center text-Ptext text-font-main">
            この日付・天候で開催する企画はありません
          </p>
        ) : null}

        <div
          className="relative z-10 w-full [scrollbar-color:var(--color-main)_var(--color-base-dark)] overflow-x-auto"
          ref={scrollContainerRef}
        >
          <div className="grid w-max" style={timetableStyle}>
            <div
              aria-hidden="true"
              className="relative"
              style={{
                height: `calc(var(--desktop-header-height) + var(--desktop-grid-height))`,
              }}
            >
              {referenceModel.ticks.map((tick) => (
                <time
                  className={`absolute right-s text-Ptext-large text-font-main ${
                    tick.isFirst
                      ? "translate-y-0"
                      : tick.isLast
                        ? "-translate-y-full"
                        : "-translate-y-1/2"
                  }`}
                  key={`${tick.label}-${tick.offsetSlots}`}
                  style={{
                    top: `calc(var(--desktop-header-height) + ${tick.offsetSlots * SLOT_HEIGHT_PX}px)`,
                  }}
                >
                  {tick.label}
                </time>
              ))}
            </div>

            {groupModels.map(({ group, selectedLane, model, currentItemId }, groupIndex) => (
              <article
                aria-label={`${group.name}・${selectedLane.name}の予定`}
                className={groupIndex % 2 === 0 ? "bg-transparent" : "bg-timetable-dark/60"}
                key={group.id}
                ref={(node) => {
                  if (node) {
                    groupColumnRefs.current.set(group.id, node);
                  } else {
                    groupColumnRefs.current.delete(group.id);
                  }
                }}
              >
                <h2 className="sr-only">{group.name}</h2>
                <div className="h-14.5">
                  {group.lanes.length === 1 ? (
                    <div
                      className={`flex h-full items-center justify-center border-y-2 border-main px-m text-center text-Pbutton text-font-main ${
                        groupIndex % 2 === 0 ? "bg-base-dark" : "bg-timetable-dark"
                      }`}
                    >
                      {selectedLane.name}
                    </div>
                  ) : (
                    <DesktopLaneSelect
                      groupName={group.name}
                      lanes={group.lanes}
                      onLaneChange={(laneId) => onLaneChange(group.id, laneId)}
                      selectedLane={selectedLane}
                    />
                  )}
                </div>
                <div className="relative" style={{ height: `${gridHeight}px` }}>
                  {model.ticks.map((tick) => (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute right-0 left-0 h-px bg-secondary/50"
                      key={`${group.id}-${tick.label}-${tick.offsetSlots}`}
                      style={{ top: `${tick.offsetSlots * SLOT_HEIGHT_PX}px` }}
                    />
                  ))}
                  {model.items.map((item) => (
                    <div
                      className="absolute inset-x-2 z-10"
                      key={item.id}
                      style={{
                        height: `${item.displayRowSpan * SLOT_HEIGHT_PX}px`,
                        top: `${(item.startRow - 1) * SLOT_HEIGHT_PX}px`,
                      }}
                    >
                      <ScheduleCard
                        endTime={item.endTime}
                        href={item.href}
                        isHighlighted={item.id === currentItemId}
                        startTime={item.startTime}
                        title={item.title}
                        variant={groupIndex % 2 === 0 ? "desktop-even" : "desktop-odd"}
                      />
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
