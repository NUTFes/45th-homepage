"use client";

import { Menu as MenuIcon, X } from "lucide-react";
import { twMerge } from "tailwind-merge";

type BottomNavMenuButtonProps = {
  drawerId: string;
  isMenuOpen: boolean;
  onToggle: () => void;
};

export default function BottomNavMenuButton(props: BottomNavMenuButtonProps) {
  const { drawerId, isMenuOpen, onToggle } = props;

  const itemClassName = twMerge(
    "group flex h-14.25 w-full flex-col items-center justify-center gap-1 text-center transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main",
    "text-secondary",
  );
  const iconWrapperClassName =
    "relative flex h-9 w-9 shrink-0 items-center justify-center transition-colors duration-200";
  const labelClassName = "max-w-full whitespace-nowrap text-text-small";

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-haspopup="dialog"
      aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
      aria-expanded={isMenuOpen}
      aria-controls={drawerId}
      className={itemClassName}
    >
      <span className={iconWrapperClassName} aria-hidden="true">
        <MenuIcon
          size={28}
          strokeWidth={2.2}
          className={twMerge(
            "absolute shrink-0 transition-all duration-200",
            isMenuOpen ? "scale-90 opacity-0" : "scale-100 opacity-100",
          )}
        />
        <X
          size={28}
          strokeWidth={2.2}
          className={twMerge(
            "absolute shrink-0 transition-all duration-200",
            isMenuOpen ? "scale-100 opacity-100" : "scale-90 opacity-0",
          )}
        />
      </span>
      <span className={labelClassName}>メニュー</span>
    </button>
  );
}
