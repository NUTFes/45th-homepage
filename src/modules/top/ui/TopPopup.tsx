"use client";

import Popup from "./Popup";
import { usePopupSchedule } from "../popup/usePopupSchedule";
import { HERO_TITLE_ANIMATION_MS } from "../heroAnimation";

export const SURVEY_HREF =
  "https://docs.google.com/forms/d/e/1FAIpQLScXB5tbBReZojJ2p26l6Ez3N78DvJPvzJro4bxD4U9h1ParCQ/viewform?entry.325868329=0&entry.1718143624=0&entry.225004756=0&entry.1276293162=0&entry.1434210546=0";

// タイマーの起点はマウント(≒ハイドレーション完了後)で、アニメーションの起点は
// ペイント時点なので、この待ち時間は必ずアニメーション終了以降になる
// (早まることはなく、遅れる方向にしかズレない)。
const SHOW_DELAY_AFTER_HERO_ANIMATION_MS = HERO_TITLE_ANIMATION_MS + 1000;

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
