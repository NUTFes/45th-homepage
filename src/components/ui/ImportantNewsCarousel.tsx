"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  CarouselNextButton,
  CarouselPrevButton,
  CarouselRoot,
  CarouselSlide,
  CarouselViewport,
} from "@/components/ui/carousel";
import NewsRichText from "@/components/ui/NewsRichText";
import type { ImportantNewsItem } from "@/modules/news/server/getNews";

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
    <CarouselRoot ariaLabel="重要なお知らせ" className="relative" loop>
      <CarouselPrevButton className="absolute inset-y-0 -left-l z-10 flex items-center text-white drop-shadow-sm transition-opacity hover:opacity-70 md:-left-3l">
        <ChevronLeft className="size-5 md:size-8" strokeWidth={1.5} />
      </CarouselPrevButton>

      <CarouselViewport className="overflow-hidden">
        {items.map((item, index) => (
          <CarouselSlide className="min-w-0 flex-[0_0_100%]" index={index} key={item.id}>
            <NewsRichText data={item.body} />
          </CarouselSlide>
        ))}
      </CarouselViewport>

      <CarouselNextButton className="absolute inset-y-0 -right-l z-10 flex items-center text-white drop-shadow-sm transition-opacity hover:opacity-70 md:-right-3l">
        <ChevronRight className="size-5 md:size-8" strokeWidth={1.5} />
      </CarouselNextButton>
    </CarouselRoot>
  );
}
