"use client";

import Link from "next/link";
import { Button, Disclosure, DisclosurePanel, Heading } from "react-aria-components";

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
  href?: string;
  enabled?: boolean;
};

type MenuLeafItem = {
  label: string;
  icon: LucideIcon;
  href?: string;
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
        enabled: false,
      },
      {
        label: "コラボ",
        enabled: false,
      },
      {
        label: "企画",
        enabled: false,
      },
      {
        label: "展示・体験",
        enabled: false,
      },
      {
        label: "食品販売",
        enabled: false,
      },
      {
        label: "物品販売",
        enabled: false,
      },
      {
        label: "企業ブース",
        enabled: false,
      },
    ],
  },
  {
    label: "タイムスケジュール",
    icon: Clock,
    enabled: false,
  },
  {
    label: "マップ",
    icon: MapPin,
    enabled: false,
  },
  {
    label: "利用案内",
    icon: Info,
    enabled: false,
    children: [
      {
        label: "注意事項",
        enabled: false,
      },
      {
        label: "案内所・ヘルプ",
        enabled: false,
      },
      {
        label: "アクセス",
        enabled: false,
      },
    ],
  },
  {
    label: "代表者挨拶",
    icon: UserStar,
    enabled: false,
  },
  {
    label: "協賛企業一覧",
    icon: Building2,
    enabled: false,
  },
];

type MenuItemProps = {
  item: MenuItem;
};

const ITEM_ICON_SIZE = 32;

const enabledItemClassName =
  "flex min-h-16 items-center gap-s px-l py-m text-font-main transition-colors duration-200 hover:bg-base focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-main";
const disabledItemClassName =
  "flex min-h-16 cursor-not-allowed items-center gap-s px-l py-m text-font-gray";
const disclosureTriggerClassName =
  "flex min-h-16 w-full items-center justify-start gap-s px-l py-m text-font-gray transition-colors duration-200 hover:bg-base/50 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-main";
const childLinkClassName =
  "inline-flex min-h-9 items-center text-text text-font-main transition-colors duration-200 hover:text-main focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-main";
const disabledChildClassName =
  "inline-flex min-h-9 cursor-not-allowed items-center text-text text-font-gray";

function MenuItem({ item }: MenuItemProps) {
  const isLeaf = !("children" in item);
  const enabled = isLeaf ? item.enabled !== false : true;

  return (
    <li className="border-b border-font-gray">
      {isLeaf ? (
        enabled ? (
          <Link href={item.href ?? "/"} className={enabledItemClassName}>
            <item.icon
              className="shrink-0 text-secondary"
              size={ITEM_ICON_SIZE}
              aria-hidden="true"
            />
            <span className="text-text-large text-font-main">{item.label}</span>
          </Link>
        ) : (
          <span aria-disabled="true" className={disabledItemClassName}>
            <item.icon
              className="shrink-0 text-font-gray"
              size={ITEM_ICON_SIZE}
              aria-hidden="true"
            />
            <span className="text-text-large text-font-gray">{item.label}</span>
          </span>
        )
      ) : (
        <Disclosure className="group">
          <Heading className="m-0">
            <Button slot="trigger" className={disclosureTriggerClassName}>
              <item.icon
                className="shrink-0 text-font-gray"
                size={ITEM_ICON_SIZE}
                aria-hidden="true"
              />
              <span className="text-text-large text-font-gray">{item.label}</span>
              <span className="relative ml-auto size-6 shrink-0" aria-hidden="true">
                <Plus
                  size={24}
                  className="absolute inset-0 text-font-gray transition-opacity duration-300 group-data-expanded:opacity-0"
                />
                <Minus
                  size={24}
                  className="absolute inset-0 text-font-gray opacity-0 transition-opacity duration-300 group-data-expanded:opacity-100"
                />
              </span>
            </Button>
          </Heading>

          <DisclosurePanel className="h-(--disclosure-panel-height) overflow-hidden duration-300 motion-safe:transition-[height] [hidden]:block">
            <ul className="flex flex-col gap-ss px-l pb-m pl-5l">
              {item.children.map((child) => {
                const enabled = child.enabled !== false;

                return (
                  <li key={child.label}>
                    {enabled ? (
                      <Link href={child.href ?? "/"} className={childLinkClassName}>
                        {child.label}
                      </Link>
                    ) : (
                      <span aria-disabled="true" className={disabledChildClassName}>
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
    <nav aria-label="メニュー" className="bg-base-dark px-l pt-xs pb-4l">
      <ul className="list-none">
        {menuItems.map((item) => (
          <MenuItem key={item.label} item={item} />
        ))}
      </ul>
    </nav>
  );
}
