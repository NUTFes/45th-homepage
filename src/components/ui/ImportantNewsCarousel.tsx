"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  CarouselMotionButton,
  CarouselNextButton,
  CarouselPrevButton,
  CarouselRoot,
  CarouselSlide,
  CarouselViewport,
  useCarousel,
} from "@/components/ui/carousel";
import NewsRichText from "@/components/ui/NewsRichText";
import type { ImportantNewsItem } from "@/modules/news/server/getNews";

const AUTO_PLAY_DELAY_MS = 6000;

type ImportantNewsCarouselProps = {
  items: ImportantNewsItem[];
};

export default function ImportantNewsCarousel({ items }: ImportantNewsCarouselProps) {
  const [first, ...rest] = items;

  if (!first) {
    return null;
  }

  if (rest.length === 0) {
    return <NewsRichText data={first.body} />;
  }

  return (
    <CarouselRoot
      ariaLabel="重要なお知らせ"
      autoPlay={{ delay: AUTO_PLAY_DELAY_MS, stopOnInteraction: false }}
      className="relative"
      loop
    >
      <CarouselPrevButton className="absolute inset-y-0 -left-l z-10 flex items-center text-white drop-shadow-sm transition-opacity hover:opacity-70 md:-left-3l">
        <ChevronLeft className="size-5 md:size-8" strokeWidth={1.5} />
      </CarouselPrevButton>

      <CarouselViewport className="overflow-hidden">
        {items.map((item, index) => (
          <ImportantNewsSlide index={index} item={item} key={item.id} />
        ))}
      </CarouselViewport>

      <CarouselNextButton className="absolute inset-y-0 -right-l z-10 flex items-center text-white drop-shadow-sm transition-opacity hover:opacity-70 md:-right-3l">
        <ChevronRight className="size-5 md:size-8" strokeWidth={1.5} />
      </CarouselNextButton>

      <CarouselMotionButton
        className="absolute right-0 -bottom-m z-10 text-text-small text-white/70 drop-shadow-sm transition-colors hover:text-white md:-bottom-l"
        pauseLabel="一時停止"
        playLabel="自動再生"
      />
    </CarouselRoot>
  );
}

function ImportantNewsSlide({ index, item }: { index: number; item: ImportantNewsItem }) {
  const { selectedIndex } = useCarousel();
  const isActive = selectedIndex === index;

  return (
    <CarouselSlide className="min-w-0 flex-[0_0_100%]" index={index} inert={!isActive}>
      <NewsRichText data={item.body} />
    </CarouselSlide>
  );
}
