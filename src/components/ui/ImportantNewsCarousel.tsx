"use client";

import { CarouselRoot, CarouselSlide, CarouselViewport } from "@/components/ui/carousel";
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
    <CarouselRoot ariaLabel="重要なお知らせ" autoPlay={{ delay: AUTO_PLAY_DELAY_MS }} loop>
      <CarouselViewport className="overflow-hidden">
        {items.map((item, index) => (
          <CarouselSlide className="min-w-0 flex-[0_0_100%]" index={index} key={item.id}>
            <NewsRichText data={item.body} />
          </CarouselSlide>
        ))}
      </CarouselViewport>
    </CarouselRoot>
  );
}
