"use client";

import Link from "next/link";
import Image from "next/image";
import { TooltipTrigger, Focusable } from "react-aria-components";
import { Tooltip } from "@/components/aria/Tooltip";

type EventFrameProps = {
  name: string;
  href: string;
  imageUrl: string;
};

const DISPLAY_NAME_MAX_LENGTH = 24;
const LARGE_TEXT_MAX_LENGTH = 14;
const TOOLTIP_OFFSET = -120;

export default function EventFrame(props: EventFrameProps) {
  const { name, href, imageUrl } = props;

  const isTruncated = name.length > DISPLAY_NAME_MAX_LENGTH;

  const displayName = isTruncated ? name.slice(0, DISPLAY_NAME_MAX_LENGTH - 1) + "…" : name;

  const nameClassName = name.length <= LARGE_TEXT_MAX_LENGTH ? "text-textb" : "text-[14px] leading-[20px]";

  const card = (
    <Link
      href={href}
      aria-label={name}
      prefetch={false}
      className="flex h-[200px] w-[148px] flex-col rounded-lg bg-secondary pb-s shadow-[0px_6px_8px_rgba(60,224,232,0.6)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0px_6px_8px_rgba(60,224,232,1.0)]"
    >
      <div className="relative h-[111px] w-full shrink-0 overflow-hidden rounded-tl-lg rounded-tr-lg">
        <Image className="object-cover" src={imageUrl} alt="" fill sizes="148px" />
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
