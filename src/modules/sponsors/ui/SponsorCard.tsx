import Image from "next/image";

import type { SponsorDTO } from "../types";

type SponsorCardProps = {
  sponsor: SponsorDTO;
};

export default function SponsorCard({ sponsor }: SponsorCardProps) {
  return (
    <article className="flex w-full flex-col items-center gap-ss md:w-62 md:gap-xs">
      <h2 className="max-w-full text-center text-textb break-words text-font-main md:text-Ptext-large">
        {sponsor.companyName}
      </h2>
      <div className="relative aspect-[4/3] w-full overflow-hidden border-2 border-main bg-base-dark">
        {sponsor.image ? (
          <Image
            alt={sponsor.image.alt || `${sponsor.companyName} 広告画像`}
            className="object-contain"
            fill
            sizes="(min-width: 768px) 248px, 300px"
            src={sponsor.image.url}
          />
        ) : null}
      </div>
    </article>
  );
}
