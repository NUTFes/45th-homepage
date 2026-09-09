import Link from "next/link";

import EventCarousel, { type EventCarouselEvent } from "./EventCarousel";

type EventSectionProps = {
  title: string;
  viewAllHref: string;
  id: string;
  events: readonly EventSectionEvent[];
};

export type EventSectionEvent = EventCarouselEvent;

export default function EventSection({ title, viewAllHref, id, events }: EventSectionProps) {
  return (
    <section aria-labelledby={`section-${id}`} className="flex flex-col gap-ss md:gap-s">
      <div className="flex items-center justify-between pr-m pl-l md:px-pm">
        <div
          id={`section-${id}`}
          className="font-kaisotai text-title text-font-main md:text-Ptitle md:leading-normal"
        >
          {title}
        </div>
        <Link
          aria-label={`${title}をすべて表示`}
          href={viewAllHref}
          className="text-text text-font-main md:text-Ptext-large"
        >
          すべて表示
        </Link>
      </div>
      <EventCarousel ariaLabel={`${title}カルーセル`} events={events} />
    </section>
  );
}
