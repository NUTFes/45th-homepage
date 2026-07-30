import type {
  FestivalDay,
  ProgramArea,
  ProgramCategory,
  ProgramScheduleWeather,
  ProgramTagValue,
  Weather,
} from "@/lib/events/constants";
import type { Media, Program } from "@/payload-types";

export type EventMediaDTO = {
  id: Media["id"];
  url: string;
  alt: string;
  width?: number;
  height?: number;
};

export type EventProgramTagDTO = {
  value: ProgramTagValue;
  label: string;
};

export type EventScheduleItemDTO = {
  weather: ProgramScheduleWeather;
  day: FestivalDay;
  startTime: string;
  endTime: string;
};

export type EventProgramDTO = {
  id: Program["id"];
  title: Program["title"];
  category: ProgramCategory;
  area: ProgramArea;
  locationName: Program["locationName"];
  image?: EventMediaDTO;
  mapImage?: EventMediaDTO;
  tags: EventProgramTagDTO[];
  catchphrase?: string;
  description: Program["description"];
  scheduleItems: EventScheduleItemDTO[];
};

export type EventsPageCategoryDTO = {
  category: ProgramCategory;
  label: string;
  programs: EventProgramDTO[];
};

export type EventsPageDTO = {
  categories: EventsPageCategoryDTO[];
  weather: Weather;
};

export type GuestPageDTO = {
  ticketDistributionStatusText: string;
};

export type SchedulePageDTO = {
  programs: EventProgramDTO[];
  weather: Weather;
};
