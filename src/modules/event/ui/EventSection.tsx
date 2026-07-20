import EventFrame, { type EventFrameProps } from "@/components/ui/EventFrame";
import {
  CarouselNextButton,
  CarouselPrevButton,
  CarouselRoot,
  CarouselSlide,
  CarouselViewport,
} from "@/components/ui/carousel";
import Link from "next/link";

type EventSectionProps = {
  title: string;
  viewAllHref: string;
  id: string;
  events: EventSectionEvent[];
};

export type EventSectionEvent = EventFrameProps & {
  id: string;
};

export default function EventSection({ title, viewAllHref, id, events }: EventSectionProps) {
  return (
    <section aria-labelledby={`section-${id}`}>
      <CarouselRoot
        ariaLabel={`${title}カルーセル`}
        className="@container flex flex-col gap-ss md:gap-s"
        loop={false}
        navigationStep="half-visible"
        options={{
          active: false,
          breakpoints: {
            "(min-width: 768px)": { active: true },
          },
          containScroll: "trimSnaps",
        }}
        slideCount={events.length}
      >
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
        <div className="flex items-center justify-center md:gap-ll md:px-pm">
          <CarouselPrevButton
            className="-mx-xs hidden size-11 items-center justify-center rounded-full text-font-main transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main disabled:cursor-default disabled:opacity-60 md:flex"
            label="前の企画へ"
          >
            <EventSectionArrow direction="left" />
          </CarouselPrevButton>
          <CarouselViewport
            className="w-full scrollbar-none overflow-x-auto md:w-fit md:max-w-65 md:overflow-hidden @min-[904px]:max-w-140 @min-[1204px]:max-w-215 @min-[1504px]:max-w-290 @min-[1804px]:max-w-365 @min-[2104px]:max-w-440 [&::-webkit-scrollbar]:hidden"
            enableWheelNavigation
            trackClassName="touch-auto gap-s px-ll md:touch-pan-y md:gap-3l md:px-0"
          >
            {events.map((event, index) => (
              <CarouselSlide
                ariaLabel={event.name}
                className="min-w-0 flex-[0_0_148px] shrink-0 md:flex-[0_0_260px]"
                index={index}
                key={event.id}
              >
                <EventFrame {...event} />
              </CarouselSlide>
            ))}
          </CarouselViewport>
          <CarouselNextButton
            className="-mx-xs hidden size-11 items-center justify-center rounded-full text-font-main transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main disabled:cursor-default disabled:opacity-60 md:flex"
            label="次の企画へ"
          >
            <EventSectionArrow direction="right" />
          </CarouselNextButton>
        </div>
      </CarouselRoot>
    </section>
  );
}

const EventSectionArrow = ({ direction }: { direction: "left" | "right" }) => (
  <svg
    aria-hidden="true"
    className="h-11 w-6"
    fill="none"
    viewBox="0 0 24 44"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d={direction === "left" ? "M22 42L2 22L22 2" : "M2 42L22 22L2 2"}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="4"
    />
  </svg>
);
