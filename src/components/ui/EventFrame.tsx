"use client";

import { useState } from "react";
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
const TOOLTIP_OFFSET = -120;
const FALLBACK_LOGO = "/favicon/45th-LogoBlue.svg";

export default function EventFrame(props: EventFrameProps) {
  const { name, href, imageUrl } = props;

  const [hasImageError, setHasImageError] = useState(false);

  const handleImageError = () => {
    setHasImageError(true);
  };

  const isTruncated = name.length > DISPLAY_NAME_MAX_LENGTH;

  const displayName = isTruncated ? name.slice(0, DISPLAY_NAME_MAX_LENGTH - 1) + "…" : name;

  const nameClassName =
    name.length <= LARGE_TEXT_MAX_LENGTH ? "text-textb" : "text-[14px] leading-[20px]";

  const isPcTruncated = name.length > PC_DISPLAY_NAME_MAX_LENGTH;

  const PcdisplayName = isPcTruncated ? name.slice(0, PC_DISPLAY_NAME_MAX_LENGTH - 1) + "…" : name;

  const PcNameClassName =
    name.length <= PC_LARGE_TEXT_MAX_LENGTH ? "text-Ptitle-small font-medium" : "text-Ptext-large leading-[28px]";

  const card = (
    <Link
      href={href}
      aria-label={name}
      prefetch={false}
      className="flex h-54 md:h-84 w-37 md:w-65 flex-col rounded-lg md:rounded-xl bg-secondary pb-s md:pb-l shadow-[0px_6px_8px_rgba(60,224,232,0.6)] md:shadow-[0px_6px_8px_4px_rgba(60,224,232,0.8)] transition-all duration-200 hover:-translate-y-1 "
    >
      <div className="flex items-center justify-center h-33.5 md:h-62  shrink-0 overflow-hidden rounded-tl-lg rounded-tr-lg md:rounded-tl-xl md:rounded-tr-xl bg-linear-to-b from-[#3ce0e8] to-secondary to-70% ">
        {hasImageError ? (
          <Image
            className="object-contain w-27.75 h-27.75 md:w-51.25 md:h-51.25"
            src={FALLBACK_LOGO}
            alt=""
            width={205}
            height={205}
            sizes="(min-width: 768px) 205px, 111px"
          />
        ) : (
          <Image
            className="object-cover w-27.75 h-27.75 md:w-51.25 md:h-51.25"
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
        <div className={`hidden md:block ${PcNameClassName}`}>{PcdisplayName}</div>
      </div>
    </Link>
  );

  if (!isTruncated && !isPcTruncated) {
    return card;
  }

  return (
    <TooltipTrigger delay={300} closeDelay={300}>
      <Focusable>{card}</Focusable>
      <Tooltip className="max-w-55 wrap-break-word" offset={TOOLTIP_OFFSET}>
        {name}
      </Tooltip>
    </TooltipTrigger>
  );
}
