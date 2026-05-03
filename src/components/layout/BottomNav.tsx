"use client";

import { useState } from "react";
import { House, Clock, MapPin, CalendarDays, Menu, X, LucideIcon} from "lucide-react";
import { Button, ModalOverlay, Modal, Dialog } from "react-aria-components";

type NavItemType = {
  name: string;
  icon: LucideIcon;
  href?: string;
  active: boolean;
};

type NavItemProps = {
  item: NavItemType;
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
};

const navItems = [
  { name: "ホーム", icon: House, href: "/", active: true },
  { name: "スケジュール", icon: Clock, href: "/", active: false },
  { name: "マップ", icon: MapPin, href: "/", active: false },
  { name: "企画", icon: CalendarDays, href: "/", active: false },
  { name: "メニュー", icon: Menu, active: true },
];

function NavItem({ item, isMenuOpen, setIsMenuOpen }: NavItemProps) {
  if (item.name === "ホーム")
    return (
      <Button
        onPress={() => window.scrollTo(0, 0)}
        className="flex h-14.25 flex-col items-center justify-center gap-1"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center">
          <item.icon className="shrink-0 text-secondary" size={30} />
        </div>
        <span className="text-text-small whitespace-nowrap text-secondary">{item.name}</span>
      </Button>
    );
  if (!item.active)
    return (
      <div className="pointer-events-none flex h-14.25 flex-col items-center justify-center gap-1">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center">
          <item.icon className="shrink-0 text-font-gray" size={30} />
        </div>
        <span className="text-text-small whitespace-nowrap text-font-gray">{item.name}</span>
      </div>
    );
  return (
    <Button
      onPress={() => setIsMenuOpen(!isMenuOpen)}
      className="flex h-14.25 flex-col items-center justify-center gap-1"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center">
        {isMenuOpen ? (
          <X size={24} className="shrink-0 text-secondary" />
        ) : (
          <Menu size={30} className="shrink-0 text-secondary" />
        )}
      </div>
      <span className="text-text-small whitespace-nowrap text-secondary">{item.name}</span>
    </Button>
  );
}

export default function BottomNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <nav className="sticky right-0 bottom-0 left-0 flex bg-base-dark px-s py-ss md:hidden">
      <ul className="flex w-full list-none justify-between">
        {navItems.map((item) => (
          <li key={item.name} className="flex-1">
            <NavItem item={item} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
