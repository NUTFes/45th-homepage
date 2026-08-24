"use client";

import { useEffect, useMemo, useState } from "react";

import type { FestivalDay, Weather } from "@/lib/events/constants";

import { buildTimetableModel, filterScheduleItemsForDisplay, getScheduleSpotlight } from "./model";
import type { TimetablePageDTO } from "./types";
import DesktopTimetable, { type DesktopGroupModel } from "./ui/DesktopTimetable";
import MobileTimetable, { type MobileLaneModel } from "./ui/MobileTimetable";
import ScheduleSwitchSection from "./ui/ScheduleSwitchSection";
import ScheduleSpotlight from "./ui/ScheduleSpotlight";
import TimetableLaneFilters from "./ui/TimetableLaneFilters";

export default function SchedulePageView({ data }: { data: TimetablePageDTO }) {
  const [selectedDay, setSelectedDay] = useState<FestivalDay>(data.days[0]?.value ?? "day1");
  const [selectedWeather, setSelectedWeather] = useState<Weather>(data.weather);
  const visibleGroups = useMemo(
    () =>
      [...data.groups]
        .filter((group) => group.lanes.length > 0)
        .sort((left, right) => left.sortOrder - right.sortOrder)
        .map((group) => ({
          ...group,
          lanes: [...group.lanes].sort((left, right) => left.sortOrder - right.sortOrder),
        })),
    [data.groups],
  );
  const lanes = useMemo(() => visibleGroups.flatMap((group) => group.lanes), [visibleGroups]);
  const [selectedMobileLaneId, setSelectedMobileLaneId] = useState<string | null>(
    lanes[0]?.id ?? null,
  );
  const [selectedDesktopLaneIds, setSelectedDesktopLaneIds] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      visibleGroups.flatMap((group) =>
        group.lanes[0] ? [[group.id, group.lanes[0].id] as const] : [],
      ),
    ),
  );
  const [now, setNow] = useState<Date | null>(null);

  const selectedMobileLane = lanes.find((lane) => lane.id === selectedMobileLaneId) ?? lanes[0];

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

  const laneModelById = useMemo(
    () =>
      new Map(
        lanes.map(
          (lane) =>
            [
              lane.id,
              buildTimetableModel(
                {
                  items: visibleItems,
                  range: data.range,
                },
                lane.id,
              ),
            ] as const,
        ),
      ),
    [data.range, lanes, visibleItems],
  );
  const mobileLaneModelsBase = useMemo(
    () =>
      lanes.flatMap((lane) => {
        const model = laneModelById.get(lane.id);
        return model ? [{ lane, model }] : [];
      }),
    [laneModelById, lanes],
  );
  const mobileLaneModels = useMemo<MobileLaneModel[]>(
    () =>
      mobileLaneModelsBase.map(({ lane, model }) => {
        const laneSpotlight = getScheduleSpotlight(model.items, now, selectedDay);
        return {
          lane,
          model,
          currentItemId:
            laneSpotlight.kind === "ready" ? (laneSpotlight.current?.id ?? undefined) : undefined,
        };
      }),
    [mobileLaneModelsBase, now, selectedDay],
  );
  const selectedMobileModel = selectedMobileLane
    ? (laneModelById.get(selectedMobileLane.id) ?? null)
    : null;
  const spotlight = getScheduleSpotlight(selectedMobileModel?.items ?? [], now, selectedDay);

  const desktopGroupModelsBase = useMemo(
    () =>
      visibleGroups.flatMap((group) => {
        const selectedLane =
          group.lanes.find((lane) => lane.id === selectedDesktopLaneIds[group.id]) ??
          group.lanes[0];
        if (!selectedLane) {
          return [];
        }

        const model = laneModelById.get(selectedLane.id);
        if (!model) {
          return [];
        }

        return [{ group, selectedLane, model }];
      }),
    [laneModelById, selectedDesktopLaneIds, visibleGroups],
  );
  const desktopGroupModels = useMemo<DesktopGroupModel[]>(
    () =>
      desktopGroupModelsBase.map(({ group, selectedLane, model }) => {
        const laneSpotlight = getScheduleSpotlight(model.items, now, selectedDay);
        return {
          group,
          selectedLane,
          model,
          currentItemId:
            laneSpotlight.kind === "ready" ? (laneSpotlight.current?.id ?? undefined) : undefined,
        };
      }),
    [desktopGroupModelsBase, now, selectedDay],
  );

  const handleDesktopLaneChange = (groupId: string, laneId: string) => {
    setSelectedDesktopLaneIds((current) => ({ ...current, [groupId]: laneId }));
  };

  return (
    <div className="min-h-screen bg-base">
      <h1 className="sr-only">タイムスケジュール</h1>
      <div className="mx-auto w-full bg-base md:max-w-none">
        <ScheduleSwitchSection
          currentWeather={data.weather}
          days={data.days}
          selectedDay={selectedDay}
          selectedWeather={selectedWeather}
          onDayChange={setSelectedDay}
          onWeatherChange={setSelectedWeather}
        />
        <div className="sticky top-[var(--header-height,72px)] z-90 md:hidden">
          <TimetableLaneFilters
            lanes={lanes}
            onLaneChange={setSelectedMobileLaneId}
            selectedLane={selectedMobileLane}
          />
          {selectedMobileLane ? <ScheduleSpotlight spotlight={spotlight} /> : null}
        </div>
        <DesktopTimetable groupModels={desktopGroupModels} onLaneChange={handleDesktopLaneChange} />
        <MobileTimetable
          laneModels={mobileLaneModels}
          onLaneChange={setSelectedMobileLaneId}
          selectedLaneId={selectedMobileLane?.id ?? null}
        />
      </div>
    </div>
  );
}
