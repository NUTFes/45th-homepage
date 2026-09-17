"use client";

import { useCallback, useEffect, useState } from "react";

import { shouldShow } from "./popupSchedule";
import { isStorageAvailable, readLastShownAt, writeLastShownAt } from "./storage";

export const usePopupSchedule = (): { isOpen: boolean; close: () => void } => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 記録を残せない環境では「記録なし」と区別が付かず毎回表示になってしまうため、
    // 利便性よりも表示しない方に倒す。
    if (!isStorageAvailable()) return;

    const now = new Date();
    const lastShownAt = readLastShownAt(now);

    if (shouldShow(now, lastShownAt)) {
      writeLastShownAt(now.getTime());
      setIsOpen(true);
    }
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return { isOpen, close };
};
