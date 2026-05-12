"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Clock, MapPin, CalendarDays, Menu, X, LucideIcon } from "lucide-react";
import { Button, DialogTrigger, ModalOverlay, Modal, Dialog } from "react-aria-components";
import MenuContext from "@/components/layout/Menu";

type NavItemType = {
  name: string;
  icon: LucideIcon;
  href?: string;
  onPress?: () => void;
  disabled?: boolean;
};

function NavItem({ item }: { item: NavItemType }) {
  const isActive = !item.disabled && (item.href !== undefined || item.onPress !== undefined);
  const color = isActive ? "text-secondary" : "text-font-gray";
  const wrapperClass = "flex h-14.25 w-full flex-col items-center justify-center gap-1";

  const inner = (
    <>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center">
        <item.icon className={`shrink-0 ${color}`} size={30} />
      </div>
      <span className={`text-text-small whitespace-nowrap ${color}`}>{item.name}</span>
    </>
  );

  if (!isActive) {
    return <div className={`pointer-events-none ${wrapperClass}`}>{inner}</div>;
  }
  if (item.href)
    return (
      <Link href={item.href} className={wrapperClass}>
        {inner}
      </Link>
    );
  if (item.onPress)
    return (
      <Button onPress={item.onPress} className={wrapperClass}>
        {inner}
      </Button>
    );
}

export default function BottomNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const regularItems: NavItemType[] = [
    pathname === "/"
      ? {
          name: "ホーム",
          icon: House,
          onPress: () => window.scrollTo({ top: 0, behavior: "smooth" }),
        }
      : { name: "ホーム", icon: House, href: "/" },
    { name: "スケジュール", icon: Clock, href: "/", disabled: true },
    { name: "マップ", icon: MapPin, href: "/", disabled: true },
    { name: "企画", icon: CalendarDays, href: "/", disabled: true },
  ];

  return (
    <nav className="sticky right-0 bottom-0 left-0 flex bg-base-dark px-s py-ss md:hidden">
      <ul className="flex w-full list-none justify-between">
        {regularItems.map((item) => (
          <li key={item.name} className="flex-1">
            <NavItem item={item} />
          </li>
        ))}

        <li className="flex-1">
          <DialogTrigger isOpen={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <Button className="flex h-14.25 w-full flex-col items-center justify-center gap-1">
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center">
                <Menu
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
            </Button>

            <ModalOverlay
              isDismissable
              className="fixed top-0 right-0 bottom-[73px] left-0 z-300 bg-base/40 ease-out motion-safe:transition-opacity motion-safe:duration-300 entering:opacity-0 exiting:opacity-0 exiting:ease-in"
            >
              <Modal className="fixed right-0 bottom-[73px] left-0 z-350 h-[71svh] translate-y-0 overflow-y-auto overscroll-contain bg-base-dark transition-transform duration-300 entering:translate-y-full exiting:translate-y-full">
                <Dialog className="outline-none">
                  <MenuContext />
                </Dialog>
              </Modal>
            </ModalOverlay>
          </DialogTrigger>
        </li>
      </ul>
    </nav>
  );
}
