"use client";

import type { ReactNode } from "react";
import Image from "next/image";

import EventSection, { type EventSectionEvent } from "@/modules/event/ui/EventSection";
import ButtonMain from "@/components/ui/ButtonMain";
import SectionTitle from "@/components/ui/SectionTitle";
import { TOP_PROGRAM_LIMIT_PER_CATEGORY } from "@/lib/events/constants";
import ProgramFilterControls, {
  useProgramFilters,
} from "@/modules/event/programs/ProgramFilterControls";
import {
  filterEventCategoriesByPrograms,
  flattenEventCategories,
  toEventFrameProps,
} from "@/modules/events/presentation";
import type { EventsPageDTO } from "@/modules/events/types";

type EventPageViewProps = {
  data: EventsPageDTO;
  sponsorAds: ReactNode;
};

export default function EventPageView({ data, sponsorAds }: EventPageViewProps) {
  const filterController = useProgramFilters(flattenEventCategories(data.categories), "event");
  const visibleCategories = filterEventCategoriesByPrograms(
    data.categories,
    filterController.visiblePrograms,
  );
  const eventSections = visibleCategories.flatMap((category) => {
    if (category.programs.length === 0) {
      return [];
    }

    const events: EventSectionEvent[] = category.programs
      .slice(0, TOP_PROGRAM_LIMIT_PER_CATEGORY)
      .map((program) => ({
        id: program.id,
        ...toEventFrameProps(program),
      }));

    return [
      {
        id: category.category,
        title: category.label,
        viewAllHref: `/event/programs/category/${category.category}`,
        events,
      },
    ];
  });

  return (
    <div className="flex flex-col bg-base pb-4l">
      <div className="flex flex-col gap-4l md:gap-5l">
        <ProgramFilterControls
          controller={filterController}
          filterVariant="event"
          title="企画情報"
        />
        <section aria-label="ゲスト" className="flex flex-col gap-m md:gap-ll">
          <div className="md:px-pl">
            <SectionTitle title="ゲスト" />
          </div>
          <div className="flex flex-col gap-m md:gap-3l">
            <div className="flex justify-center bg-secondary/20">
              <div className="relative aspect-square w-full md:w-180">
                <Image
                  src="/image/event/guest_decoration.webp"
                  alt="ヨネダ2000"
                  fill
                  priority
                  sizes="(min-width: 768px) 720px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex justify-center">
              <ButtonMain href="/event/guest" title="ゲストページを見る" />
            </div>
          </div>
        </section>
        <section aria-label="イベント・販売" className="flex flex-col gap-s md:gap-ll">
          <div className="md:px-pl">
            <SectionTitle title="イベント・販売" />
          </div>
          <div className="flex flex-col gap-3l bg-base-dark md:gap-5l md:py-4l">
            {filterController.isCheckingActivePrograms ? (
              <p className="px-ll text-center text-text text-font-main md:text-Ptext">
                開催中の企画を確認しています
              </p>
            ) : (
              eventSections.map((section) => <EventSection key={section.id} {...section} />)
            )}
            {!filterController.isCheckingActivePrograms && eventSections.length === 0 ? (
              <p className="px-ll text-center text-text text-font-main md:text-Ptext">
                {filterController.hasFilters
                  ? "条件に一致する企画はありません"
                  : "公開中の企画はありません"}
              </p>
            ) : null}
          </div>
        </section>
      </div>
      <div className="mt-4l md:mt-pm">{sponsorAds}</div>
    </div>
  );
}
