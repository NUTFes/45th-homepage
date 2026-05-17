"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Menu as MenuIcon, X } from "lucide-react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const Menu = dynamic(() => import("@/components/layout/Menu"), {
  loading: () => null,
  ssr: false,
});

export default function HeaderMenuButton() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuKey, setMenuKey] = useState(0);
  const drawerId = useId();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    if (drawerRef.current) {
      drawerRef.current.scrollTop = 0;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => {
      if (!prev) {
        setMenuKey((key) => key + 1);
      }

      return !prev;
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={toggleMenu}
        aria-haspopup="dialog"
        aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
        aria-expanded={isMenuOpen}
        aria-controls={drawerId}
        className="flex size-11 shrink-0 items-center justify-center rounded-sm text-base-dark transition-colors duration-200 hover:text-base focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-main"
      >
        <span className="relative flex size-9 items-center justify-center" aria-hidden="true">
          <MenuIcon
            size={36}
            strokeWidth={2.2}
            className={`absolute shrink-0 transition-all duration-200 ${
              isMenuOpen ? "scale-90 opacity-0" : "scale-100 opacity-100"
            }`}
          />
          <X
            size={36}
            strokeWidth={2.2}
            className={`absolute shrink-0 transition-all duration-200 ${
              isMenuOpen ? "scale-100 opacity-100" : "scale-90 opacity-0"
            }`}
          />
        </span>
      </button>

      <div
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
        className={`fixed top-(--header-height) right-0 bottom-0 left-0 z-300 hidden bg-base/40 ease-out motion-safe:transition-opacity motion-safe:duration-300 md:block ${
          isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0 ease-in"
        }`}
      />
      <div
        ref={drawerRef}
        id={drawerId}
        role="dialog"
        aria-modal="false"
        aria-label="メインメニュー"
        aria-hidden={!isMenuOpen}
        className={`fixed top-(--header-height) right-0 z-350 hidden h-[calc(100dvh-var(--header-height))] w-full max-w-97.5 scrollbar-gutter-stable overflow-y-auto overscroll-contain bg-base-dark ease-out motion-safe:transition-transform motion-safe:duration-300 md:block ${
          isMenuOpen ? "translate-x-0" : "pointer-events-none translate-x-full ease-in"
        }`}
      >
        {isMenuOpen ? <Menu key={menuKey} /> : null}
      </div>
    </>
  );
}
