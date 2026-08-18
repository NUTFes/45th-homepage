"use client";

import { useEffect, useMemo, useState } from "react";

import type { FestivalDay, Weather } from "@/lib/events/constants";

import { buildTimetableModel, filterScheduleItemsForDisplay, getScheduleSpotlight } from "./model";
import type { SchedulePageDTO } from "./types";
import DesktopGroupSelect from "./ui/DesktopGroupSelect";
import DesktopTimetable, { type DesktopLaneModel } from "./ui/DesktopTimetable";
import MobileTimetable from "./ui/MobileTimetable";
import ScheduleFilters from "./ui/ScheduleFilters";
import ScheduleSpotlight from "./ui/ScheduleSpotlight";
import TimetableLaneFilters from "./ui/TimetableLaneFilters";

export default function SchedulePageView({ data }: { data: SchedulePageDTO }) {
  const [selectedDay, setSelectedDay] = useState<FestivalDay>(data.days[0]?.value ?? "day1");
  const [selectedWeather, setSelectedWeather] = useState<Weather>(data.weather);
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

  const visibleItems = useMemo(
    () =>
      filterScheduleItemsForDisplay(data.items, {
        day: selectedDay,
        weather: selectedWeather,
      }),
    [data.items, selectedDay, selectedWeather],
  );
  const model = useMemo(
    () =>
      buildTimetableModel(
        {
          items: visibleItems,
          range: data.range,
        },
        selectedLane?.id ?? null,
      ),
    [data.range, selectedLane, visibleItems],
  );
  const desktopLaneModels = useMemo<DesktopLaneModel[]>(
    () =>
      (selectedGroup?.lanes ?? []).map((lane) => ({
        lane,
        model: buildTimetableModel(
          {
            items: visibleItems,
            range: data.range,
          },
          lane.id,
        ),
      })),
    [data.range, selectedGroup, visibleItems],
  );
  const spotlight = getScheduleSpotlight(model.items, now);

  const handleGroupChange = (groupId: string) => {
    const group = data.groups.find((item) => item.id === groupId);
    setSelectedGroupId(groupId);
    setSelectedLaneId(group?.lanes[0]?.id ?? null);
  };

  return (
    <div className="min-h-screen bg-base">
      <h1 className="sr-only">タイムスケジュール</h1>
      <div className="mx-auto w-full bg-base md:max-w-none">
        <ScheduleFilters
          days={data.days}
          selectedDay={selectedDay}
          selectedWeather={selectedWeather}
          onDayChange={setSelectedDay}
          onWeatherChange={setSelectedWeather}
        />
        <div className="sticky top-0 z-90 md:hidden">
          <TimetableLaneFilters
            selectedLane={selectedLane}
            selectedGroup={selectedGroup}
            groups={data.groups}
            onLaneChange={setSelectedLaneId}
            onGroupChange={handleGroupChange}
          />
          {selectedLane ? <ScheduleSpotlight spotlight={spotlight} /> : null}
        </div>
        <div className="hidden px-pm pt-4l md:block">
          <div className="mx-auto max-w-260">
            <DesktopGroupSelect
              groups={data.groups}
              onGroupChange={handleGroupChange}
              selectedGroup={selectedGroup}
            />
          </div>
        </div>
        <DesktopTimetable groupName={selectedGroup?.name} laneModels={desktopLaneModels} />
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
