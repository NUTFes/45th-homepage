"use client";

import { useEffect, useRef, useState } from "react";
import { LucideMenu, X } from "lucide-react";
import dynamic from "next/dynamic";

const Menu = dynamic(() => import("@/components/layout/Menu"), {
  loading: () => null,
  ssr: false,
});

export default function HeaderMenuButton() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuKey, setMenuKey] = useState(0);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isMenuOpen && drawerRef.current) {
      drawerRef.current.scrollTop = 0;
    }
  }, [isMenuOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() =>
          setIsMenuOpen((prev) => {
            if (!prev) setMenuKey((key) => key + 1);
            return !prev;
          })
        }
        aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
        aria-expanded={isMenuOpen}
        aria-controls="header-drawer"
        className="hidden h-9 w-9 shrink-0 items-center justify-center md:flex"
      >
        <div className="relative flex h-9 w-9 items-center justify-center">
          <LucideMenu
            size={36}
            className={`absolute shrink-0 text-base transition-opacity duration-300 ${
              isMenuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <X
            size={36}
            className={`absolute shrink-0 text-base transition-opacity duration-300 ${
              isMenuOpen ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </button>

      <div
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
        className={`fixed top-22 right-0 bottom-0 left-0 z-300 hidden bg-base/40 ease-out motion-safe:transition-opacity motion-safe:duration-300 md:block ${
          isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0 ease-in"
        }`}
      />
      <div
        ref={drawerRef}
        id="header-drawer"
        role="dialog"
        aria-modal="false"
        aria-label="メインメニュー"
        aria-hidden={!isMenuOpen}
        style={{ overscrollBehavior: "contain" }}
        className={`fixed top-22 right-0 z-350 hidden h-[calc(100dvh-88px)] overflow-y-scroll bg-base-dark ease-out motion-safe:transition-transform motion-safe:duration-300 md:block ${
          isMenuOpen ? "translate-x-0" : "pointer-events-none translate-x-full ease-in"
        }`}
      >
        {isMenuOpen ? <Menu key={menuKey} /> : null}
      </div>
    </>
  );
}
