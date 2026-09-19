"use client";

import { useCallback, useEffect, useState } from "react";

import { resolvePopupVisibility } from "./storage";

type UsePopupScheduleOptions = {
  // 判定・表示を遅らせる時間(ms)。ヒーローのアニメーションと重ならせたい場合等に使う。
  showDelayMs?: number;
};

export const usePopupSchedule = (
  options: UsePopupScheduleOptions = {},
): { isOpen: boolean; close: () => void } => {
  const { showDelayMs = 0 } = options;
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(resolvePopupVisibility(new Date()));
    }, showDelayMs);

    return () => clearTimeout(timer);
  }, [showDelayMs]);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return { isOpen, close };
};
