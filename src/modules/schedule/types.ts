import type { FestivalDay, ProgramScheduleWeather, Weather } from "@/lib/events/constants";

export type SchedulePreviewDay = {
  value: FestivalDay;
  label: string;
  date: string;
};

export type SchedulePreviewGroup = {
  id: string;
  name: string;
  shortName?: string;
  sortOrder: number;
  lanes: SchedulePreviewLane[];
};

export type SchedulePreviewLane = {
  id: string;
  groupId: string;
  name: string;
  shortName?: string;
  sortOrder: number;
};

export type SchedulePreviewItem = {
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

/**
 * 開発用タイスケ表示の入力契約。
 * Payloadの生成型や取得処理から独立させ、公開時は別のadapterで変換する。
 */
export type SchedulePreviewDTO = {
  days: SchedulePreviewDay[];
  range: {
    startTime: string;
    endTime: string;
    slotMinutes: number;
  };
  groups: SchedulePreviewGroup[];
  items: SchedulePreviewItem[];
  weather: Weather;
};
