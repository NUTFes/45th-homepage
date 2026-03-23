"use client";
import React from "react";
import { DialogProps, Dialog as RACDialog } from "react-aria-components";
import { twMerge } from "tailwind-merge";

export function Dialog(props: DialogProps) {
  return (
    <RACDialog
      {...props}
      className={twMerge(
        "relative box-border max-h-[inherit] overflow-auto p-6 outline outline-0 [[data-placement]>&]:p-4",
        props.className,
      )}
    />
  );
}
