"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

import {
  type CarouselImageSlide,
  type CarouselMotionOptions,
  CarouselDots,
  CarouselNextButton,
  CarouselPrevButton,
  CarouselRoot,
  CarouselSlide,
  CarouselViewport,
  useCarousel,
} from "@/components/ui/carousel";

type PickUpCarouselProps = CarouselMotionOptions & {
  slides: CarouselImageSlide[];
};

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
      className="relative w-full"
      loop
      options={{ align: "center" }}
    >
      <CarouselViewport className="overflow-hidden" trackClassName="!h-auto">
        {safeSlides.map((slide, index) => (
          <PickUpSlideContent
            index={index}
            key={slide.id}
            slide={slide}
            totalSlides={safeSlides.length}
          />
        ))}
      </CarouselViewport>

      <CarouselPrevButton className="absolute top-1/2 left-2 z-20 hidden -translate-y-1/2 items-center justify-center text-white transition-opacity hover:opacity-70 md:left-[calc(20%-4rem)] md:flex">
        <ChevronLeft className="size-12" strokeWidth={1} />
      </CarouselPrevButton>

      <CarouselNextButton className="absolute top-1/2 right-2 z-20 hidden -translate-y-1/2 items-center justify-center text-white transition-opacity hover:opacity-70 md:right-[calc(20%-4rem)] md:flex">
        <ChevronRight className="size-12" strokeWidth={1} />
      </CarouselNextButton>

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

const PickUpSlideContent = ({
  slide,
  index,
  totalSlides,
}: {
  slide: CarouselImageSlide;
  index: number;
  totalSlides: number;
}) => {
  const { selectedIndex } = useCarousel();
  const isActive = selectedIndex === index;

  return (
    <CarouselSlide
      className="relative aspect-video min-w-0 flex-[0_0_100%] px-0 md:flex-[0_0_60%]"
      index={index}
    >
      <div className="relative aspect-video w-full overflow-hidden">
        {slide.href ? (
          <Link aria-label={slide.imageAlt} className="group block h-full w-full" href={slide.href}>
            <div className="absolute inset-0 flex items-center overflow-hidden">
              <Image
                alt={slide.imageAlt}
                className="h-full w-full object-cover object-center"
                height={slide.imageHeight ?? 1080}
                priority={index <= 1 || index === totalSlides - 1}
                sizes="(min-width: 768px) 60vw, 100vw"
                src={slide.imageUrl}
                width={slide.imageWidth ?? 1920}
              />
            </div>
            <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
          </Link>
        ) : (
          <div className="absolute inset-0 flex items-center overflow-hidden">
            <Image
              alt={slide.imageAlt}
              className="h-full w-full object-cover object-center"
              height={slide.imageHeight ?? 1080}
              priority={index <= 1 || index === totalSlides - 1}
              sizes="(min-width: 768px) 60vw, 100vw"
              src={slide.imageUrl}
              width={slide.imageWidth ?? 1920}
            />
          </div>
        )}

        <div
          className={`pointer-events-none absolute inset-0 bg-black/30 transition-opacity duration-300 ${isActive ? "opacity-0" : "opacity-100"}`}
        />

        <div
          className={`pointer-events-none absolute inset-0 transition-opacity duration-300 [--corner-size:20px] md:[--corner-size:31px] ${isActive ? "opacity-100" : "opacity-0"}`}
        >
          <div className="absolute top-0 right-0 z-10 flex justify-end">
            <div
              className="h-[20px] w-36.25 bg-main md:h-7.75 md:w-56.25"
              style={{
                clipPath: "polygon(0 0, 100% 0, 100% 100%, var(--corner-size) 100%)",
              }}
            />
          </div>
          <div className="absolute bottom-0 left-0 z-10">
            <div
              className="h-[20px] w-27.5 bg-main md:h-7.75 md:w-43.25"
              style={{
                clipPath: "polygon(0 0, calc(100% - var(--corner-size)) 0, 100% 100%, 0 100%)",
              }}
            />
          </div>
        </div>
      </div>
    </CarouselSlide>
  );
};
