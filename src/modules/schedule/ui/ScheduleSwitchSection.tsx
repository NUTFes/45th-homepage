import { useId } from "react";

import { WEATHER_OPTIONS, type FestivalDay, type Weather } from "@/lib/events/constants";

import type { ScheduleDayDTO } from "../types";

export type ScheduleSwitchSectionProps = {
  currentWeather: Weather;
  days: readonly ScheduleDayDTO[];
  selectedDay: FestivalDay;
  selectedWeather: Weather;
  onDayChange: (day: FestivalDay) => void;
  onWeatherChange: (weather: Weather) => void;
};

type DayOptionsProps = Pick<ScheduleSwitchSectionProps, "days" | "selectedDay" | "onDayChange"> & {
  controlId: string;
  desktop?: boolean;
};

function DayOptions({ controlId, days, selectedDay, onDayChange, desktop }: DayOptionsProps) {
  return (
    <fieldset className={desktop ? "w-75 min-[2048px]:w-80" : "w-full px-s py-ss"}>
      <legend className="sr-only">開催日</legend>
      <div className="flex h-10 divide-x-2 divide-secondary min-[2048px]:h-12">
        {days.map((day) => (
          <label key={day.value} className="flex flex-1 cursor-pointer justify-center px-s">
            <input
              checked={selectedDay === day.value}
              className="peer sr-only"
              name={`${controlId}-${desktop ? "desktop" : "mobile"}-day`}
              onChange={() => onDayChange(day.value)}
              type="radio"
              value={day.value}
            />
            <span className="flex w-full items-center justify-center border-b-2 border-transparent text-title-small text-font-main transition-colors peer-checked:border-main peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-main min-[2048px]:text-Ptitle-small md:max-[2047px]:text-Ptext-large">
              {day.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function ScheduleSwitchSection({
  currentWeather,
  days,
  selectedDay,
  selectedWeather,
  onDayChange,
  onWeatherChange,
}: ScheduleSwitchSectionProps) {
  const controlId = useId();
  const currentWeatherLabel =
    WEATHER_OPTIONS.find(({ value }) => value === currentWeather)?.label ?? currentWeather;

  return (
    <div className="bg-base">
      <div className="border-y-2 border-main bg-timetable-base-dark px-3l py-l text-font-main min-[2048px]:py-4l md:px-pm md:max-[2047px]:py-3l">
        <div className="flex max-w-260 flex-col items-center gap-xs min-[2048px]:gap-m md:items-start md:max-[2047px]:gap-s">
          <p className="text-center text-title-small font-bold min-[2048px]:text-title md:max-[2047px]:text-Ptitle-small">
            現在は
            <span className="text-accent">{currentWeatherLabel}</span>
            スケジュールです
          </p>
          <p className="text-center text-text-small md:hidden">天気を選択してください。</p>
          <div className="flex items-center gap-3l min-[2048px]:gap-4l">
            <div className="hidden md:block">
              <DayOptions
                controlId={controlId}
                days={days}
                desktop
                onDayChange={onDayChange}
                selectedDay={selectedDay}
              />
            </div>
            <fieldset className="flex justify-center gap-s min-[2048px]:gap-l">
              <legend className="sr-only">天気</legend>
              {WEATHER_OPTIONS.map((option) => (
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
                    className={`flex h-9 min-w-21 items-center justify-center rounded-full border-2 border-main px-xs text-button text-font-main transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-main min-[2048px]:h-12 min-[2048px]:w-25 min-[2048px]:px-m min-[2048px]:text-Ptitle-small md:max-[2047px]:h-10.5 md:max-[2047px]:text-Pbutton ${
                      selectedWeather === option.value ? "button-gradient" : "bg-transparent"
                    }`}
                  >
                    {option.label}
                  </span>
                </label>
              ))}
            </fieldset>
          </div>
        </div>
      </div>

      <div className="mt-ss md:hidden">
        <DayOptions
          controlId={controlId}
          days={days}
          onDayChange={onDayChange}
          selectedDay={selectedDay}
        />
      </div>
    </div>
  );
}
