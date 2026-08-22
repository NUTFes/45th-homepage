import { TIMETABLE_DISPLAY_END_TIME } from "@/lib/events/constants";

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
    id: "outdoor",
    name: "屋外",
    sortOrder: 10,
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
    slotMinutes: 15,
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
