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

// 孫1-1 の中身: 企画名 + 画像（SponsorCard のマークアップを参考に）
function EventHero({ title, imageSrc, imageAlt }: EventHeroProps) {
    return (
        <div className="flex w-full flex-col items-center gap-s">
            <h1 className="max-w-full text-center font-kaisotai text-title wrap-break-word text-font-main">
                {title}
            </h1>
            <div className="relative aspect-square w-full max-w-80 overflow-hidden border-2 border-main bg-base-dark">
                <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    className="object-contain"
                    sizes="320px"
                />
            </div>
        </div>
    )
}

export default function ProgramDetailPageView({ hero, intro, info }: ProgramDetailPageViewProps) {
    return (
        // 大枠: flex-col / gap 60 / padding top,down 60
        <div className="flex flex-col gap-4l py-4l">
            {/* 子要素1: flex-col / gap 60 */}
            <div className="flex flex-col gap-4l">
                {/* 孫1-1: flex-col / gap 16 */}
                <div className="flex flex-col gap-s">
                    <SectionTitle title="企画" />
                    <EventHero {...hero} />
                </div>
                {/* 孫1-2: padding left,right 32 */}
                <div className="px-ll">
                    <EventIntroFrame {...intro} />
                </div>
            </div>
            {/* メモには未記載だが画像2に対応する要素として大枠の子に配置 */}
            <EventInfoCard {...info} />
        </div>
    )
}