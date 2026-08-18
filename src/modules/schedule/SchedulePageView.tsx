"use client";

import { useEffect, useMemo, useState } from "react";

import { buildTimetableModel, getScheduleSpotlight } from "./model";
import type { SchedulePreviewDTO } from "./types";
import MobileTimetable from "./ui/MobileTimetable";
import ScheduleSpotlight from "./ui/ScheduleSpotlight";
import TimetableLaneFilters from "./ui/TimetableLaneFilters";

export default function SchedulePageView({ data }: { data: SchedulePreviewDTO }) {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(data.groups[0]?.id ?? null);
  const [selectedLaneId, setSelectedLaneId] = useState<string | null>(
    data.groups[0]?.lanes[0]?.id ?? null,
  );
  const [now, setNow] = useState<Date | null>(null);

  const selectedGroup = data.groups.find((group) => group.id === selectedGroupId) ?? data.groups[0];
  const selectedLane =
    selectedGroup?.lanes.find((lane) => lane.id === selectedLaneId) ?? selectedGroup?.lanes[0];

  useEffect(() => {
    const updateNow = () => setNow(new Date());
    updateNow();
    const intervalId = window.setInterval(updateNow, 60_000);
    return () => window.clearInterval(intervalId);
  }, []);

  const model = useMemo(
    () => buildTimetableModel(data, selectedLane?.id ?? null),
    [data, selectedLane],
  );
  const spotlight = getScheduleSpotlight(model.items, now);

  const handleGroupChange = (groupId: string) => {
    const group = data.groups.find((item) => item.id === groupId);
    setSelectedGroupId(groupId);
    setSelectedLaneId(group?.lanes[0]?.id ?? null);
  };

  return (
    <div className="min-h-screen bg-base">
      <div className="mx-auto w-full max-w-107.5 bg-base shadow-[0_0_12px_var(--color-base-shadow)]">
        <h1 className="sr-only">タイムスケジュール開発プレビュー</h1>
        <div className="sticky top-0 z-90">
          <TimetableLaneFilters
            selectedLane={selectedLane}
            selectedGroup={selectedGroup}
            groups={data.groups}
            onLaneChange={setSelectedLaneId}
            onGroupChange={handleGroupChange}
          />
          {selectedLane ? <ScheduleSpotlight spotlight={spotlight} /> : null}
        </div>
        <MobileTimetable
          highlightedItemId={
            spotlight.kind === "current" || spotlight.kind === "next"
              ? spotlight.item.id
              : undefined
          }
          model={model}
          laneName={selectedLane?.name}
        />
      </div>
    </div>
  );
}
