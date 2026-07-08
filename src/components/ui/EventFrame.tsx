"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { TooltipTrigger, Focusable } from "react-aria-components";
import { Tooltip } from "@/components/aria/Tooltip";

export type EventFrameProps = {
  name: string;
  href: string;
  imageUrl: string;
};

const DISPLAY_NAME_MAX_LENGTH = 24;
const LARGE_TEXT_MAX_LENGTH = 14;
const PC_DISPLAY_NAME_MAX_LENGTH = 22;
const PC_LARGE_TEXT_MAX_LENGTH = 10;
const SP_TOOLTIP_OFFSET = -120;
const PC_TOOLTIP_OFFSET = -250;
const FALLBACK_LOGO = "/favicon/45th-LogoBlue.svg";

const truncate = (text: string, max: number) =>
  text.length > max ? text.slice(0, max - 1) + "…" : text;

export default function EventFrame({ name, href, imageUrl }: EventFrameProps) {
  const [hasImageError, setHasImageError] = useState(false);

  const [isPc, setIsPc] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia("(min-width: 768px)");
    setIsPc(mediaQuery.matches);

    const onChange = (event: MediaQueryListEvent) => {
      setIsPc(event.matches);
    };

    mediaQuery.addEventListener("change", onChange);

    return () => {
      mediaQuery.removeEventListener("change", onChange);
    };
  }, []);

  const tooltipOffset = isPc ? PC_TOOLTIP_OFFSET : SP_TOOLTIP_OFFSET;

  const handleImageError = () => {
    setHasImageError(true);
  };

  const isTruncated = name.length > DISPLAY_NAME_MAX_LENGTH;

  const displayName = truncate(name, DISPLAY_NAME_MAX_LENGTH);

  const nameClassName =
    name.length <= LARGE_TEXT_MAX_LENGTH ? "text-textb" : "text-[14px] leading-[20px]";

  const isPcTruncated = name.length > PC_DISPLAY_NAME_MAX_LENGTH;

  const pcDisplayName = truncate(name, PC_DISPLAY_NAME_MAX_LENGTH);

  const pcNameClassName =
    name.length <= PC_LARGE_TEXT_MAX_LENGTH
      ? "text-Ptitle-small font-medium"
      : "text-Ptext-large leading-[28px]";

  const card = (
    <Link
      href={href}
      aria-label={name}
      prefetch={false}
      className="flex h-54 w-37 flex-col rounded-lg bg-secondary pb-s shadow-[0px_6px_8px_rgba(60,224,232,0.6)] transition-all duration-200 hover:-translate-y-1 md:h-84 md:w-65 md:rounded-xl md:pb-l md:shadow-[0px_6px_8px_4px_rgba(60,224,232,0.8)]"
    >
      <div className="flex h-33.5 shrink-0 items-center justify-center overflow-hidden rounded-tl-lg rounded-tr-lg bg-linear-to-b from-[#3ce0e8] to-secondary to-70% md:h-62 md:rounded-tl-xl md:rounded-tr-xl">
        {hasImageError ? (
          <Image
            className="h-27.75 w-27.75 object-contain md:h-51.25 md:w-51.25"
            src={FALLBACK_LOGO}
            alt=""
            width={205}
            height={205}
            sizes="(min-width: 768px) 205px, 111px"
          />
        ) : (
          <Image
            className="h-27.75 w-27.75 object-cover md:h-51.25 md:w-51.25"
            src={imageUrl}
            alt=""
            width={205}
            height={205}
            sizes="(min-width: 768px) 205px, 111px"
            onError={handleImageError}
          />
        )}
      </div>

      <div className="mt-auto flex h-4l items-center px-s">
        <div className={`md:hidden ${nameClassName}`}>{displayName}</div>
        <div className={`hidden md:block ${pcNameClassName}`}>{pcDisplayName}</div>
      </div>
    </Link>
  );

  if (!isTruncated && !isPcTruncated) {
    return card;
  }

  return (
    <TooltipTrigger delay={300} closeDelay={300}>
      <Focusable>{card}</Focusable>
      <Tooltip className="max-w-55 wrap-break-word" offset={tooltipOffset}>
        {name}
      </Tooltip>
    </TooltipTrigger>
  );
}
