"use client";

import { useState } from "react";
import { twMerge } from "tailwind-merge";

export type MapMenuEntry = {
  id: string;
  label: string;
  disabled?: boolean;
};

export type MapMenuSection = MapMenuEntry & {
  items?: MapMenuEntry[];
};

export type MapMenuProps = {
  sections?: MapMenuSection[];
  selectedId?: string;
  defaultSelectedId?: string;
  onSelectionChange?: (id: string) => void;
  className?: string;
};

export const defaultMapMenuSections = [
  {
    id: "overall",
    label: "全体",
  },
  {
    id: "lecture-building",
    label: "講義棟内",
    items: [
      { id: "lecture-building-1f", label: "１F" },
      { id: "lecture-building-2f", label: "２F" },
      { id: "lecture-building-3f", label: "３F" },
    ],
  },
  {
    id: "outdoor-area",
    label: "屋外エリア",
    items: [
      { id: "outdoor-overall", label: "屋外エリア全体" },
      { id: "office-area", label: "事務棟エリア" },
      { id: "library-area", label: "図書館エリア" },
      { id: "electrical-area", label: "電気棟エリア" },
      { id: "outdoor-stage-area", label: "屋外ステージエリア" },
      { id: "mechanical-civil-area", label: "機械建設棟エリア" },
      { id: "kitchen-car-area", label: "キッチンカーエリア" },
    ],
  },
  {
    id: "stamp-rally",
    label: "スタンプラリー",
  },
  {
    id: "mystery-solving",
    label: "謎解き",
  },
] satisfies MapMenuSection[];

const menuShellClassName =
  "sticky top-0 hidden min-h-svh w-[472px] shrink-0 items-start bg-base-dark py-4l pl-4l pr-pm md:flex";
const menuListClassName = "flex w-[292px] flex-col";
const menuItemClassName = "border-b border-secondary";
const rowClassName =
  "flex min-h-[72px] w-full items-center px-l py-m text-left transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-main";
const leafRowClassName = twMerge(rowClassName, "justify-start");
const parentRowClassName = twMerge(rowClassName, "justify-between");
const childListClassName = "flex w-full flex-col gap-xs px-ll pb-m pl-5l";
const childButtonClassName =
  "flex min-h-7 items-center text-left text-Ptext transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-main";

const selectableClassName = "cursor-pointer text-font-gray hover:text-font-main";
const selectedClassName = "text-font-main";
const disabledClassName = "cursor-not-allowed text-font-gray opacity-40";

function getEntryClassName(entry: MapMenuEntry, selectedId: string) {
  if (entry.disabled) {
    return disabledClassName;
  }

  return entry.id === selectedId ? selectedClassName : selectableClassName;
}

export default function MapMenu({
  sections = defaultMapMenuSections,
  selectedId,
  defaultSelectedId = defaultMapMenuSections[0].id,
  onSelectionChange,
  className,
}: MapMenuProps) {
  const [internalSelectedId, setInternalSelectedId] = useState(defaultSelectedId);
  const currentSelectedId = selectedId ?? internalSelectedId;

  const selectEntry = (entry: MapMenuEntry) => {
    if (entry.disabled) {
      return;
    }

    if (selectedId === undefined) {
      setInternalSelectedId(entry.id);
    }
    onSelectionChange?.(entry.id);
  };

  return (
    <nav aria-label="マップメニュー" className={twMerge(menuShellClassName, className)}>
      <ul className={menuListClassName}>
        {sections.map((section) => {
          const hasChildren = section.items !== undefined && section.items.length > 0;

          return (
            <li key={section.id} className={menuItemClassName}>
              <button
                type="button"
                className={twMerge(
                  hasChildren ? parentRowClassName : leafRowClassName,
                  "text-Ptext-large",
                  getEntryClassName(section, currentSelectedId),
                )}
                aria-current={section.id === currentSelectedId ? "true" : undefined}
                disabled={section.disabled}
                onClick={() => selectEntry(section)}
              >
                <span>{section.label}</span>
                {hasChildren && <span aria-hidden="true">ー</span>}
              </button>

              {hasChildren && (
                <ul className={childListClassName}>
                  {section.items?.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        className={twMerge(
                          childButtonClassName,
                          getEntryClassName(item, currentSelectedId),
                        )}
                        aria-current={item.id === currentSelectedId ? "true" : undefined}
                        disabled={item.disabled}
                        onClick={() => selectEntry(item)}
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
