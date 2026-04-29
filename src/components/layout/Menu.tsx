"use client";

import Link from "next/link";
import { Disclosure, DisclosurePanel, Button } from "react-aria-components";

import {
  House,
  Clock,
  MapPin,
  CalendarDays,
  LucideIcon,
  Plus,
  Minus,
  Building2,
  UserStar,
  Info,
} from "lucide-react";

type SubMenuItem = {
  label: string;
  href: string;
  enabled?: boolean;
};

type MenuLeafItem = {
  label: string;
  icon: LucideIcon;
  href: string;
  enabled?: boolean;
};

type MenuParentItem = {
  label: string;
  icon: LucideIcon;
  children: SubMenuItem[];
  enabled?: boolean;
};

type MenuItem = MenuLeafItem | MenuParentItem;

const menuItems: MenuItem[] = [
  {
    label: "トップ",
    icon: House,
    href: "/",
  },
  {
    label: "イベント・販売",
    icon: CalendarDays,
    enabled: false,
    children: [
      {
        label: "ゲスト",
        href: "/",
        enabled: false,
      },
      {
        label: "コラボ",
        href: "/",
        enabled: false,
      },
      {
        label: "企画",
        href: "/",
        enabled: false,
      },
      {
        label: "展示・体験",
        href: "/",
        enabled: false,
      },
      {
        label: "食品販売",
        href: "/",
        enabled: false,
      },
      {
        label: "物品販売",
        href: "/",
        enabled: false,
      },
      {
        label: "企業ブース",
        href: "/",
        enabled: false,
      },
    ],
  },
  {
    label: "タイムスケジュール",
    icon: Clock,
    href: "/",
    enabled: false,
  },
  {
    label: "マップ",
    icon: MapPin,
    href: "/",
    enabled: false,
  },
  {
    label: "利用案内",
    icon: Info,
    enabled: false,
    children: [
      {
        label: "注意事項",
        href: "/",
        enabled: false,
      },
      {
        label: "案内所・ヘルプ",
        href: "/",
        enabled: false,
      },
      {
        label: "アクセス",
        href: "/",
        enabled: false,
      },
    ],
  },
  {
    label: "代表者挨拶",
    icon: UserStar,
    href: "/",
    enabled: false,
  },
  {
    label: "協賛企業一覧",
    icon: Building2,
    href: "/",
    enabled: false,
  },
];

type MenuItemProps = {
  item: MenuItem;
};

function MenuItem({ item }: MenuItemProps) {
  const isLeaf = !("children" in item);
  const enabled = isLeaf ? item.enabled !== false : true;

  return (
    <li className="border-b border-font-main">
      {isLeaf ? (
        enabled ? (
          <Link href={item.href} className="flex items-center gap-s px-l py-m text-font-main">
            <item.icon className="shrink-0 text-secondary" size={32} />
            <span
              className={
                enabled ? "text-text-large text-font-main" : "text-text-large text-font-gray"
              }
            >
              {item.label}
            </span>
          </Link>
        ) : (
          <div className="text-gray pointer-events-none flex cursor-not-allowed items-center gap-s px-l py-m">
            <item.icon className="shrink-0 text-font-gray" size={32} />
            <span className="text-text-large text-font-gray">{item.label}</span>
          </div>
        )
      ) : (
        <Disclosure className="group">
          <Button slot="trigger" className="flex w-full items-center justify-start gap-s px-l py-m">
            <item.icon className="shrink-0 text-font-gray" size={32} />
            <span className="text-text-large text-font-gray">{item.label}</span>
            <span className="relative ml-auto h-6 w-6" aria-hidden="true">
              <Plus
                size={24}
                className="absolute inset-0 text-secondary transition-opacity duration-300 group-data-expanded:opacity-0"
              />
              <Minus
                size={24}
                className="absolute inset-0 text-secondary opacity-0 transition-opacity duration-300 group-data-expanded:opacity-100"
              />
            </span>
          </Button>

          <DisclosurePanel className="h-(--disclosure-panel-height) overflow-clip duration-300 motion-safe:transition-[height] [hidden]:block">
            <ul className="flex flex-col gap-ss pb-m pl-5l">
              {item.children.map((child) => {
                const enabled = child.enabled !== false;

                return (
                  <li key={child.label}>
                    {enabled ? (
                      <Link href={child.href} className="text-text text-font-main">
                        {child.label}
                      </Link>
                    ) : (
                      <span className="pointer-events-none cursor-not-allowed text-text text-font-gray">
                        {child.label}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </DisclosurePanel>
        </Disclosure>
      )}
    </li>
  );
}
export default function Menu() {
  return (
    <nav aria-label="メニュー" className="bg-base-dark px-l pt-3l pb-4l">
      <ul>
        {menuItems.map((item) => (
          <MenuItem key={item.label} item={item} />
        ))}
      </ul>
    </nav>
  );
}
