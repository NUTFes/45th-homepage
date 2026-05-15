"use client";

import { useEffect, useId, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Clock, MapPin, CalendarDays, type LucideIcon } from "lucide-react";
import BottomNavMenuButton from "@/components/layout/BottomNavMenuButton";
import { twMerge } from "tailwind-merge";

const Menu = dynamic(() => import("@/components/layout/Menu"), {
  loading: () => null,
  ssr: false,
});

type NavItem = {
  label: string;
  icon: LucideIcon;
  href: string;
  disabled?: boolean;
};

type BottomNavItemState = "active" | "inactive" | "disabled";

const NAV_ITEMS: NavItem[] = [
  { label: "ホーム", icon: House, href: "/" },
  { label: "スケジュール", icon: Clock, disabled: true, href: "/schedule" },
  { label: "マップ", icon: MapPin, disabled: true, href: "/map" },
  { label: "企画", icon: CalendarDays, disabled: true, href: "/events" },
];

function isCurrentPath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function getItemClassName(state: BottomNavItemState) {
  return twMerge(
    "group flex h-14.25 w-full flex-col items-center justify-center gap-1 text-center transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main",
    state === "disabled" ? "cursor-not-allowed text-secondary/60" : "text-secondary",
  );
}

function getIconClassName() {
  return "flex size-9 shrink-0 items-center justify-center transition-colors duration-200";
}

function getLabelClassName() {
  return "max-w-full whitespace-nowrap text-text-small";
}

function NavItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const state: BottomNavItemState = item.disabled
    ? "disabled"
    : isCurrentPath(pathname, item.href)
      ? "active"
      : "inactive";

  const inner = (
    <>
      <span className={getIconClassName()} aria-hidden="true">
        <item.icon className="shrink-0" size={28} strokeWidth={2.2} />
      </span>
      <span className={getLabelClassName()}>{item.label}</span>
    </>
  );

  if (state === "disabled") {
    return (
      <span aria-disabled="true" className={getItemClassName(state)}>
        {inner}
      </span>
    );
  }

  return (
    <Link
      href={item.href}
      aria-current={state === "active" ? "page" : undefined}
      className={getItemClassName(state)}
    >
      {inner}
    </Link>
  );
}

export default function BottomNavigation() {
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
        setMenuKey((current) => current + 1);
      }

      return !prev;
    });
  };

  return (
    <>
      <nav
        aria-label="モバイルナビゲーション"
        className="fixed right-0 bottom-0 left-0 z-300 flex bg-base-dark px-s pt-ss pb-[calc(var(--bottom-nav-padding-y)+env(safe-area-inset-bottom))] md:hidden"
      >
        <ul className="flex w-full list-none justify-between">
          {NAV_ITEMS.map((item) => (
            <li key={item.label} className="flex-1">
              <NavItem item={item} pathname={pathname} />
            </li>
          ))}

          <li className="flex-1">
            <BottomNavMenuButton
              isMenuOpen={isMenuOpen}
              drawerId={drawerId}
              onToggle={toggleMenu}
            />
          </li>
        </ul>
      </nav>

      <div
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
        className={twMerge(
          "fixed top-0 right-0 bottom-(--bottom-nav-offset) left-0 z-290 bg-base/40 transition-opacity duration-200 md:hidden",
          isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <div
        id={drawerId}
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="メインメニュー"
        aria-hidden={!isMenuOpen}
        className={twMerge(
          "fixed right-0 bottom-(--bottom-nav-offset) left-0 z-295 h-[71svh] overflow-y-auto overscroll-contain bg-base-dark transition-transform duration-300 ease-out will-change-transform md:hidden",
          isMenuOpen ? "translate-y-0" : "pointer-events-none translate-y-full",
        )}
      >
        {isMenuOpen ? <Menu key={menuKey} /> : null}
      </div>
    </>
  );
}
