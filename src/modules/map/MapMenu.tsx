"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button, Disclosure, DisclosurePanel } from "react-aria-components";
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
const rowClassName = "flex min-h-[72px] w-full items-center px-l py-m text-Ptext-large";
const leafButtonClassName = twMerge(
  rowClassName,
  "focus-visible:outline-inset text-left focus-visible:outline-2 focus-visible:outline-main",
);
const parentRowClassName = twMerge(rowClassName, "justify-between gap-s");
const parentButtonClassName =
  "min-w-0 flex-1 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-main";
const disclosureButtonClassName =
  "group/trigger relative flex size-10 shrink-0 items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-main disabled:cursor-not-allowed";
const childListClassName = "flex w-full flex-col gap-xs px-ll pb-m pl-5l";
const childButtonClassName =
  "flex min-h-7 items-center text-left text-Ptext focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-main";

const selectableClassName = "cursor-pointer text-font-main";
const selectedClassName = "text-font-main";
const disabledClassName = "cursor-not-allowed text-font-gray";

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
              {hasChildren ? (
                <Disclosure defaultExpanded className="group">
                  <div className={parentRowClassName}>
                    <button
                      type="button"
                      className={twMerge(
                        parentButtonClassName,
                        getEntryClassName(section, currentSelectedId),
                      )}
                      aria-current={section.id === currentSelectedId ? "true" : undefined}
                      disabled={section.disabled}
                      onClick={() => selectEntry(section)}
                    >
                      {section.label}
                    </button>
                    <Button
                      slot="trigger"
                      className={twMerge(
                        disclosureButtonClassName,
                        section.disabled ? disabledClassName : selectedClassName,
                      )}
                      isDisabled={section.disabled}
                      aria-label={`${section.label}を開閉`}
                    >
                      <Plus
                        aria-hidden="true"
                        className="absolute size-5 opacity-100 group-data-expanded:opacity-0"
                      />
                      <Minus
                        aria-hidden="true"
                        className="absolute size-5 opacity-0 group-data-expanded:opacity-100"
                      />
                    </Button>
                  </div>
                  <DisclosurePanel className="h-(--disclosure-panel-height) overflow-hidden duration-300 motion-safe:transition-[height] [hidden]:block">
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
                  </DisclosurePanel>
                </Disclosure>
              ) : (
                <button
                  type="button"
                  className={twMerge(
                    leafButtonClassName,
                    getEntryClassName(section, currentSelectedId),
                  )}
                  aria-current={section.id === currentSelectedId ? "true" : undefined}
                  disabled={section.disabled}
                  onClick={() => selectEntry(section)}
                >
                  <span>{section.label}</span>
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
