"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import type { CarouselImageSlide, CarouselMotionOptions } from "@/components/ui/carousel";

const PLACEHOLDER_CLASS_NAME = "aspect-video w-full bg-base-dark md:mx-auto md:w-[60%]";

const PickUpCarousel = dynamic(() => import("./PickUpCarousel"), {
  loading: () => <div className={PLACEHOLDER_CLASS_NAME} />,
  ssr: false,
});

const PRELOAD_ROOT_MARGIN = "200px 0px";

type PickUpCarouselLazyProps = CarouselMotionOptions & {
  slides: CarouselImageSlide[];
};

export default function PickUpCarouselLazy({
  slides,
  autoPlay,
  autoScroll,
}: PickUpCarouselLazyProps) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const placeholderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldLoad || typeof window === "undefined") {
      return;
    }

    if (typeof window.IntersectionObserver !== "function") {
      setShouldLoad(true);
      return;
    }

    const placeholder = placeholderRef.current;
    if (!placeholder) {
      return;
    }

    const observer = new window.IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) {
          return;
        }

        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: PRELOAD_ROOT_MARGIN },
    );

    observer.observe(placeholder);

    return () => observer.disconnect();
  }, [shouldLoad]);

  if (!shouldLoad) {
    return <div ref={placeholderRef} className={PLACEHOLDER_CLASS_NAME} />;
  }

  return <PickUpCarousel slides={slides} autoPlay={autoPlay} autoScroll={autoScroll} />;
}
