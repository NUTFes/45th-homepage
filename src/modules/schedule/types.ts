import type { FestivalDay, ProgramScheduleWeather, Weather } from "@/lib/events/constants";

export type ScheduleDayDTO = {
  value: FestivalDay;
  label: string;
  date: string;
};

export type ScheduleGroupDTO = {
  id: string;
  name: string;
  sortOrder: number;
  lanes: ScheduleLaneDTO[];
};

export type ScheduleLaneDTO = {
  id: string;
  groupId: string;
  name: string;
  sortOrder: number;
};

export type ScheduleItemDTO = {
  id: string;
  programId: string;
  title: string;
  href: string;
  weather: ProgramScheduleWeather;
  day: FestivalDay;
  startTime: string;
  endTime: string;
  laneId: string;
};

/** Payloadの生成型をUIへ直接渡さないためのタイムスケジュール表示契約。 */
export type SchedulePageDTO = {
  days: ScheduleDayDTO[];
  range: {
    startTime: string;
    endTime: string;
    slotMinutes: number;
  };
  groups: ScheduleGroupDTO[];
  items: ScheduleItemDTO[];
  weather: Weather;
};
