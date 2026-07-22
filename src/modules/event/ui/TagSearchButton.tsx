"use client";

import { ListSortDescending } from "lucide-react";
import { Button, type ButtonProps, composeRenderProps } from "react-aria-components";
import { twMerge } from "tailwind-merge";

type TagSearchButtonProps = Omit<ButtonProps, "children"> & {
  label?: string;
};

export default function TagSearchButton({ label = "タグ検索", ...props }: TagSearchButtonProps) {
  return (
    <Button
      {...props}
      className={composeRenderProps(props.className, (className) =>
        twMerge(
          "flex cursor-pointer items-center justify-center gap-ss rounded-full border border-main bg-base-dark px-s py-ss text-button whitespace-nowrap text-font-main transition-colors hover:bg-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main disabled:cursor-not-allowed disabled:opacity-50 md:gap-xs md:rounded-[22px] md:px-m md:text-Pbutton pressed:bg-base",
          className,
        ),
      )}
    >
      <span>{label}</span>
      <ListSortDescending
        aria-hidden="true"
        className="size-4 shrink-0 md:size-5"
        strokeWidth={2}
      />
    </Button>
  );
}
