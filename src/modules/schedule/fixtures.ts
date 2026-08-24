import { TIMETABLE_DISPLAY_END_TIME, TIMETABLE_GRID_SLOT_MINUTES } from "@/lib/events/constants";

import type { ScheduleGroupDTO, ScheduleLaneDTO, TimetablePageDTO } from "./types";

const outdoorStage: ScheduleLaneDTO = {
  id: "outdoor-stage",
  name: "メインステージ",
  sortOrder: 10,
};

const lectureLaneA: ScheduleLaneDTO = {
  id: "lecture-a",
  name: "講義棟 A会場",
  sortOrder: 10,
};

const lectureLaneB: ScheduleLaneDTO = {
  id: "lecture-b",
  name: "講義棟 B会場",
  sortOrder: 20,
};

const groups: ScheduleGroupDTO[] = [
  {
    id: `ungrouped-lane:${outdoorStage.id}`,
    name: outdoorStage.name,
    sortOrder: outdoorStage.sortOrder,
    lanes: [outdoorStage],
  },
  {
    id: "lecture",
    name: "講義棟",
    sortOrder: 20,
    lanes: [lectureLaneA, lectureLaneB],
  },
  {
    id: "martial-arts-hall",
    name: "武道場",
    sortOrder: 30,
    lanes: [],
  },
];

export const schedulePreviewFixture: TimetablePageDTO = {
  days: [
    { value: "day1", label: "19日（土）", date: "2026-09-19" },
    { value: "day2", label: "20日（日）", date: "2026-09-20" },
  ],
  range: {
    startTime: "10:00",
    endTime: TIMETABLE_DISPLAY_END_TIME,
    slotMinutes: TIMETABLE_GRID_SLOT_MINUTES,
  },
  groups,
  items: [
    {
      id: "opening",
      title: "開会式・オープニング企画",
      href: "/event/programs/101",
      weather: "both",
      day: "day1",
      startTime: "10:00",
      endTime: "10:30",
      laneId: outdoorStage.id,
    },
    {
      id: "drums",
      title: "悠久太鼓愛好会 つるかめ会",
      href: "/event/programs/102",
      weather: "sunny",
      day: "day1",
      startTime: "10:30",
      endTime: "11:00",
      laneId: outdoorStage.id,
    },
    {
      id: "rainy-stage",
      title: "雨天時ステージ企画",
      href: "/event/programs/106",
      weather: "rainy",
      day: "day1",
      startTime: "10:30",
      endTime: "11:30",
      laneId: outdoorStage.id,
    },
    {
      id: "long-title",
      title: "長い企画名でも最小カードの配置が崩れないことを確認する企画",
      href: "/event/programs/103",
      weather: "both",
      day: "day1",
      startTime: "11:00",
      endTime: "13:00",
      laneId: outdoorStage.id,
    },
    {
      id: "closing",
      title: "一日目クロージング",
      href: "/event/programs/104",
      weather: "both",
      day: "day1",
      startTime: "20:15",
      endTime: "20:30",
      laneId: outdoorStage.id,
    },
    {
      id: "arbitrary-minute-45",
      title: "任意分刻み 45分企画",
      href: "/event/programs/109",
      weather: "both",
      day: "day1",
      startTime: "10:07",
      endTime: "10:52",
      laneId: lectureLaneA.id,
    },
    {
      id: "arbitrary-minute-11",
      title: "任意分刻み 11分企画",
      href: "/event/programs/110",
      weather: "both",
      day: "day1",
      startTime: "10:52",
      endTime: "11:03",
      laneId: lectureLaneA.id,
    },
    {
      id: "lecture-program",
      title: "講義棟企画",
      href: "/event/programs/105",
      weather: "both",
      day: "day1",
      startTime: "12:15",
      endTime: "14:00",
      laneId: lectureLaneB.id,
    },
    {
      id: "day-two-stage",
      title: "二日目ステージ企画",
      href: "/event/programs/107",
      weather: "both",
      day: "day2",
      startTime: "12:15",
      endTime: "14:00",
      laneId: outdoorStage.id,
    },
    {
      id: "day-two-lecture",
      title: "二日目の講義棟企画",
      href: "/event/programs/108",
      weather: "both",
      day: "day2",
      startTime: "14:00",
      endTime: "15:00",
      laneId: lectureLaneB.id,
    },
  ],
  weather: "sunny",
};

export const emptySchedulePreviewFixture: TimetablePageDTO = {
  ...schedulePreviewFixture,
  groups: [],
  items: [],
};
