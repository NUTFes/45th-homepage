"use client";

import { useState } from "react";
import { Menu as MenuIcon, X } from "lucide-react";
import dynamic from "next/dynamic";

const MenuContext = dynamic(() => import("@/components/layout/Menu"), {
  loading: () => null,
  ssr: false,
});

export default function BottomNavMenuButton() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsMenuOpen((prev) => !prev)}
        aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
        aria-expanded={isMenuOpen}
        aria-controls="bottom-nav-drawer"
        className="flex h-14.25 w-full flex-col items-center justify-center gap-1"
      >
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center">
          <MenuIcon
            size={30}
            className={`absolute shrink-0 text-secondary transition-opacity duration-300 ${
              isMenuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <X
            size={28}
            className={`absolute shrink-0 text-secondary transition-opacity duration-300 ${
              isMenuOpen ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
        <span className="text-text-small whitespace-nowrap text-secondary">メニュー</span>
      </button>

      <div
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
        className={`fixed top-0 right-0 bottom-18.25 left-0 z-300 bg-base/40 transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        id="bottom-nav-drawer"
        role="dialog"
        aria-modal="false"
        aria-label="メインメニュー"
        aria-hidden={!isMenuOpen}
        className={`fixed right-0 bottom-18.25 left-0 z-350 h-[71svh] overflow-y-auto overscroll-contain bg-base-dark transition-transform duration-300 ${
          isMenuOpen ? "translate-y-0" : "pointer-events-none translate-y-full"
        }`}
      >
        {isMenuOpen ? <MenuContext /> : null}
      </div>
    </>
  );
}
