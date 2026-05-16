"use client";

import { useEffect, useId, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import BottomNavMenuButton from "@/components/layout/BottomNavMenuButton";

const Menu = dynamic(() => import("@/components/layout/Menu"), {
  loading: () => null,
  ssr: false,
});

export default function BottomNavMenuDrawer() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuKey, setMenuKey] = useState(0);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const drawerId = useId();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPortalContainer(document.body);
  }, []);

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
        setMenuKey((current) => current + 1);
      }

      return !prev;
    });
  };

  return (
    <>
      <BottomNavMenuButton drawerId={drawerId} isMenuOpen={isMenuOpen} onToggle={toggleMenu} />

      {portalContainer
        ? createPortal(
            <>
              <div
                onClick={() => setIsMenuOpen(false)}
                aria-hidden="true"
                className={`fixed top-0 right-0 bottom-(--bottom-nav-offset) left-0 z-290 bg-base/40 transition-opacity duration-200 md:hidden ${
                  isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              />
              <div
                id={drawerId}
                ref={drawerRef}
                role="dialog"
                aria-modal="true"
                aria-label="メインメニュー"
                aria-hidden={!isMenuOpen}
                className={`fixed right-0 bottom-(--bottom-nav-offset) left-0 z-295 h-[71svh] overflow-y-auto overscroll-contain bg-base-dark transition-transform duration-300 ease-out will-change-transform md:hidden ${
                  isMenuOpen ? "translate-y-0" : "pointer-events-none translate-y-full"
                }`}
              >
                {isMenuOpen ? <Menu key={menuKey} /> : null}
              </div>
            </>,
            portalContainer,
          )
        : null}
    </>
  );
}
