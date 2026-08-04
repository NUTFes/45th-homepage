"use client";

import type { ReactNode } from "react";
import { ChevronUp } from "lucide-react";
import {
  Button,
  Disclosure,
  DisclosureGroup,
  DisclosurePanel,
  Heading,
  type DisclosureGroupProps,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";

export type MapAccordionItem = {
  id: string;
  title: string;
  content: ReactNode;
};

export type MapAccordionProps = Omit<
  DisclosureGroupProps,
  "children" | "allowsMultipleExpanded" | "className"
> & {
  items: MapAccordionItem[];
  className?: string;
};

const itemClassName = "group border-y border-secondary -mb-px";
const headingClassName =
  "sticky top-[var(--header-height,72px)] z-30 m-0 border-b border-secondary bg-base";
const triggerClassName =
  "flex w-full items-center justify-between gap-s px-4l py-m text-left focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-main";
const titleClassName = "text-title-small text-font-main";
const chevronClassName =
  "pointer-events-none h-[40px] w-[40px] flex-shrink-0 text-font-main transition-transform duration-300 rotate-180 group-data-[expanded]:rotate-0";
const panelClassName =
  "h-(--disclosure-panel-height) overflow-hidden duration-300 motion-safe:transition-[height] [hidden]:block";
const panelInnerClassName = "px-4l py-m text-text text-font-main bg-base";

export default function MapAccordion({ items, className, ...props }: MapAccordionProps) {
  return (
    <DisclosureGroup
      {...props}
      allowsMultipleExpanded
      aria-label="マップアコーディオン"
      className={twMerge("flex w-full flex-col bg-base", className)}
    >
      {items.map((item) => (
        <Disclosure key={item.id} id={item.id} className={itemClassName}>
          <Heading className={headingClassName}>
            <Button slot="trigger" className={triggerClassName}>
              <span className={titleClassName}>{item.title}</span>
              <ChevronUp aria-hidden className={chevronClassName} />
            </Button>
          </Heading>
          <DisclosurePanel className={panelClassName}>
            <div className={panelInnerClassName}>{item.content}</div>
          </DisclosurePanel>
        </Disclosure>
      ))}
    </DisclosureGroup>
  );
}
