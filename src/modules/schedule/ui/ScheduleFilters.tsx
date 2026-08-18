import { useId } from "react";

import type { FestivalDay, Weather } from "@/lib/events/constants";

import type { SchedulePreviewDay } from "../types";

type ScheduleFiltersProps = {
  days: readonly SchedulePreviewDay[];
  selectedDay: FestivalDay;
  selectedWeather: Weather;
  onDayChange: (day: FestivalDay) => void;
  onWeatherChange: (weather: Weather) => void;
};

const weatherOptions = [
  { value: "sunny", label: "晴れ" },
  { value: "rainy", label: "雨" },
] as const satisfies readonly { value: Weather; label: string }[];

export default function ScheduleFilters({
  days,
  selectedDay,
  selectedWeather,
  onDayChange,
  onWeatherChange,
}: ScheduleFiltersProps) {
  const controlId = useId();

  return (
    <div className="bg-base">
      <div className="flex flex-col gap-xs border-y-2 border-main bg-base-dark px-3l py-l text-font-main">
        <p className="text-center text-textb">
          現在は<span className="text-accent">{selectedWeather === "sunny" ? "晴れ" : "雨"}</span>
          スケジュールです
        </p>
        <p className="text-center text-text-small">天気を選択してください。</p>
        <fieldset className="flex justify-center gap-s">
          <legend className="sr-only">天気</legend>
          {weatherOptions.map((option) => (
            <label key={option.value} className="cursor-pointer">
              <input
                checked={selectedWeather === option.value}
                className="peer sr-only"
                name={`${controlId}-weather`}
                onChange={() => onWeatherChange(option.value)}
                type="radio"
                value={option.value}
              />
              <span
                className={`flex h-9 min-w-21 items-center justify-center rounded-full border-2 border-main px-xs text-button transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-main ${
                  selectedWeather === option.value
                    ? "bg-secondary text-base-dark"
                    : "text-font-main"
                }`}
              >
                {option.label}
              </span>
            </label>
          ))}
        </fieldset>
      </div>

      <fieldset className="grid grid-cols-2 gap-s px-s py-ss">
        <legend className="sr-only">開催日</legend>
        {days.map((day) => (
          <label key={day.value} className="cursor-pointer">
            <input
              checked={selectedDay === day.value}
              className="peer sr-only"
              name={`${controlId}-day`}
              onChange={() => onDayChange(day.value)}
              type="radio"
              value={day.value}
            />
            <span className="flex h-10 items-center justify-center border-b-2 border-transparent text-title-small text-font-main transition-colors peer-checked:border-main peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-main">
              {day.label}
            </span>
          </label>
        ))}
      </fieldset>
    </div>
  );
}
