"use client";

import type { ReactNode } from "react";
import Image from "next/image";

import EventSection, { type EventSectionEvent } from "@/modules/event/ui/EventSection";
import ButtonMain from "@/components/ui/ButtonMain";
import SectionTitle from "@/components/ui/SectionTitle";
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

    const events: EventSectionEvent[] = category.programs.map((program) => ({
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
      <div className="relative z-0 overflow-hidden">
        <Image
          src="/image/PageBack2.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 z-0 hidden md:block"
          width={200}
          height={200}
        />

        <div className="relative z-10 flex flex-col gap-4l md:gap-5l">
          <ProgramFilterControls
            barBottomDecoration={
              <Image
                src="/image/PageBack1.svg"
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute top-full right-0 z-0 hidden md:block"
                width={200}
                height={200}
              />
            }
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
          <div className="pb-s md:px-pl md:pb-ll">
            <SectionTitle title="イベント・販売" />
          </div>
        </div>
      </div>

      <section aria-label="イベント・販売">
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

      <div className="mt-4l md:mt-pm">{sponsorAds}</div>
    </div>
  );
}
