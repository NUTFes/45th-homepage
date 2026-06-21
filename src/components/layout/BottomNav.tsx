import { Suspense } from "react";
import Link from "next/link";
import { House, Clock, MapPin, CalendarDays, type LucideIcon } from "lucide-react";
import BottomNavMenuDrawer from "@/components/layout/BottomNavMenuDrawer";

type NavItem = {
  label: string;
  icon: LucideIcon;
  href: string;
  disabled?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { label: "ホーム", icon: House, href: "/" },
  { label: "スケジュール", icon: Clock, disabled: true, href: "/schedule" },
  { label: "マップ", icon: MapPin, disabled: true, href: "/map" },
  { label: "企画", icon: CalendarDays, disabled: true, href: "/events" },
];

const ENABLED_ITEM_CLASS_NAME =
  "group flex h-14.25 w-full flex-col items-center justify-center gap-1 text-center text-secondary transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main";
const DISABLED_ITEM_CLASS_NAME =
  "group flex h-14.25 w-full cursor-not-allowed flex-col items-center justify-center gap-1 text-center text-secondary/60 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main";

function getIconClassName() {
  return "flex size-9 shrink-0 items-center justify-center transition-colors duration-200";
}

function getLabelClassName() {
  return "max-w-full whitespace-nowrap text-text-small";
}

function NavItem({ item }: { item: NavItem }) {
  const inner = (
    <>
      <span className={getIconClassName()} aria-hidden="true">
        <item.icon className="shrink-0" size={28} strokeWidth={2.2} />
      </span>
      <span className={getLabelClassName()}>{item.label}</span>
    </>
  );

  if (item.disabled) {
    return (
      <span aria-disabled="true" className={DISABLED_ITEM_CLASS_NAME}>
        {inner}
      </span>
    );
  }

  return (
    <Link href={item.href} className={ENABLED_ITEM_CLASS_NAME}>
      {inner}
    </Link>
  );
}

export default function BottomNavigation() {
  return (
    <nav
      aria-label="モバイルナビゲーション"
      className="fixed right-0 bottom-0 left-0 z-300 flex bg-base-dark px-s pt-ss pb-[calc(var(--bottom-nav-padding-y)+env(safe-area-inset-bottom))] md:hidden"
    >
      <ul className="flex w-full list-none justify-between">
        {NAV_ITEMS.map((item) => (
          <li key={item.label} className="flex-1">
            <NavItem item={item} />
          </li>
        ))}

        <li className="flex-1">
          <Suspense fallback={null}>
            <BottomNavMenuDrawer />
          </Suspense>
        </li>
      </ul>
    </nav>
  );
}
