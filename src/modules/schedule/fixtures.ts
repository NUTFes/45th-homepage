import type { SchedulePreviewDTO, SchedulePreviewGroup, SchedulePreviewLane } from "./types";

const outdoorStage: SchedulePreviewLane = {
  id: "outdoor-stage",
  groupId: "outdoor",
  name: "メインステージ",
  shortName: "メイン",
  sortOrder: 10,
};

const lectureLaneA: SchedulePreviewLane = {
  id: "lecture-a",
  groupId: "lecture",
  name: "講義棟 A会場",
  shortName: "A会場",
  sortOrder: 10,
};

const lectureLaneB: SchedulePreviewLane = {
  id: "lecture-b",
  groupId: "lecture",
  name: "講義棟 B会場",
  shortName: "B会場",
  sortOrder: 20,
};

const groups: SchedulePreviewGroup[] = [
  {
    id: "outdoor",
    name: "屋外",
    shortName: "屋外",
    sortOrder: 10,
    lanes: [outdoorStage],
  },
  {
    id: "lecture",
    name: "講義棟",
    shortName: "講義棟",
    sortOrder: 20,
    lanes: [lectureLaneA, lectureLaneB],
  },
  {
    id: "martial-arts-hall",
    name: "武道場",
    shortName: "武道場",
    sortOrder: 30,
    lanes: [],
  },
];

export const schedulePreviewFixture: SchedulePreviewDTO = {
  range: {
    startTime: "10:00",
    endTime: "20:30",
    slotMinutes: 15,
  },
  groups,
  items: [
    {
      id: "opening",
      programId: "101",
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
      programId: "102",
      title: "悠久太鼓愛好会 つるかめ会",
      href: "/event/programs/102",
      weather: "both",
      day: "day1",
      startTime: "10:30",
      endTime: "11:00",
      laneId: outdoorStage.id,
    },
    {
      id: "long-title",
      programId: "103",
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
      programId: "104",
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
      programId: "105",
      title: "講義棟企画",
      href: "/event/programs/105",
      weather: "both",
      day: "day1",
      startTime: "12:15",
      endTime: "14:00",
      laneId: lectureLaneB.id,
    },
  ],
};

export const emptySchedulePreviewFixture: SchedulePreviewDTO = {
  ...schedulePreviewFixture,
  groups: [],
  items: [],
};
