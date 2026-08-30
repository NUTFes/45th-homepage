import Image from "next/image";
import type { ReactNode } from "react";

import EventInfoCard, { type EventInfoCardProps } from "@/components/ui/EventInfoCard";
import EventIntroFrame, { type EventIntroFrameProps } from "@/components/ui/EventIntroFrame";
import SectionTitle from "@/components/ui/SectionTitle";
import ProgramTagBadge from "@/modules/event/programs/ProgramTagBadge";
import type { EventProgramTagDTO } from "@/modules/events/types";

type EventHeroProps = {
  title: string;
  imageSrc?: string;
  imageAlt: string;
  tags: readonly EventProgramTagDTO[];
};

export type ProgramDetailPageViewProps = {
  hero: EventHeroProps;
  intro: EventIntroFrameProps;
  info: EventInfoCardProps;
  sponsorAds: ReactNode;
};

function EventHero({ title, imageSrc, imageAlt, tags }: EventHeroProps) {
  return (
    <div className="flex flex-col gap-ss md:gap-xs">
      <h1 className="text-center font-sans font-medium text-title wrap-break-word text-font-main md:text-Ptitle">
        {title}
      </h1>
      <div className="flex flex-col gap-s md:px-4l">
        <div className="relative mx-auto flex aspect-square w-full max-w-160 items-center justify-center overflow-hidden border-2 border-main bg-base-dark">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-contain"
              sizes="(min-width: 768px) 400px, 100vw"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-center text-main">
              <p className="font-kaisotai text-[24px] md:text-title">NO IMAGE</p>
            </div>
          )}
        </div>
        {tags.length > 0 ? (
          <div
            aria-label="企画タグ"
            className="mx-auto flex w-full max-w-160 flex-wrap justify-start gap-ss"
          >
            {tags.map((tag) => (
              <ProgramTagBadge key={tag.value} label={tag.label} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function ProgramDetailPageView({
  hero,
  info,
  intro,
  sponsorAds,
}: ProgramDetailPageViewProps) {
  return (
    <div className="relative min-h-dvh overflow-x-clip bg-base">
      <Image
        src="/image/PageBack2.svg"
        alt=""
        aria-hidden="true"
        width={275}
        height={275}
        className="pointer-events-none absolute bottom-0 left-0 z-0 hidden md:block"
      />
      <div className="relative z-10 flex flex-col gap-4l py-4l md:mb-pm md:flex-row md:gap-pm md:py-0 md:pl-pm">
        <div className="relative isolate flex flex-col gap-4l md:min-w-0 md:flex-[609_1_0] md:gap-3l md:py-5l">
          <Image
            src="/image/PageBack1.svg"
            alt=""
            aria-hidden="true"
            width={275}
            height={275}
            className="pointer-events-none absolute top-0 right-0 z-0 hidden md:-right-pm md:block"
          />

          <div className="relative z-10 flex flex-col gap-s">
            <div className="md:hidden">
              <SectionTitle title="企画" />
            </div>
            <div className="px-[52.5px] md:px-0">
              <EventHero {...hero} />
            </div>
          </div>
          <div className="relative z-10 px-ll md:px-0">
            <EventIntroFrame {...intro} />
          </div>
        </div>

        <aside className="relative bg-base-dark md:min-w-0 md:flex-[491_1_0]">
          <EventInfoCard {...info} />
        </aside>
      </div>

      {sponsorAds}
    </div>
  );
}
