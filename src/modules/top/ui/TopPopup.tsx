"use client";

import Popup from "./Popup";
import { useHeroAnimation } from "./HeroAnimationContext";
import { usePopupSchedule } from "../popup/usePopupSchedule";

export const SURVEY_HREF =
  "https://docs.google.com/forms/d/e/1FAIpQLScXB5tbBReZojJ2p26l6Ez3N78DvJPvzJro4bxD4U9h1ParCQ/viewform?entry.325868329=0&entry.1718143624=0&entry.225004756=0&entry.1276293162=0&entry.1434210546=0";

// ヒーローのタイトルアニメーションが終わって(実際の animationend を検知)
// 1秒後に表示する。
const SHOW_DELAY_AFTER_HERO_ANIMATION_MS = 1000;

export default function TopPopup() {
  const { isHeroAnimationDone } = useHeroAnimation();
  const { isOpen, close } = usePopupSchedule({
    ready: isHeroAnimationDone,
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
