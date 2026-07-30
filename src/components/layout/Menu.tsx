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
  disabled?: boolean;
};

type MenuLeafItem = {
  label: string;
  icon: LucideIcon;
  href?: string;
  disabled?: boolean;
};

type MenuParentItem = {
  label: string;
  icon: LucideIcon;
  children: SubMenuItem[];
  disabled?: boolean;
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
    children: [
      {
        label: "すべてのイベント・販売",
        href: "/event",
      },
      {
        label: "ゲスト",
        href: "/event/guest",
      },
      {
        label: "コラボ",
        disabled: true,
      },
      {
        label: "企画",
        href: "/event/programs",
      },
      {
        label: "展示・体験",
        href: "/event/programs/category/exhibition",
      },
      {
        label: "食品販売",
        href: "/event/programs/category/food",
      },
      {
        label: "物品販売",
        href: "/event/programs/category/goods",
      },
      {
        label: "企業ブース",
        href: "/event/programs/category/corporate",
      },
    ],
  },
  {
    label: "タイムスケジュール",
    icon: Clock,
    disabled: true,
  },
  {
    label: "マップ",
    icon: MapPin,
    disabled: true,
  },
  {
    label: "利用案内",
    icon: Info,
    children: [
      {
        label: "注意事項",
        href: "/attention",
      },
      {
        label: "案内所・ヘルプ",
        disabled: true,
      },
      {
        label: "アクセス",
        disabled: true,
      },
    ],
  },
  {
    label: "代表者挨拶",
    icon: UserStar,
    disabled: true,
  },
  {
    label: "協賛企業一覧",
    icon: Building2,
    href: "/sponsors",
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
const enabledDisclosureTriggerClassName =
  "flex min-h-16 w-full items-center justify-start gap-s px-l py-m text-font-main transition-colors duration-200 hover:bg-base focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-main";
const disabledDisclosureTriggerClassName =
  "flex min-h-16 w-full cursor-not-allowed items-center justify-start gap-s px-l py-m text-font-gray";
const childLinkClassName =
  "inline-flex min-h-9 items-center text-text text-font-main transition-colors duration-200 hover:text-main focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-main";
const disabledChildClassName =
  "inline-flex min-h-9 cursor-not-allowed items-center text-text text-font-gray";

function MenuItem({ item }: MenuItemProps) {
  const isLeaf = !("children" in item);
  const disabled = item.disabled === true;

  return (
    <li className="border-b border-font-gray">
      {isLeaf ? (
        !disabled ? (
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
            <Button
              slot="trigger"
              className={
                disabled ? disabledDisclosureTriggerClassName : enabledDisclosureTriggerClassName
              }
              isDisabled={disabled}
            >
              <item.icon
                className={`shrink-0 ${disabled ? "text-font-gray" : "text-secondary"}`}
                size={ITEM_ICON_SIZE}
                aria-hidden="true"
              />
              <span className={`text-text-large ${disabled ? "text-font-gray" : "text-font-main"}`}>
                {item.label}
              </span>
              <span className="relative ml-auto size-6 shrink-0" aria-hidden="true">
                <Plus
                  size={24}
                  className={`absolute inset-0 transition-opacity duration-300 group-data-expanded:opacity-0 ${disabled ? "text-font-gray" : "text-font-main"}`}
                />
                <Minus
                  size={24}
                  className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-data-expanded:opacity-100 ${disabled ? "text-font-gray" : "text-font-main"}`}
                />
              </span>
            </Button>
          </Heading>

          <DisclosurePanel className="h-(--disclosure-panel-height) overflow-hidden duration-300 motion-safe:transition-[height] [hidden]:block">
            <ul className="flex flex-col gap-ss px-l pb-m pl-5l">
              {item.children.map((child) => {
                const childDisabled = child.disabled === true;

                return (
                  <li key={child.label}>
                    {!childDisabled ? (
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
