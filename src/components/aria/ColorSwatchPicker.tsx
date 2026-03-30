"use client";
import React from "react";
import {
  ColorSwatchPicker as AriaColorSwatchPicker,
  ColorSwatchPickerItem as AriaColorSwatchPickerItem,
  ColorSwatchPickerItemProps,
  ColorSwatchPickerProps,
  composeRenderProps,
} from "react-aria-components";
import { ColorSwatch } from "@/components/aria/ColorSwatch";
import { focusRing } from "@/lib/react-aria-utils";
import { tv } from "tailwind-variants";

const pickerStyles = tv({
  base: "flex gap-1",
  variants: {
    layout: {
      stack: "flex-col",
      grid: "flex-wrap",
    },
  },
});

export function ColorSwatchPicker({ children, ...props }: Omit<ColorSwatchPickerProps, "layout">) {
  return (
    <AriaColorSwatchPicker
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        pickerStyles({ ...renderProps, className }),
      )}
    >
      {children}
    </AriaColorSwatchPicker>
  );
}

const itemStyles = tv({
  extend: focusRing,
  base: "relative rounded-xs [-webkit-tap-highlight-color:transparent]",
});

export function ColorSwatchPickerItem(props: ColorSwatchPickerItemProps) {
  return (
    <AriaColorSwatchPickerItem {...props} className={itemStyles}>
      {({ isSelected }) => (
        <>
          <ColorSwatch />
          {isSelected && (
            <div className="absolute top-0 left-0 box-border h-full w-full rounded-md border border-2 border-black outline outline-2 -outline-offset-4 outline-white forced-color-adjust-none dark:border-white dark:outline-black" />
          )}
        </>
      )}
    </AriaColorSwatchPickerItem>
  );
}
