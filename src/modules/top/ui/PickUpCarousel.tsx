"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

import {
  type CarouselImageSlide,
  type CarouselMotionOptions,
  CarouselDots,
  CarouselRoot,
  CarouselSlide,
  CarouselViewport,
} from "@/components/ui/carousel";

type PickUpCarouselProps = CarouselMotionOptions & {
  slides: CarouselImageSlide[];
};

const FRAME_WIDTH = 393;
const fallbackSlide: CarouselImageSlide = {
  id: "fallback",
  imageAlt: "Carousel placeholder",
  imageUrl: "/icon/45th-logo-top.svg",
};

export const PickUpCarousel = ({ slides, autoPlay, autoScroll }: PickUpCarouselProps) => {
  const safeSlides = slides.length > 0 ? slides : [fallbackSlide];
  const resolvedAutoPlay = useMemo(() => autoPlay ?? { delay: 2000 }, [autoPlay]);

  return (
    <CarouselRoot
      ariaLabel="PICKUP carousel"
      autoPlay={resolvedAutoPlay}
      autoScroll={autoScroll}
      className="h-full w-full"
      loop
    >
      <CarouselViewport className="absolute inset-0 overflow-hidden">
        {safeSlides.map((slide, index) => (
          <CarouselSlide
            className="relative h-full min-w-0 flex-[0_0_100%]"
            index={index}
            key={slide.id}
          >
            {slide.href ? (
              <Link
                aria-label={slide.imageAlt}
                className="group block h-full w-full"
                href={slide.href}
              >
                <div className="absolute inset-0 flex items-center overflow-hidden">
                  <Image
                    alt={slide.imageAlt}
                    className="h-full w-full object-cover object-center"
                    height={slide.imageHeight ?? 1080}
                    priority={index === 0}
                    sizes={`(max-width: ${FRAME_WIDTH}px) 100vw, 100vw`}
                    src={slide.imageUrl}
                    width={slide.imageWidth ?? 1920}
                  />
                </div>
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
              </Link>
            ) : (
              <div className="absolute inset-0 flex items-center overflow-hidden">
                <Image
                  src={slide.imageUrl}
                  alt={slide.imageAlt}
                  className="h-full w-full object-cover object-center"
                  width={slide.imageWidth ?? 1920}
                  height={slide.imageHeight ?? 1080}
                  priority={index === 0}
                  sizes={`(max-width: ${FRAME_WIDTH}px) 100vw, 100vw`}
                />
              </div>
            )}
          </CarouselSlide>
        ))}
      </CarouselViewport>

      <CarouselDots
        activeDotClassName="bg-main"
        buttonAriaLabel={(index) => `Go to pickup slide ${index + 1}`}
        className="absolute bottom-xs left-1/2 z-20 flex -translate-x-1/2 items-center"
        dotClassName="block size-3 rounded-full border border-main transition-colors"
        gap={12}
        inactiveDotClassName="bg-transparent"
        keys={safeSlides.map((slide) => slide.id)}
        navAriaLabel="PICKUP slide navigation"
      />
    </CarouselRoot>
  );
};

export default PickUpCarousel;
