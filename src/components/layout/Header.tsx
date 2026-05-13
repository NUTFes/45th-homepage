"use client";

import { useState, useEffect, useRef } from "react";
import { LucideMenu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Menu from "@/components/layout/Menu";

export default function Page() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isMenuOpen && drawerRef.current) {
      drawerRef.current.scrollTop = 0;
    }
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-100 flex w-full items-center justify-between bg-white px-m py-m lg:px-5l">
      <div className="flex items-center gap-xs">
        <Link href="/">
          <Image src="/icon/45th-logo-top.svg" alt="45thNUTFES ロゴ" width={48} height={48} />
        </Link>
        <div className="font-kaisotai text-title text-base-dark">45th NUTFES</div>
      </div>
      <div className="flex hidden items-center gap-4l text-Pbutton text-base-dark lg:flex">
        <div className="text-font-gray">企画情報</div>
        <div className="text-font-gray">スケジュール</div>
        <div className="text-font-gray">マップ</div>
        <div className="text-font-gray">利用案内</div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
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
          className={`fixed top-[88px] right-0 bottom-0 left-0 z-300 hidden bg-base/40 ease-out motion-safe:transition-opacity motion-safe:duration-300 md:block ${
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
          className={`fixed top-[88px] right-0 z-350 hidden max-h-[calc(100dvh-88px)] overflow-y-auto bg-base-dark ease-out motion-safe:transition-transform motion-safe:duration-300 md:block ${
            isMenuOpen ? "translate-x-0" : "pointer-events-none translate-x-full ease-in"
          }`}
        >
          <Menu />
        </div>
      </div>
    </header>
  );
}
