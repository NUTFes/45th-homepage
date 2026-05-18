import { getPayload } from "payload";
import { cacheLife, cacheTag } from "next/cache";

import type { CarouselImageSlide } from "@/components/ui/carousel";
import { CACHE_TAGS } from "@/lib/cacheTags";
import type { Media, TopPage } from "@/payload-types";
import config from "@/payload.config";

type Pickup = NonNullable<TopPage["pickups"]>[number];

const isMediaDoc = (value: Pickup["image"]): value is Media =>
  typeof value === "object" && value !== null;

const normalizeHref = (rawHref?: string | null): string | undefined => {
  if (!rawHref) {
    return undefined;
  }

  const href = rawHref.trim();
  if (!href) {
    return undefined;
  }

  if (href.startsWith("/") && !href.startsWith("//")) {
    return href;
  }

  if (/^https?:\/\//i.test(href)) {
    return href;
  }

  return undefined;
};

const toPickUpSlide = (pickup: Pickup, index: number): CarouselImageSlide | null => {
  if (!isMediaDoc(pickup.image) || !pickup.image.url) {
    return null;
  }

  const href = normalizeHref(pickup.href);

  return {
    id: pickup.id ?? `${pickup.image.id}-${index}`,
    imageAlt: pickup.image.alt || "PICKUP image",
    imageHeight: pickup.image.height ?? undefined,
    imageUrl: pickup.image.url,
    imageWidth: pickup.image.width ?? undefined,
    ...(href ? { href } : {}),
  };
};

export async function getPickUpSlides(): Promise<CarouselImageSlide[]> {
  "use cache";
  cacheTag(CACHE_TAGS.topPage);
  cacheLife("minutes");

  const payload = await getPayload({ config });
  const topPage = await payload.findGlobal({
    slug: "top-page",
    depth: 1,
  });

  if (!topPage.pickups?.length) {
    return [];
  }

  return topPage.pickups
    .map((pickup, index) => toPickUpSlide(pickup, index))
    .filter((slide): slide is CarouselImageSlide => slide !== null);
}
