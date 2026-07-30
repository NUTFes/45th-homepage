"use client";
import type { Ref } from "react";

import { X } from "lucide-react";
import { Button, CheckboxGroup, type CheckboxGroupProps } from "react-aria-components";
import { twMerge } from "tailwind-merge";

import CategoryCard from "./CategoryCard";
import {
  categoryMenuItems,
  categoryMenuLabels,
  getCategoryIconSrc,
  type CategoryMenuVariant,
} from "./categoryMenuData";

export type CategoryMenuProps = Omit<CheckboxGroupProps, "children" | "className" | "label"> & {
  className?: string;
  closeButtonRef?: Ref<HTMLButtonElement>;
  onClose: () => void;
  variant: CategoryMenuVariant;
};

export default function CategoryMenu({
  closeButtonRef,
  className,
  onClose,
  variant,
  ...props
}: CategoryMenuProps) {
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
          ref={closeButtonRef}
          className="flex size-8 cursor-pointer items-center justify-center rounded-sm text-font-main transition-colors hover:bg-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main md:size-10 pressed:bg-base"
          onPress={onClose}
        >
          <X aria-hidden="true" className="size-8 md:size-10" strokeWidth={1.5} />
        </Button>
      </div>

      <CheckboxGroup
        {...props}
        aria-label={props["aria-label"] ?? `${categoryMenuLabels[variant]}のタグ検索`}
        className="grid w-full grid-cols-[repeat(auto-fill,9.25rem)] items-center justify-between gap-x-s gap-y-l px-ll md:grid-cols-[repeat(auto-fill,10.75rem)] md:gap-x-3l md:gap-y-ll md:px-4l"
      >
        {items.map((item) => (
          <CategoryCard
            key={item.value}
            iconSrc={getCategoryIconSrc(item.label)}
            label={item.label}
            value={item.value}
          />
        ))}
      </CheckboxGroup>
    </div>
  );
}
