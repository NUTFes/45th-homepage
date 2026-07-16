import Image from "next/image";

import EventInfoCard from "@/components/ui/EventInfoCard";
import EventIntroFrame from "@/components/ui/EventIntroFrame";
import SectionTitle from "@/components/ui/SectionTitle";


type EventCardProps = {
    eventName: string;
    eventImageSrc: string;
    eventImageAlt: string;
}

type ProgramDetailPageViewProps = {
    eventName: string;
    eventImageSrc: string;
    eventImageAlt: string;
    eventLocation: string;
    eventTitle: string;
    eventBody: string;
    locationTitle: string;
    locationImageSrc: string;
    locationImageAlt: string;
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

export default function ProgramDetailPageView() {
    return(
        <div >
            <div>
                <SectionTitle title="企画" />
                <EventCard eventName={eventName} eventImageSrc={eventImageSrc} />
            </div>
            <EventIntroFrame title={eventTitle} body={eventBody} />
            <EventInfoCard location={eventLocation} title={locationTitle} imageSrc={locationImageSrc} alt={locationImageAlt} />
        </div>
    )   
}