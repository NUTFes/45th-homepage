"use client";

import { X } from "lucide-react";
import { Button, CheckboxGroup, type CheckboxGroupProps } from "react-aria-components";
import { twMerge } from "tailwind-merge";

import CategoryCard from "./CategoryCard";

const ICON_BASE_PATH = "/image/event/category";

const categoryIcons = {
  activity: `${ICON_BASE_PATH}/activity.svg`,
  children: `${ICON_BASE_PATH}/children.svg`,
  food: `${ICON_BASE_PATH}/food.svg`,
  goods: `${ICON_BASE_PATH}/goods.svg`,
  learning: `${ICON_BASE_PATH}/learning.svg`,
  prize: `${ICON_BASE_PATH}/prize.svg`,
  reservation: `${ICON_BASE_PATH}/reservation.svg`,
  watch: `${ICON_BASE_PATH}/watch.svg`,
} as const;

type CategoryIcon = keyof typeof categoryIcons;

type CategoryMenuItem = {
  label: string;
  icon?: CategoryIcon;
};

export type CategoryMenuVariant = "event" | "program" | "exhibition" | "food" | "goods";

export const categoryMenuItems = {
  event: [
    { label: "食販", icon: "food" },
    { label: "物販", icon: "goods" },
    { label: "体験・遊ぶ", icon: "activity" },
    { label: "見る・聞く", icon: "watch" },
    { label: "展示・学ぶ", icon: "learning" },
    { label: "子ども向け", icon: "children" },
    { label: "要予約", icon: "reservation" },
    { label: "景品あり", icon: "prize" },
    { label: "１日目" },
    { label: "２日目" },
  ],
  program: [
    { label: "体験・遊ぶ", icon: "activity" },
    { label: "見る・聞く", icon: "watch" },
    { label: "子ども向け", icon: "children" },
    { label: "景品あり", icon: "prize" },
    { label: "要予約", icon: "learning" },
    { label: "講義棟", icon: "reservation" },
    { label: "ステージ", icon: "food" },
    { label: "体育館", icon: "goods" },
    { label: "１日目" },
    { label: "２日目" },
  ],
  exhibition: [
    { label: "体験・遊ぶ", icon: "activity" },
    { label: "見る・聞く", icon: "watch" },
    { label: "展示・学ぶ", icon: "learning" },
    { label: "子ども向け", icon: "children" },
    { label: "講義棟", icon: "reservation" },
    { label: "研究室", icon: "prize" },
    { label: "１日目" },
    { label: "２日目" },
  ],
  food: [
    { label: "フード", icon: "activity" },
    { label: "スイーツ", icon: "watch" },
    { label: "ドリンク", icon: "children" },
    { label: "国際グルメ", icon: "prize" },
    { label: "お酒あり", icon: "learning" },
    { label: "学生出店", icon: "reservation" },
    { label: "企業出店", icon: "food" },
    { label: "キッチンカー", icon: "goods" },
  ],
  goods: [
    { label: "体験あり", icon: "activity" },
    { label: "子ども向け", icon: "watch" },
    { label: "技大グッズ", icon: "children" },
  ],
} as const satisfies Record<CategoryMenuVariant, readonly CategoryMenuItem[]>;

const categoryMenuLabels = {
  event: "ゲスト・企画情報",
  program: "企画",
  exhibition: "展示・体験",
  food: "食販",
  goods: "物販",
} as const satisfies Record<CategoryMenuVariant, string>;

export type CategoryMenuProps = Omit<CheckboxGroupProps, "children" | "className" | "label"> & {
  className?: string;
  onClose: () => void;
  variant: CategoryMenuVariant;
};

export default function CategoryMenu({ className, onClose, variant, ...props }: CategoryMenuProps) {
  const items = categoryMenuItems[variant];

  return (
    <div
      className={twMerge(
        "flex min-h-[calc(100dvh-72px)] w-full flex-col items-center gap-3l bg-base pt-3l pb-4l md:ml-auto md:w-126 md:gap-4l md:bg-base-dark md:py-4l",
        className,
      )}
    >
      <div className="flex w-full items-center justify-between pr-3l md:pr-4l">
        <h2 className="border-b-[1.6px] border-main px-l font-kaisotai text-title text-font-main [text-shadow:2px_3px_2px_var(--color-base-shadow)] md:text-Ptitle">
          CATEGORY
        </h2>
        <Button
          aria-label="タグ検索を閉じる"
          className="flex size-8 cursor-pointer items-center justify-center rounded-sm text-font-main transition-colors hover:bg-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main md:size-10 pressed:bg-base"
          onPress={onClose}
        >
          <X aria-hidden="true" className="size-8 md:size-10" strokeWidth={1.5} />
        </Button>
      </div>

      <CheckboxGroup
        {...props}
        aria-label={props["aria-label"] ?? `${categoryMenuLabels[variant]}のタグ検索`}
        className="flex w-full flex-wrap items-center justify-between gap-x-s gap-y-l px-ll md:gap-x-3l md:gap-y-ll md:px-4l"
      >
        {items.map((item) => (
          <CategoryCard
            key={item.label}
            iconSrc={"icon" in item ? categoryIcons[item.icon] : undefined}
            label={item.label}
            value={item.label}
          />
        ))}
      </CheckboxGroup>
    </div>
  );
}
