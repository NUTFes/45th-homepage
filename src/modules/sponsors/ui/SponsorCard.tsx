import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

import type { SponsorDTO } from "../types";

type SponsorCardProps = {
  className?: string;
  imageSizes?: string;
  sponsor: SponsorDTO;
};

export default function SponsorCard({
  className,
  imageSizes = "(min-width: 768px) 248px, 300px",
  sponsor,
}: SponsorCardProps) {
  return (
    <article
      className={twMerge("flex w-full flex-col items-center gap-ss md:w-62 md:gap-xs", className)}
    >
      <h2 className="max-w-full text-center text-Ptext-large wrap-break-word text-font-main">
        {sponsor.companyName}
      </h2>
      <div className="relative aspect-4/3 w-full overflow-hidden border-2 border-main bg-base-dark">
        {sponsor.image ? (
          sponsor.href ? (
            <Link
              aria-label={`${sponsor.companyName}の広告サイトを開く`}
              className="group block size-full"
              href={sponsor.href}
            >
              <Image
                alt=""
                className="object-contain"
                fill
                sizes={imageSizes}
                src={sponsor.image.url}
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10"
              />
            </Link>
          ) : (
            <Image
              alt={sponsor.image.alt || `${sponsor.companyName} 広告画像`}
              className="object-contain"
              fill
              sizes={imageSizes}
              src={sponsor.image.url}
            />
          )
        ) : (
          <div className="flex size-full flex-col items-center justify-center text-center text-main">
            <span className="font-kaisotai text-title leading-normal">AD</span>
            <span className="text-[22px] leading-normal">NO IMAGE</span>
          </div>
        )}
      </div>
    </article>
  );
}
