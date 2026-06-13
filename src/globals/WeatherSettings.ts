import type { GlobalConfig } from "payload";

import { WEATHER_OPTIONS, toPayloadSelectOptions } from "@/lib/events/constants";

import { revalidateWeatherSettingsAfterChange } from "./hooks/revalidateWeatherSettings";

export const WeatherSettings: GlobalConfig = {
  slug: "weather-settings",
  label: {
    ja: "天候設定",
    en: "Weather Settings",
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    group: {
      ja: "サイト設定",
      en: "Site Settings",
    },
    description: {
      ja: "企画ページに適用する天候を選択します。",
      en: "Select the weather applied to event pages.",
    },
  },
  hooks: {
    afterChange: [revalidateWeatherSettingsAfterChange],
  },
  fields: [
    {
      name: "weather",
      label: {
        ja: "天候",
        en: "Weather",
      },
      type: "radio",
      required: true,
      defaultValue: "sunny",
      options: toPayloadSelectOptions(WEATHER_OPTIONS),
      admin: {
        layout: "horizontal",
        description: {
          ja: "選択した天候に対応する開催時間を企画ページに表示します。",
          en: "Event pages display schedule times for the selected weather.",
        },
      },
    },
  ],
};
