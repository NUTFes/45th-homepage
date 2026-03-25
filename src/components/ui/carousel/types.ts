import type { AutoScrollOptionsType } from "embla-carousel-auto-scroll";
import type { AutoplayOptionsType } from "embla-carousel-autoplay";

export type CarouselImageSlide = {
  id: string;
  imageAlt: string;
  imageWidth?: number;
  imageHeight?: number;
  imageUrl: string;
  href?: string;
};

type CarouselAutoPlaySettings = Pick<
  AutoplayOptionsType,
  "delay" | "stopOnFocusIn" | "stopOnInteraction" | "stopOnMouseEnter"
>;

type CarouselAutoScrollSettings = Pick<
  AutoScrollOptionsType,
  "direction" | "speed" | "startDelay" | "stopOnFocusIn" | "stopOnInteraction" | "stopOnMouseEnter"
>;

export type CarouselAutoPlayOption = boolean | CarouselAutoPlaySettings;
export type CarouselAutoScrollOption = boolean | CarouselAutoScrollSettings;

export type CarouselMotionOptions = {
  autoPlay?: CarouselAutoPlayOption;
  autoScroll?: CarouselAutoScrollOption;
};

