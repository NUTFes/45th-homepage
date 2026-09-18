"use client";

import type { ReactNode } from "react";
import Image from "next/image";

import EventFrame from "@/components/ui/EventFrame";
import SectionTitle from "@/components/ui/SectionTitle";
import type { CategoryMenuVariant } from "@/modules/event/ui/categoryMenuData";
import { toEventFrameProps } from "@/modules/events/presentation";
import type { EventProgramDTO } from "@/modules/events/types";

import ProgramFilterControls, { useProgramFilters } from "./ProgramFilterControls";

export type ProgramListPageViewProps = {
  title: string;
  programs: readonly EventProgramDTO[];
  filterVariant: CategoryMenuVariant;
  sponsorAds: ReactNode;
};

export default function ProgramListPageView({
  title,
  programs,
  filterVariant,
  sponsorAds,
}: ProgramListPageViewProps) {
  const filterController = useProgramFilters(programs, filterVariant);

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

        <div className="relative z-10 flex flex-col gap-4l">
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
            filterVariant={filterVariant}
            title={title}
          />
          <section aria-label={`${title}の企画一覧`} className="flex flex-col gap-l">
            <div className="md:pl-pl">
              <SectionTitle title={title} />
            </div>
            <div className="md:px-pm">
              {filterController.isCheckingActivePrograms ? (
                <p className="px-l py-4l text-center text-textb text-font-main md:text-Ptext">
                  開催中の企画を確認しています
                </p>
              ) : filterController.visiblePrograms.length > 0 ? (
                <ul className="grid grid-cols-[repeat(2,max-content)] justify-center gap-x-m gap-y-3l md:mx-auto md:max-w-385 md:grid-cols-[repeat(auto-fit,16.25rem)] md:content-start md:gap-x-4l md:gap-y-pm">
                  {filterController.visiblePrograms.map((program) => (
                    <li key={program.id}>
                      <EventFrame {...toEventFrameProps(program)} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-l py-4l text-center text-textb text-font-main md:text-Ptext">
                  {programs.length === 0
                    ? "公開中の企画はありません"
                    : filterController.hasFilters
                      ? "条件に一致する企画はありません"
                      : "公開中の企画はありません"}
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
      <div className="mt-4l md:mt-pm">{sponsorAds}</div>
    </div>
  );
}
