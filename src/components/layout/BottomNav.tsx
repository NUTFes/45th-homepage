"use client";

import { useState } from "react";
import { House, Clock, MapPin, CalendarDays, Menu, X, LucideIcon } from "lucide-react";
import { Button, DialogTrigger, ModalOverlay, Modal, Dialog } from "react-aria-components";
import MenuContext from "@/components/layout/Menu";

type NavItemType = {
  name: string;
  icon: LucideIcon;
  href?: string;
  active: boolean;
};

const regularItems: NavItemType[] = [
  { name: "ホーム", icon: House, href: "/", active: true },
  { name: "スケジュール", icon: Clock, href: "/", active: false },
  { name: "マップ", icon: MapPin, href: "/", active: false },
  { name: "企画", icon: CalendarDays, href: "/", active: false },
];

function NavItem({ item }: { item: NavItemType }) {
  if (item.name === "ホーム") {
    return (
      <Button
        onPress={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="flex h-14.25 w-full flex-col items-center justify-center gap-1"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center">
          <item.icon className="shrink-0 text-secondary" size={30} />
        </div>
        <span className="text-text-small whitespace-nowrap text-secondary">{item.name}</span>
      </Button>
    );
  }
  return (
    <div className="pointer-events-none flex h-14.25 flex-col items-center justify-center gap-1">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center">
        <item.icon className="shrink-0 text-font-gray" size={30} />
      </div>
      <span className="text-text-small whitespace-nowrap text-font-gray">{item.name}</span>
    </div>
  );
}

export default function BottomNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                  size={24}
                  className={`absolute shrink-0 text-secondary transition-opacity duration-300 ${
                    isMenuOpen ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>
              <span className="text-text-small whitespace-nowrap text-secondary">メニュー</span>
            </Button>

            <ModalOverlay
              isDismissable
              className="fixed top-0 right-0 bottom-[73px] left-0 z-300 bg-base/40 transition-opacity duration-300 entering:opacity-0 exiting:opacity-0"
            >
              <Modal className="fixed right-0 bottom-[73px] left-0 z-350 h-[71svh] origin-bottom scale-y-100 overflow-y-auto overscroll-contain bg-base-dark transition-transform duration-300 entering:scale-y-0 exiting:scale-y-0">
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
