"use client";

import { X } from "lucide-react";
import { Button, type ButtonProps } from "react-aria-components";
import { twMerge } from "tailwind-merge";

type ActiveTagProps = Omit<ButtonProps, "children" | "className"> & {
  className?: string;
  label: string;
};

export default function ActiveTag({ className, isDisabled, label, ...props }: ActiveTagProps) {
  return (
    <span
      className={twMerge(
        "flex max-w-full items-center gap-ss rounded-[10px] border border-main bg-base-dark py-ss pr-xs pl-s text-textb text-font-main md:text-Ptext md:font-bold",
        isDisabled && "opacity-50",
        className,
      )}
    >
      <span className="text-center wrap-break-word">{label}</span>
      <Button
        {...props}
        aria-label={props["aria-label"] ?? `${label}タグを削除`}
        className="-m-1 flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-sm transition-colors hover:bg-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main disabled:cursor-not-allowed md:size-7 pressed:bg-base"
        isDisabled={isDisabled}
      >
        <X aria-hidden="true" className="size-4 md:size-5" strokeWidth={2.5} />
      </Button>
    </span>
  );
}
