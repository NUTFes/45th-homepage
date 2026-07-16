import Image from "next/image";

import EventInfoCard from "@/components/ui/EventInfoCard";
import EventIntroFrame from "@/components/ui/EventIntroFrame";
import SectionTitle from "@/components/ui/SectionTitle";

import type { EventInfoCardProps } from "@/components/ui/EventInfoCard";  
import type { EventIntroFrameProps } from "@/components/ui/EventIntroFrame";

type EventCardProps = {
    eventName: string;
    eventImageSrc: string;
    eventImageAlt: string;
}

type ProgramDetailPageViewProps = {
    hero: EventCardProps;
    intro: EventIntroFrameProps;
    info: EventInfoCardProps;
}

function EventCard({ eventName, eventImageSrc, eventImageAlt}: EventCardProps) {
    return(
        <div>
            <h1>{eventName}</h1>
            <div>
                <Image src={eventImageSrc} alt={eventImageAlt} />
            </div>
        </div>
    )
}

export default function ProgramDetailPageView({ hero, intro, info }: ProgramDetailPageViewProps) {
    return(
        <div >
            <div>
                <SectionTitle title="企画" />
                <EventCard {...hero} />
            </div>
            <EventIntroFrame {...intro} />
            <EventInfoCard {...info} />
        </div>
    )   
}