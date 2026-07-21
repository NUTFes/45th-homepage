"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { Checkbox, type CheckboxProps, composeRenderProps } from "react-aria-components";
import { twMerge } from "tailwind-merge";

export type CategoryCardProps = Omit<CheckboxProps, "children"> & {
  iconSrc?: string;
  label: string;
};

export default function CategoryCard({ iconSrc, label, ...props }: CategoryCardProps) {
  return (
    <Checkbox
      {...props}
      aria-label={props["aria-label"] ?? label}
      className={composeRenderProps(props.className, (className, { isSelected }) =>
        twMerge(
          "group flex w-37 shrink-0 cursor-pointer items-center gap-xs overflow-hidden border border-main bg-base-dark py-ss pr-ss pl-xs text-text-large text-font-main shadow-[2px_3px_1px_var(--color-base-shadow)] transition-colors [-webkit-tap-highlight-color:transparent] hover:bg-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main disabled:cursor-not-allowed disabled:opacity-50 md:w-43 md:text-Ptext-large pressed:bg-base",
          isSelected && "font-bold text-main",
          className,
        ),
      )}
    >
      {({ isSelected }) => (
        <>
          <span
            aria-hidden="true"
            className={twMerge(
              "flex size-4 shrink-0 items-center justify-center border border-main md:size-5 md:border-2",
              isSelected && "bg-main text-base-dark",
            )}
          >
            {isSelected && <Check className="size-4 md:size-5" strokeWidth={3} />}
          </span>
          <span className="relative isolate h-10 w-25 min-w-0 md:h-11.5 md:flex-1">
            <span className="absolute top-1/2 left-0 z-10 -translate-y-1/2 whitespace-nowrap">
              {label}
            </span>
            {iconSrc !== undefined && (
              <span
                aria-hidden="true"
                className="absolute top-1/2 right-0 z-0 size-10 -translate-y-1/2 md:size-11.5"
              >
                <Image src={iconSrc} alt="" fill sizes="(min-width: 768px) 46px, 40px" />
              </span>
            )}
          </span>
        </>
      )}
    </Checkbox>
  );
}
