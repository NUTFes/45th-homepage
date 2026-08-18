"use client";

import { type CSSProperties, useRef, useState } from "react";

import type { TimetableModel } from "../model";
import type { ScheduleGroupDTO, ScheduleLaneDTO } from "../types";
import DesktopLaneSelect from "./DesktopLaneSelect";
import TimetableCard from "./TimetableCard";
import TimetableTabs from "./TimetableTabs";

const SLOT_HEIGHT_PX = 38;
const LANE_HEADER_HEIGHT_PX = 58;
const LANE_WIDTH_PX = 279;
const TIME_GUTTER_WIDTH_PX = 72;

export type DesktopGroupModel = {
  group: ScheduleGroupDTO;
  selectedLane: ScheduleLaneDTO;
  model: TimetableModel;
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
  const gridHeight = referenceModel.slotCount * SLOT_HEIGHT_PX;
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
    scrollContainer.scrollTo({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      left: groupColumn.offsetLeft - TIME_GUTTER_WIDTH_PX,
    });
  };

  return (
    <div className="hidden md:block">
      <TimetableTabs
        ariaLabel="会場グループ"
        controlName="schedule-desktop-group"
        items={groupModels.map(({ group }) => group)}
        onChange={handleGroupNavigation}
        selectedItemId={selectedGroupId}
      />
      <section
        aria-label="会場グループ別タイムスケジュール"
        className="border-b-2 border-main bg-base/60 px-pm pt-4l pb-4l"
      >
        <div className="mx-auto max-w-260">
          {groupModels.every(({ model }) => model.items.length === 0) ? (
            <p className="mb-l border border-main bg-base-dark px-l py-s text-center text-Ptext text-font-main">
              この日付・天候で開催する企画はありません
            </p>
          ) : null}

          <div
            className="[scrollbar-color:var(--color-main)_var(--color-base-dark)] overflow-x-auto"
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

              {groupModels.map(({ group, selectedLane, model }, groupIndex) => (
                <article
                  aria-label={`${group.name}・${selectedLane.name}の予定`}
                  className={`border-r-2 border-secondary/50 ${
                    groupIndex % 2 === 0 ? "bg-base-dark/40" : "bg-[#14185b]/60"
                  }`}
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
                      <div className="flex h-full items-center justify-center border-y-2 border-main bg-base-dark px-m text-center text-Pbutton text-font-main">
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
        </div>
      </section>
    </div>
  );
}
