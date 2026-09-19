"use client";

import { getImageProps } from "next/image";
import type { CSSProperties } from "react";

import { useHeroAnimation } from "./HeroAnimationContext";

// TopPageView.tsx の AnimationLayer と揃えている値(このレイヤーだけ
// animationend を検知したいためクライアント側に切り出した)
const TOP_HERO_IMAGE_QUALITY = 60;
const TOP_HERO_IMAGE_SIZES = "100vw";

type HeroTitleLayerProps = {
  mobileSrc: string;
  pcSrc: string;
  className: string;
  style: CSSProperties;
};

export function HeroTitleLayer({ mobileSrc, pcSrc, className, style }: HeroTitleLayerProps) {
  const { markHeroAnimationDone } = useHeroAnimation();

  const common = {
    alt: "",
    fill: true,
    quality: TOP_HERO_IMAGE_QUALITY,
    sizes: TOP_HERO_IMAGE_SIZES,
  } as const;
  const {
    props: { srcSet: pcSrcSet },
  } = getImageProps({ ...common, src: pcSrc });
  const { props: mobileProps } = getImageProps({ ...common, src: mobileSrc });

  return (
    <picture className="absolute inset-0 block" style={style}>
      <source media="(min-width: 768px)" srcSet={pcSrcSet} />
      <img
        {...mobileProps}
        aria-hidden="true"
        className={className}
        onAnimationEnd={markHeroAnimationDone}
      />
    </picture>
  );
}
