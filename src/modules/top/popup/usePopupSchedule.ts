"use client";

import { useCallback, useEffect, useState } from "react";

import { resolvePopupVisibility } from "./storage";

export const usePopupSchedule = (): { isOpen: boolean; close: () => void } => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(resolvePopupVisibility(new Date()));
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return { isOpen, close };
};
