import type {
  FestivalDay,
  ProgramArea,
  ProgramCategory,
  ProgramScheduleWeather,
  Weather,
} from "@/lib/events/constants";
import type { Media, Program, ProgramTag } from "@/payload-types";

export type EventMediaDTO = {
  id: Media["id"];
  url: string;
  alt: string;
  width?: number;
  height?: number;
};

export type EventProgramTagDTO = {
  id: ProgramTag["id"];
  name: ProgramTag["name"];
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
  visibleTags: EventProgramTagDTO[];
  weather: Weather;
};
