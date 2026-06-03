import EventFrame, { type EventFrameProps } from "@/components/ui/EventFrame";
import Link from "next/link";

type EventSectionProps = {
  title: string;
  viewAllHref: string;
  id: string;
  events: EventFrameProps[];
};

export default function EventSection({ title, viewAllHref, id, events }: EventSectionProps) {
  return (
    <section aria-labelledby={`section-${id}`} className="flex flex-col gap-ss">
      <div className="flex items-center justify-between pr-m pl-l">
        <div id={`section-${id}`} className="font-kaisotai text-title text-font-main">
          {title}
        </div>
        <Link
          aria-label={`${title}をすべて表示`}
          href={viewAllHref}
          className="text-text text-font-main"
        >
          すべて表示
        </Link>
      </div>
      <ul role="list" className="flex gap-s overflow-x-auto px-ll [scrollbar-width:none]">
        {events.map((event) => (
          <li key={event.href} className="shrink-0">
            <EventFrame {...event} />
          </li>
        ))}
      </ul>
    </section>
  );
}
