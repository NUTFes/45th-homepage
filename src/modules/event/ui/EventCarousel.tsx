import EventFrame, { type EventFrameProps } from "@/components/ui/EventFrame";
import {
  CarouselNextButton,
  CarouselPrevButton,
  CarouselRoot,
  CarouselSlide,
  CarouselViewport,
} from "@/components/ui/carousel";

export type EventCarouselEvent = EventFrameProps & {
  id: string | number;
};

type EventCarouselProps = {
  ariaLabel: string;
  events: readonly EventCarouselEvent[];
};

export default function EventCarousel({ ariaLabel, events }: EventCarouselProps) {
  return (
    <CarouselRoot
      ariaLabel={ariaLabel}
      className="@container"
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
      wheelGestures={{
        active: false,
        breakpoints: {
          "(min-width: 768px)": { active: true },
        },
        wheelDraggingClass: "",
      }}
    >
      <div className="flex items-center justify-center md:gap-ll md:px-pm">
        <CarouselPrevButton
          className="-mx-xs hidden size-11 items-center justify-center rounded-full text-font-main transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main disabled:cursor-default disabled:opacity-60 md:flex"
          label="前の企画へ"
        >
          <EventCarouselArrow direction="left" />
        </CarouselPrevButton>
        <CarouselViewport
          className="w-full scrollbar-none overflow-x-auto md:w-fit md:max-w-65 md:overflow-hidden @min-[904px]:max-w-140 @min-[1204px]:max-w-215 @min-[1504px]:max-w-290 @min-[1804px]:max-w-365 @min-[2104px]:max-w-440 [&::-webkit-scrollbar]:hidden"
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
          <EventCarouselArrow direction="right" />
        </CarouselNextButton>
      </div>
    </CarouselRoot>
  );
}

const EventCarouselArrow = ({ direction }: { direction: "left" | "right" }) => (
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
