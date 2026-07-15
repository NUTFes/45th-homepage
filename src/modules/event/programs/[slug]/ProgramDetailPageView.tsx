import Image from "next/image";

import EventInfoCard from "@/components/ui/EventInfoCard";
import EventIntroFrame from "@/components/ui/EventIntroFrame";
import SectionTitle from "@/components/ui/SectionTitle";


type EventCardProps = {
    eventName: string;
    eventImageSrc: string;
}

function EventCard({ eventName, eventImageSrc }: EventCardProps) {
    return(
        <div>
            <h1>{eventName}</h1>
            <div>
                <Image src={eventImageSrc} alt={eventName} />
            </div>
        </div>
    )
}

export default function ProgramDetailPageView() {
    return(
        <div >
            <div>
                <SectionTitle title="企画" />
                <EventCard />
            </div>
            <EventIntroFrame />
            <EventInfoCard />
        </div>
    )   
}