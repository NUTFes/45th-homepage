"use client";

import Popup from "./Popup";
import { usePopupSchedule } from "../popup/usePopupSchedule";

export const SURVEY_HREF =
  "https://docs.google.com/forms/d/e/1FAIpQLScXB5tbBReZojJ2p26l6Ez3N78DvJPvzJro4bxD4U9h1ParCQ/viewform?entry.325868329=0&entry.1718143624=0&entry.225004756=0&entry.1276293162=0&entry.1434210546=0";

export default function TopPopup() {
  const { isOpen, close } = usePopupSchedule();

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
