"use client";

import { useEffect, useRef } from "react";

type TimetableTabItem = {
  id: string;
  name: string;
};

type TimetableTabsProps = {
  ariaLabel: string;
  controlName: string;
  items: readonly TimetableTabItem[];
  onChange: (itemId: string) => void;
  selectedItemId?: string | null;
};

export default function TimetableTabs({
  ariaLabel,
  controlName,
  items,
  onChange,
  selectedItemId,
}: TimetableTabsProps) {
  const scrollContainerRef = useRef<HTMLFieldSetElement>(null);
  const tabRefs = useRef(new Map<string, HTMLLabelElement>());

  useEffect(() => {
    if (!selectedItemId) {
      return;
    }

    const scrollContainer = scrollContainerRef.current;
    const selectedTab = tabRefs.current.get(selectedItemId);
    if (!scrollContainer || !selectedTab) {
      return;
    }

    const containerRect = scrollContainer.getBoundingClientRect();
    const tabRect = selectedTab.getBoundingClientRect();
    let left = scrollContainer.scrollLeft;

    if (tabRect.left < containerRect.left) {
      left -= containerRect.left - tabRect.left;
    } else if (tabRect.right > containerRect.right) {
      left += tabRect.right - containerRect.right;
    } else {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scrollContainer.scrollTo({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      left,
    });
  }, [selectedItemId]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-base">
      <fieldset
        className="relative w-full min-w-0 [scrollbar-width:thin] overflow-x-auto pt-4l"
        ref={scrollContainerRef}
      >
        <legend className="sr-only">{ariaLabel}</legend>
        <div className="flex min-w-max items-end px-xs md:px-pm">
          {items.map((item) => (
            <label
              key={item.id}
              className="cursor-pointer"
              ref={(node) => {
                if (node) {
                  tabRefs.current.set(item.id, node);
                } else {
                  tabRefs.current.delete(item.id);
                }
              }}
            >
              <input
                checked={selectedItemId === item.id}
                className="peer sr-only"
                name={controlName}
                onChange={() => onChange(item.id)}
                type="radio"
                value={item.id}
              />
              <span className="flex h-14 w-25 items-center justify-center rounded-t-lg border-2 border-b-0 border-main px-ss text-center text-textb font-bold text-font-main transition-colors peer-checked:bg-secondary peer-checked:text-base-dark peer-checked:shadow-[0_0_6px_var(--color-base-shadow)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-main md:h-17 md:w-30 md:px-s md:text-Pbutton">
                {item.name}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="hidden h-0.5 bg-main md:block" aria-hidden="true" />
    </div>
  );
}
