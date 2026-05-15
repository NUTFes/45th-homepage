"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import type { CarouselImageSlide, CarouselMotionOptions } from "@/components/ui/carousel";

const CarouselPlaceholder = () => (
  <div className="aspect-video w-full bg-base-dark md:mx-auto md:w-[60%]" />
);

const PickUpCarousel = dynamic(() => import("./PickUpCarousel"), {
  loading: CarouselPlaceholder,
  ssr: false,
});

const IDLE_TIMEOUT_MS = 1200;

const scheduleIdle = (callback: () => void) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(callback, { timeout: IDLE_TIMEOUT_MS });
    return () => window.cancelIdleCallback(id);
  }

  const id = window.setTimeout(callback, IDLE_TIMEOUT_MS);
  return () => window.clearTimeout(id);
};

type PickUpCarouselLazyProps = CarouselMotionOptions & {
  slides: CarouselImageSlide[];
};

export default function PickUpCarouselLazy({
  slides,
  autoPlay,
  autoScroll,
}: PickUpCarouselLazyProps) {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const cancel = scheduleIdle(() => setShouldLoad(true));
    return cancel;
  }, []);

  if (!shouldLoad) {
    return <CarouselPlaceholder />;
  }

  return <PickUpCarousel slides={slides} autoPlay={autoPlay} autoScroll={autoScroll} />;
}
