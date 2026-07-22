import Image from "next/image";

import EventInfoCard from "@/components/ui/EventInfoCard";
import EventIntroFrame from "@/components/ui/EventIntroFrame";
import SectionTitle from "@/components/ui/SectionTitle";

import type { EventInfoCardProps } from "@/components/ui/EventInfoCard";  
import type { EventIntroFrameProps } from "@/components/ui/EventIntroFrame";

type EventHeroProps = {
    title: string;
    imageSrc: string;
    imageAlt: string;
}

export type ProgramDetailPageViewProps = {
    hero: EventHeroProps;
    intro: EventIntroFrameProps;
    info: EventInfoCardProps;
}

function EventHero({ title, imageSrc, imageAlt }: EventHeroProps) {
    return (
        <div className="flex flex-col gap-ss md:gap-s">
            <h1 className="text-center font-kaisotai text-title wrap-break-word text-font-main md:text-Ptitle">
                {title}
            </h1>
            {/* 画像 + タグ: タグ実装時に gap-s(16px) が効く受け皿として分けている。PC は左右に 4l(60px) の余白 */}
            <div className="flex flex-col gap-s md:px-4l">
                <div className="relative aspect-square w-full overflow-hidden border-2 border-main bg-base-dark">
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
    )
}

export default function ProgramDetailPageView({ hero, intro, info }: ProgramDetailPageViewProps) {
    return (
        <div className="flex flex-col gap-4l py-4l md:flex-row md:py-0 md:pl-pm">
            {/* PC は左:右 = 609:491。basis 0 + grow 比でカラム面積を比率どおりに分ける */}
            <div className="flex flex-col gap-4l md:min-w-0 md:flex-[609_1_0] md:gap-3l md:py-5l">
                <div className="flex flex-col gap-s md:gap-xs">
                    <SectionTitle title="企画" />
                    {/* px-[52.5px] は Figma のスマホ版インデント。PC は EventHero 内側の md:px-4l に任せるため 0 */}
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
    )
}