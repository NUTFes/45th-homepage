"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "react-aria-components";

import ActiveTag from "@/modules/event/ui/ActiveTag";
import CategoryMenu from "@/modules/event/ui/CategoryMenu";
import TagSearchButton from "@/modules/event/ui/TagSearchButton";
import {
  categoryMenuItems,
  type CategoryFilterDefinition,
  type CategoryMenuVariant,
} from "@/modules/event/ui/categoryMenuData";
import type { EventProgramDTO } from "@/modules/events/types";

import { filterPrograms } from "./programFilters";

export type ProgramFilterController = {
  activeOnly: boolean;
  definitions: readonly CategoryFilterDefinition[];
  hasFilters: boolean;
  isCheckingActivePrograms: boolean;
  isMenuOpen: boolean;
  replaceActiveOnly: (isSelected: boolean) => void;
  replaceFilters: (values: readonly string[]) => void;
  selectedFilterValues: string[];
  setIsMenuOpen: (isOpen: boolean) => void;
  visiblePrograms: EventProgramDTO[];
};

type ProgramFilterControlsProps = {
  controller: ProgramFilterController;
  filterVariant: CategoryMenuVariant;
  title: string;
};

const DIALOG_TRANSITION_MS = 300;

function buildHref(pathname: string, params: URLSearchParams) {
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function useProgramFilters(
  programs: readonly EventProgramDTO[],
  filterVariant: CategoryMenuVariant,
): ProgramFilterController {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const definitions = categoryMenuItems[filterVariant];
  const definitionByValue = useMemo(
    () =>
      new Map<string, CategoryFilterDefinition>(
        definitions.map((definition) => [definition.value, definition]),
      ),
    [definitions],
  );
  const selectedFilterValues = useMemo(() => {
    const values = searchParams.get("filters")?.split(",") ?? [];
    return Array.from(new Set(values.filter((value) => definitionByValue.has(value))));
  }, [definitionByValue, searchParams]);
  const activeOnly = searchParams.get("active") === "1";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    if (!activeOnly) {
      setNow(null);
      return;
    }

    const updateNow = () => setNow(new Date());
    updateNow();
    const intervalId = window.setInterval(updateNow, 60_000);
    return () => window.clearInterval(intervalId);
  }, [activeOnly]);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

  const replaceFilters = (values: readonly string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    if (values.length > 0) {
      params.set("filters", values.join(","));
    } else {
      params.delete("filters");
    }
    router.replace(buildHref(pathname, params), { scroll: false });
  };

  const replaceActiveOnly = (isSelected: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (isSelected) {
      params.set("active", "1");
    } else {
      params.delete("active");
    }
    router.replace(buildHref(pathname, params), { scroll: false });
  };

  return {
    activeOnly,
    definitions,
    hasFilters: selectedFilterValues.length > 0 || activeOnly,
    isCheckingActivePrograms: activeOnly && now === null,
    isMenuOpen,
    replaceActiveOnly,
    replaceFilters,
    selectedFilterValues,
    setIsMenuOpen,
    visiblePrograms: filterPrograms(programs, definitions, {
      selectedFilterValues,
      activeOnly,
      now: now ?? new Date(0),
    }),
  };
}

export default function ProgramFilterControls({
  controller,
  filterVariant,
  title,
}: ProgramFilterControlsProps) {
  const drawerId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    let firstFrame = 0;
    let secondFrame = 0;
    let closeTimer = 0;

    if (controller.isMenuOpen) {
      if (!dialog.open) {
        setIsDialogVisible(false);
        dialog.showModal();
        closeButtonRef.current?.focus();
      }

      firstFrame = window.requestAnimationFrame(() => {
        secondFrame = window.requestAnimationFrame(() => setIsDialogVisible(true));
      });
    } else {
      setIsDialogVisible(false);
      if (dialog.open) {
        const closeDelay = window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? 0
          : DIALOG_TRANSITION_MS;
        closeTimer = window.setTimeout(() => dialog.close(), closeDelay);
      }
    }

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      window.clearTimeout(closeTimer);
    };
  }, [controller.isMenuOpen]);
  const definitionByValue = useMemo(
    () =>
      new Map<string, CategoryFilterDefinition>(
        controller.definitions.map((definition) => [definition.value, definition]),
      ),
    [controller.definitions],
  );

  return (
    <>
      <div
        aria-label={`${title}の絞り込み`}
        className="flex flex-col gap-ss bg-base pb-ss md:gap-xs md:pb-xs"
      >
        <div className="flex items-center justify-between gap-s bg-base-dark px-l py-m shadow-[0_2px_6px_0_var(--color-base)] md:px-pm">
          <Checkbox
            aria-label="開催中の企画だけを表示"
            className="group flex cursor-pointer items-center gap-xs rounded-sm text-textb text-font-main focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main md:text-Ptext"
            isSelected={controller.activeOnly}
            onChange={controller.replaceActiveOnly}
          >
            {({ isSelected }) => (
              <>
                <span
                  aria-hidden="true"
                  className={`flex size-5 items-center justify-center border-2 border-main ${
                    isSelected ? "bg-main text-base-dark" : "bg-base-dark"
                  }`}
                >
                  {isSelected ? <Check className="size-4" strokeWidth={3} /> : null}
                </span>
                <span>開催中のみ表示</span>
              </>
            )}
          </Checkbox>
          {controller.definitions.length > 0 ? (
            <TagSearchButton
              aria-controls={drawerId}
              aria-expanded={controller.isMenuOpen}
              aria-haspopup="dialog"
              onPress={() => controller.setIsMenuOpen(true)}
            />
          ) : null}
        </div>
        {controller.selectedFilterValues.length > 0 ? (
          <div aria-label="選択中のタグ" className="flex flex-wrap gap-ss px-m md:gap-s md:px-pm">
            {controller.selectedFilterValues.map((value) => {
              const definition = definitionByValue.get(value);
              if (!definition) {
                return null;
              }

              return (
                <ActiveTag
                  key={value}
                  label={definition.label}
                  onPress={() =>
                    controller.replaceFilters(
                      controller.selectedFilterValues.filter((item) => item !== value),
                    )
                  }
                />
              );
            })}
          </div>
        ) : null}
      </div>

      <div className="[--header-height:72px]">
        <dialog
          ref={dialogRef}
          id={drawerId}
          aria-label={`${title}のタグ検索`}
          className="fixed top-(--header-height) right-0 bottom-0 left-0 m-0 h-[calc(100dvh-var(--header-height))] max-h-none w-full max-w-none overflow-hidden border-0 bg-transparent p-0 text-inherit backdrop:bg-transparent"
          onCancel={(event) => {
            event.preventDefault();
            controller.setIsMenuOpen(false);
          }}
          onClose={() => {
            setIsDialogVisible(false);
            controller.setIsMenuOpen(false);
          }}
        >
          <div
            className={`relative z-10 ml-auto h-full w-full scrollbar-gutter-stable overflow-y-auto overscroll-contain bg-base ease-out will-change-transform motion-safe:transition-transform motion-safe:duration-300 md:w-126 md:bg-base-dark ${
              isDialogVisible ? "translate-x-0" : "translate-x-full ease-in"
            }`}
          >
            <CategoryMenu
              closeButtonRef={closeButtonRef}
              variant={filterVariant}
              value={controller.selectedFilterValues}
              onChange={controller.replaceFilters}
              onClose={() => controller.setIsMenuOpen(false)}
            />
          </div>
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            className={`absolute inset-0 bg-base/40 ease-out motion-safe:transition-opacity motion-safe:duration-300 ${
              isDialogVisible ? "opacity-100" : "opacity-0 ease-in"
            }`}
            onClick={() => controller.setIsMenuOpen(false)}
          />
        </dialog>
      </div>
    </>
  );
}
