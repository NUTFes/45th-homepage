"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button, Disclosure, DisclosurePanel } from "react-aria-components";
import { twMerge } from "tailwind-merge";
import {
  defaultMapMenuSections,
  type MapMenuEntry,
  type MapMenuSection,
} from "./mapMenuData";

export type { MapMenuEntry, MapMenuSection };

export type MapMenuProps = {
  sections?: MapMenuSection[];
  selectedId?: string;
  defaultSelectedId?: string;
  defaultExpanded?: boolean;
  defaultExpandedIds?: string[];
  onSelect?: (id: string) => void;
  className?: string;
};

type MapMenuSectionWithItems = MapMenuSection & {
  items: MapMenuEntry[];
};

type SelectItem = (id: string, isDisabled: boolean) => void;

const cx = (...classNames: Array<string | false | null | undefined>) =>
  classNames.filter(Boolean).join(" ");

function hasChildItems(section: MapMenuSection): section is MapMenuSectionWithItems {
  return Array.isArray(section.items) && section.items.length > 0;
}

function isEnabledSelectableId(sections: MapMenuSection[], id: string) {
  return sections.some((section) => {
    if (hasChildItems(section)) {
      return !section.disabled && section.items.some((item) => item.id === id && !item.disabled);
    }

    return section.id === id && !section.disabled;
  });
}

function getFirstEnabledSelectableId(sections: MapMenuSection[]) {
  for (const section of sections) {
    if (hasChildItems(section)) {
      if (section.disabled) {
        continue;
      }

      const firstEnabledItem = section.items.find((item) => !item.disabled);

      if (firstEnabledItem !== undefined) {
        return firstEnabledItem.id;
      }

      continue;
    }

    if (!section.disabled) {
      return section.id;
    }
  }

  return undefined;
}

function getInitialSelectedId({
  sections,
  defaultSelectedId,
}: {
  sections: MapMenuSection[];
  defaultSelectedId?: string;
}) {
  if (defaultSelectedId !== undefined && isEnabledSelectableId(sections, defaultSelectedId)) {
    return defaultSelectedId;
  }

  return getFirstEnabledSelectableId(sections);
}

function sectionContainsSelectedId(section: MapMenuSectionWithItems, selectedId?: string) {
  if (selectedId === undefined) {
    return false;
  }

  return section.items.some((item) => item.id === selectedId);
}

function getDefaultExpandedState({
  section,
  selectedId,
  defaultExpanded,
  defaultExpandedIds,
}: {
  section: MapMenuSectionWithItems;
  selectedId?: string;
  defaultExpanded: boolean;
  defaultExpandedIds?: string[];
}) {
  if (sectionContainsSelectedId(section, selectedId)) {
    return true;
  }

  if (defaultExpandedIds !== undefined) {
    return defaultExpandedIds.includes(section.id);
  }

  return defaultExpanded;
}

function getSelectableVisualClassName({
  isDisabled,
  isSelected,
}: {
  isDisabled: boolean;
  isSelected: boolean;
}) {
  if (isDisabled) {
    return "cursor-not-allowed text-font-gray";
  }

  if (isSelected) {
    return "cursor-pointer font-bold text-main";
  }

  return "cursor-pointer text-font-main";
}

export default function MapMenu({
  sections = defaultMapMenuSections,
  selectedId,
  defaultSelectedId,
  defaultExpanded = true,
  defaultExpandedIds,
  onSelect,
  className,
}: MapMenuProps) {
  const [internalSelectedId, setInternalSelectedId] = useState<string | undefined>(() =>
    getInitialSelectedId({ sections, defaultSelectedId }),
  );

  const currentSelectedId = selectedId ?? internalSelectedId;

  const selectItem: SelectItem = (id, isDisabled) => {
    if (isDisabled) {
      return;
    }

    if (selectedId === undefined) {
      setInternalSelectedId(id);
    }

    onSelect?.(id);
  };

  return (
    <nav
      aria-label="マップメニュー"
      className={twMerge(
        "sticky top-0 hidden min-h-svh w-118 shrink-0 items-start bg-base-dark py-4l pr-pm pl-4l md:flex",
        className,
      )}
    >
      <ul className="flex w-73 flex-col">
        {sections.map((section) =>
          hasChildItems(section) ? (
            <MapMenuGroupSection
              key={section.id}
              section={section}
              selectedId={currentSelectedId}
              defaultExpanded={defaultExpanded}
              defaultExpandedIds={defaultExpandedIds}
              onSelect={selectItem}
            />
          ) : (
            <MapMenuLeafSection
              key={section.id}
              section={section}
              selectedId={currentSelectedId}
              onSelect={selectItem}
            />
          ),
        )}
      </ul>
    </nav>
  );
}

function MapMenuLeafSection({
  section,
  selectedId,
  onSelect,
}: {
  section: MapMenuEntry;
  selectedId?: string;
  onSelect: SelectItem;
}) {
  const isDisabled = Boolean(section.disabled);
  const isSelected = section.id === selectedId;

  return (
    <li className="border-b border-secondary">
      <button
        type="button"
        className={cx(
          "flex min-h-18 w-full items-center px-l py-m",
          "text-left text-Ptext-large",
          "focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-main",
          getSelectableVisualClassName({ isDisabled, isSelected }),
        )}
        disabled={isDisabled}
        aria-current={isSelected ? "location" : undefined}
        onClick={() => onSelect(section.id, isDisabled)}
      >
        {section.label}
      </button>
    </li>
  );
}

function MapMenuGroupSection({
  section,
  selectedId,
  defaultExpanded,
  defaultExpandedIds,
  onSelect,
}: {
  section: MapMenuSectionWithItems;
  selectedId?: string;
  defaultExpanded: boolean;
  defaultExpandedIds?: string[];
  onSelect: SelectItem;
}) {
  const isDisabled = Boolean(section.disabled);
  const containsSelectedItem = sectionContainsSelectedId(section, selectedId);

  return (
    <li className="border-b border-secondary">
      <Disclosure
        className="group"
        defaultExpanded={getDefaultExpandedState({
          section,
          selectedId,
          defaultExpanded,
          defaultExpandedIds,
        })}
      >
        <Button
          slot="trigger"
          className={cx(
            "flex min-h-18 w-full items-center justify-between gap-s px-l py-m text-Ptext-large",
            "text-left focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-main",
            isDisabled ? "cursor-not-allowed text-font-gray" : "cursor-pointer text-font-main",
          )}
          isDisabled={isDisabled}
          aria-label={`${section.label}を開閉`}
        >
          <span
            className={cx(
              "min-w-0 flex-1",
              containsSelectedItem && !isDisabled && "font-bold text-main",
            )}
          >
            {section.label}
          </span>

          <span
            aria-hidden="true"
            className="relative flex size-8 shrink-0 items-center justify-center"
          >
            <Plus className="absolute size-5 opacity-100 group-data-expanded:opacity-0" />
            <Minus className="absolute size-5 opacity-0 group-data-expanded:opacity-100" />
          </span>
        </Button>

        <DisclosurePanel className="h-(--disclosure-panel-height) overflow-hidden motion-safe:transition-[height] motion-safe:duration-300 [hidden]:block">
          <ul className="flex w-full flex-col gap-xs px-ll pb-m pl-5l">
            {section.items.map((item) => (
              <MapMenuChildItem
                key={item.id}
                item={item}
                parentDisabled={isDisabled}
                selectedId={selectedId}
                onSelect={onSelect}
              />
            ))}
          </ul>
        </DisclosurePanel>
      </Disclosure>
    </li>
  );
}

function MapMenuChildItem({
  item,
  parentDisabled,
  selectedId,
  onSelect,
}: {
  item: MapMenuEntry;
  parentDisabled: boolean;
  selectedId?: string;
  onSelect: SelectItem;
}) {
  const isDisabled = parentDisabled || Boolean(item.disabled);
  const isSelected = item.id === selectedId;

  return (
    <li>
      <button
        type="button"
        className={cx(
          "flex min-h-7 items-center text-left text-Ptext",
          "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-main",
          getSelectableVisualClassName({ isDisabled, isSelected }),
        )}
        disabled={isDisabled}
        aria-current={isSelected ? "location" : undefined}
        onClick={() => onSelect(item.id, isDisabled)}
      >
        {item.label}
      </button>
    </li>
  );
}
