"use client";

import Link from "next/link";
import Image from "next/image";
import { TooltipTrigger, Focusable } from "react-aria-components";
import { Tooltip } from "@/components/aria/Tooltip";

type EventFrameProps = {
  name: string;
  href: string;
  imageUrl: string;
  imageAlt: string;
};

const MAX_LENGTH = 24;
const TEXTB_LENGTH = 14;

export default function EventFrame(props: EventFrameProps) {
  const { name, href, imageUrl, imageAlt } = props;

  const isTruncated = name.length > MAX_LENGTH;

  const displayName = isTruncated
    ? name.slice(0, MAX_LENGTH-1) + "…"
    : name;

  const nameClassName =
    name.length <= TEXTB_LENGTH
      ? "text-textb"
      : "text-[14px] leading-[20px]";

  return (
    <Link
      href={href}
      className="flex flex-col pb-s rounded-lg bg-secondary transition-all duration-200 hover:-translate-y-1 h-[200px] w-[148px] shadow-[0px_6px_8px_rgba(60,224,232,0.6)] hover:shadow-[0px_6px_8px_rgba(60,224,232,1.0)]"
    >
      <div className="relative h-[111px] w-full shrink-0 rounded-tl-lg rounded-tr-lg overflow-hidden">
        <Image
          className="object-contain"
          src={imageUrl}
          alt={imageAlt}
          fill
          sizes="148px"
        />
      </div>

      <div className="flex flex-1 items-center px-s">
        {isTruncated ? (
          <TooltipTrigger delay={300} closeDelay={300}>
            <Focusable>
              <div className={nameClassName}>
                {displayName}
              </div>
            </Focusable>

            <Tooltip className="max-w-[220px]">
              {name}
            </Tooltip>
          </TooltipTrigger>
        ) : (
          <div className={nameClassName}>
            {displayName}
          </div>
        )}
      </div>
    </Link>
  );
}
