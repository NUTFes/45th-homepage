"use client";

import { useCallback, useEffect, useState } from "react";

import { shouldShow } from "./popupSchedule";
import { readLastShownAt, writeLastShownAt } from "./storage";

export const usePopupSchedule = (): { isOpen: boolean; close: () => void } => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const now = new Date();
    const lastShownAt = readLastShownAt(now);

    if (shouldShow(now, lastShownAt)) {
      writeLastShownAt(Date.now());
      setIsOpen(true);
    }
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return { isOpen, close };
};
