import Image from "next/image";

import EventInfoCard from "@/components/ui/EventInfoCard";
import EventIntroFrame from "@/components/ui/EventIntroFrame";
import SectionTitle from "@/components/ui/SectionTitle";


function EventCard() {
    return(
        <div>
            <h1></h1>
            <div>
                <Image />
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