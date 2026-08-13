import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";

import SectionTitle from "@/components/ui/SectionTitle";

import { getSponsorsPageData } from "./server/getSponsorsPageData";
import SponsorCard from "./ui/SponsorCard";

const splitSponsorsByImage = (
  sponsors: Awaited<ReturnType<typeof getSponsorsPageData>>["sponsors"],
) => ({
  imageSponsors: sponsors.filter((sponsor) => sponsor.image),
  nameOnlySponsors: sponsors.filter((sponsor) => !sponsor.image),
});

function ThanksMessage({ message }: { message: string }) {
  return (
    <p className="mx-auto w-full max-w-200 px-ll text-text whitespace-pre-wrap text-font-main md:px-0 md:text-Ptext">
      {message}
    </p>
  );
}

function SponsorImageGrid({
  sponsors,
}: {
  sponsors: ReturnType<typeof splitSponsorsByImage>["imageSponsors"];
}) {
  if (sponsors.length === 0) {
    return null;
  }

  return (
    <section aria-label="広告画像つき協賛企業" className="w-full md:px-pl">
      <div className="mx-auto grid w-full max-w-75 grid-cols-1 justify-center gap-3l md:max-w-350 md:grid-cols-[repeat(auto-fit,minmax(15.5rem,15.5rem))] md:gap-x-3l md:gap-y-4l">
        {sponsors.map((sponsor) => (
          <SponsorCard key={sponsor.id} sponsor={sponsor} />
        ))}
      </div>
    </section>
  );
}

function SponsorNameList({
  sponsors,
}: {
  sponsors: ReturnType<typeof splitSponsorsByImage>["nameOnlySponsors"];
}) {
  if (sponsors.length === 0) {
    return null;
  }

  return (
    <section aria-label="協賛企業名一覧" className="w-full px-4l md:px-0">
      <ul className="mx-auto grid w-full max-w-240 grid-cols-1 gap-x-3l gap-y-m sm:grid-cols-[repeat(auto-fit,minmax(17rem,1fr))]">
        {sponsors.map((sponsor) => (
          <li
            key={sponsor.id}
            className="flex min-w-0 items-center justify-start gap-2.5 text-font-main md:justify-center"
          >
            <span className="size-4 shrink-0 rounded-full bg-secondary" aria-hidden="true" />
            {sponsor.href ? (
              <Link
                className="min-w-0 text-text-large wrap-break-word underline decoration-secondary decoration-2 underline-offset-4 transition-opacity hover:opacity-70 focus-visible:opacity-70 md:text-Ptext-large"
                href={sponsor.href}
              >
                {sponsor.companyName}
              </Link>
            ) : (
              <span className="min-w-0 text-text-large wrap-break-word md:text-Ptext-large">
                {sponsor.companyName}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function EmptySponsors() {
  return (
    <p className="mx-auto max-w-200 px-ll text-center text-text text-font-main md:px-0 md:text-Ptext">
      協賛企業一覧は現在準備中です。
    </p>
  );
}

export default async function SponsorPageView() {
  await connection();

  const { sponsors, thanksMessage } = await getSponsorsPageData();
  const { imageSponsors, nameOnlySponsors } = splitSponsorsByImage(sponsors);
  const hasSponsors = sponsors.length > 0;

  return (
    <div className="relative z-0 flex min-h-screen flex-col items-center overflow-hidden bg-base py-4l md:py-5l">
      <Image
        src="/image/PageBack1.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 z-0 hidden md:block"
        width={200}
        height={200}
      />
      <Image
        src="/image/PageBack2.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 z-0 hidden md:block"
        width={200}
        height={200}
      />

      <div className="relative z-10 flex w-full flex-col gap-4l">
        <div className="flex w-full flex-col gap-s md:gap-ll md:px-pl">
          <div className="max-w-full pr-m md:px-0">
            <SectionTitle
              title={
                <span className="whitespace-nowrap">
                  ご協賛いただいた企業様
                  <span className="text-title-small md:text-Ptitle-small">（順不同）</span>
                </span>
              }
            />
          </div>
          <ThanksMessage message={thanksMessage} />
        </div>

        {hasSponsors ? (
          <div className="flex w-full flex-col gap-4l md:gap-5l">
            <SponsorImageGrid sponsors={imageSponsors} />
            <SponsorNameList sponsors={nameOnlySponsors} />
          </div>
        ) : (
          <EmptySponsors />
        )}
      </div>
    </div>
  );
}
