"use client";

import Link from "next/link";
import { useState } from 'react';

import { House, Clock, MapPin, CalendarDays, LucideIcon, Plus, Minus, Building2, UserStar, Info } from "lucide-react";

type SubMenuItem = {
  label: string;
  href: string;
};

type MenuLeafItem = {
    label: string
    icon: LucideIcon
    href: string
}

type MenuParentItem = {
    label: string
    icon: LucideIcon
    children: SubMenuItem[]
}

type MenuItem = MenuLeafItem | MenuParentItem

const menuItems: MenuItem[] = [
  {
    label: "トップ",
    icon: House,
    href: "/",
  },
  {
    label: "イベント・販売",
    icon: CalendarDays,
    children: [
      {
        label: "ゲスト",
        href: "/",
      },
      {
        label: "コラボ",
        href: "/",
      },
      {
        label: "企画",
        href: "/",
      },
      {
        label: "展示・体験",
        href: "/",
      },
      {
        label: "食品販売",
        href: "/",
      },
      {
        label: "物品販売",
        href: "/",
      },
      {
        label: "企業ブース",
        href: "/",
      },
    ],
  },
  {
    label: "タイムスケジュール",
    icon: Clock,
    href: "/",
  },
  {
    label: "マップ",
    icon: MapPin,
    href: "/",
  },
  {
    label: "利用案内",
    icon: Info,
    children: [
      {
        label: "注意事項",
        href: "/",
      },
      {
        label: "案内所・ヘルプ",
        href: "/",
      },
      {
        label: "アクセス",
        href: "/",
      },
    ],
  },
  {
    label: "代表者挨拶",
    icon: UserStar,
    href: "/",
  },
  {
    label: "協賛企業一覧",
    icon: Building2,
    href: "/",
  },
];

type MenuItemProps = {
    item: MenuItem
}

function MenuItem({ item }: MenuItemProps){
    const [isOpen, setIsOpen] = useState(false)

    return(
        <li className="border-b border-font-main">
                { "children" in item ? (
                    <>
                    <button aria-expanded={isOpen} onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-start gap-s w-full px-l py-m">
                          <item.icon className="shrink-0 text-secondary" size={32}/>
                          <span className="text-text-large text-font-main">{item.label}</span>
                          {!isOpen ? <Plus aria-hidden="true" className="text-secondary ml-auto" size={24}/> : <Minus aria-hidden="true" className="text-secondary ml-auto " size={24}/>}

                    </button>
                    {isOpen &&
                    <ul className="pl-5l pb-m flex flex-col gap-ss">
                    {item.children.map((child) => (
                        <li key={child.label}>
                            <Link href={child.href}>
                                <span className="text-text text-font-main">{child.label}</span>
                            </Link>
                        </li>
                    ))}
                    </ul>}
                    </>
                ) : (
                    <Link href={item.href} className="flex items-center justify-start gap-s px-l py-m">
                        <item.icon className="shrink-0 text-secondary" size={32}/>
                        <span className="text-text-large text-font-main">{item.label}</span>
                    </Link>
                )}
            </li>
    )
}

export default function Menu() {
  return (
    <nav aria-label="メニュー" className="px-l pt-3l pb-4l bg-base-dark">
      <ul>
        {menuItems.map((item) => (
           <MenuItem key={item.label} item={item} />
        ))}
      </ul>
    </nav>
  );
}
