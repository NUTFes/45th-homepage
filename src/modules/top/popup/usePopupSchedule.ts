"use client";

import { useCallback, useEffect, useState } from "react";

import { resolvePopupVisibility } from "./storage";

type UsePopupScheduleOptions = {
  // false の間は判定・表示を一切行わない。ヒーローのアニメーションが終わって
  // いない等、まだ表示すべきでないタイミングを表す。
  ready?: boolean;
  // ready になった時点からさらに判定・表示を遅らせる時間(ms)
  showDelayMs?: number;
};

export const usePopupSchedule = (
  options: UsePopupScheduleOptions = {},
): { isOpen: boolean; close: () => void } => {
  const { ready = true, showDelayMs = 0 } = options;
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!ready) return;

    const timer = setTimeout(() => {
      setIsOpen(resolvePopupVisibility(new Date()));
    }, showDelayMs);

    return () => clearTimeout(timer);
  }, [ready, showDelayMs]);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return { isOpen, close };
};
