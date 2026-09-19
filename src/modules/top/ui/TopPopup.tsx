"use client";

import Popup from "./Popup";
import { usePopupSchedule } from "../popup/usePopupSchedule";

export const SURVEY_HREF =
  "https://docs.google.com/forms/d/e/1FAIpQLScXB5tbBReZojJ2p26l6Ez3N78DvJPvzJro4bxD4U9h1ParCQ/viewform?entry.325868329=0&entry.1718143624=0&entry.225004756=0&entry.1276293162=0&entry.1434210546=0";

// TopHeroAnime のタイトルアニメーション(duration-[3000ms])が終わって
// 1秒後に表示する。アニメーションの長さを変える場合はここも合わせて直す。
const HERO_ANIMATION_DURATION_MS = 3000;
const SHOW_DELAY_AFTER_HERO_ANIMATION_MS = HERO_ANIMATION_DURATION_MS + 1000;

export default function TopPopup() {
  const { isOpen, close } = usePopupSchedule({
    showDelayMs: SHOW_DELAY_AFTER_HERO_ANIMATION_MS,
  });

  return (
    <Popup
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) close();
      }}
      surveyHref={SURVEY_HREF}
    />
  );
}
