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

  const card = (
    <Link
      href={href}
      aria-label={name}
      prefetch={false}
      className="flex h-54 w-37 flex-col rounded-lg bg-secondary pb-s shadow-[0px_6px_8px_rgba(60,224,232,0.6)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0px_6px_8px_rgba(60,224,232,1.0)]"
    >
      <div className="w-full shrink-0 overflow-hidden rounded-tl-lg rounded-tr-lg bg-linear-to-b from-[#3ce0e8] to-secondary to-70% px-4.5 py-3">
        {hasImageError ? (
          <Image className="object-contain" src={FALLBACK_LOGO} alt="" width={111} height={111} />
        ) : (
          <Image
            className="object-cover"
            src={imageUrl}
            alt=""
            width={111}
            height={111}
            onError={handleImageError}
          />
        )}
      </div>

      <div className="mt-auto flex h-4l items-center px-s">
        <div className={nameClassName}>{displayName}</div>
      </div>
    </Link>
  );

  if (!isTruncated) {
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
