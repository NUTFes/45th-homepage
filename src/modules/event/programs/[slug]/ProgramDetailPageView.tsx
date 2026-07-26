import Image from "next/image";

import EventInfoCard, { type EventInfoCardProps } from "@/components/ui/EventInfoCard";
import EventIntroFrame, { type EventIntroFrameProps } from "@/components/ui/EventIntroFrame";
import SectionTitle from "@/components/ui/SectionTitle";

type EventHeroProps = {
  title: string;
  imageSrc: string;
  imageAlt: string;
};

export type ProgramDetailPageViewProps = {
  hero: EventHeroProps;
  intro: EventIntroFrameProps;
  info: EventInfoCardProps;
};

function EventHero({ title, imageSrc, imageAlt }: EventHeroProps) {
  return (
    <div className="flex flex-col gap-ss md:gap-xs">
      <h1 className="text-center font-kaisotai text-title wrap-break-word text-font-main md:text-Ptitle">
        {title}
      </h1>
      <div className="flex flex-col gap-s md:px-4l">
        <div className="relative mx-auto aspect-square w-full max-w-160 overflow-hidden border-2 border-main bg-base-dark">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-contain"
            sizes="(min-width: 768px) 400px, 100vw"
          />
        </div>
        {/* TODO: タグ（今回は作成しない） */}
      </div>
    </div>
  );
}

export default function ProgramDetailPageView({ hero, intro, info }: ProgramDetailPageViewProps) {
  return (
    <div className="flex flex-col gap-4l py-4l md:flex-row md:py-0 md:pl-pm md:gap-pm">
      <div className="flex flex-col gap-4l md:min-w-0 md:flex-[609_1_0] md:gap-3l md:py-5l">
        <div className="flex flex-col gap-s">
          <div className="md:hidden">
            <SectionTitle title="企画" />
          </div>
          <div className="px-[52.5px] md:px-0">
            <EventHero {...hero} />
          </div>
        </div>
        <div className="px-ll md:px-0">
          <EventIntroFrame {...intro} />
        </div>
      </div>
      <div className="md:min-w-0 md:flex-[491_1_0]">
        <EventInfoCard {...info} />
      </div>
    </div>
  );
}
