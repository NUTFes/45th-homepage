"use client";

import { X } from "lucide-react";
import { Button, type ButtonProps, composeRenderProps } from "react-aria-components";
import { twMerge } from "tailwind-merge";

type ActiveTagProps = Omit<ButtonProps, "children"> & {
  label: string;
};

export default function ActiveTag({ label, ...props }: ActiveTagProps) {
  return (
    <Button
      {...props}
      aria-label={props["aria-label"] ?? `${label}タグを削除`}
      className={composeRenderProps(props.className, (className) =>
        twMerge(
          "flex max-w-full cursor-pointer items-center gap-ss rounded-[10px] border border-main bg-base-dark py-ss pr-xs pl-s text-textb text-font-main transition-colors hover:bg-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main disabled:cursor-not-allowed disabled:opacity-50 md:text-Ptext md:font-bold pressed:bg-base",
          className,
        ),
      )}
    >
      <span className="text-center wrap-break-word">{label}</span>
      <X aria-hidden="true" className="size-4 shrink-0 md:size-5" strokeWidth={2.5} />
    </Button>
  );
}
