import Image from "next/image";
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
          <Image
            alt={sponsor.image.alt || `${sponsor.companyName} 広告画像`}
            className="object-contain"
            fill
            sizes={imageSizes}
            src={sponsor.image.url}
          />
        ) : null}
      </div>
    </article>
  );
}
