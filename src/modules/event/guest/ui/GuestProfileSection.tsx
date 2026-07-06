import Image from "next/image";

import GuestProfileCard, { type GuestProfile } from "./GuestProfileCard";

export type GuestProfileSectionImage = {
  src: string;
  alt: string;
};

type GuestProfileSectionBaseProps = {
  id: string;
  profiles: GuestProfile[];
  image: GuestProfileSectionImage;
};

type GuestSectionProps = GuestProfileSectionBaseProps & {
  variant: "guest";
  performerName: string;
};

type McSectionProps = GuestProfileSectionBaseProps & {
  variant: "mc";
  performerName?: never;
};

export type GuestProfileSectionProps = GuestSectionProps | McSectionProps;

const IMAGE_SIZES = {
  guest: "(min-width: 1120px) 384px, (min-width: 768px) calc(40vw - 64px), calc(60vw - 12px)",
  mc: "(min-width: 1120px) 313px, (min-width: 768px) calc(33.33vw - 60px), calc(40vw - 8px)",
} as const;

export default function GuestProfileSection(props: GuestProfileSectionProps) {
  const { id, profiles, image, variant } = props;
  const isGuest = variant === "guest";
  const headingId = `guest-profile-section-${id}`;
  const imageView = (
    <div
      className={`relative w-full overflow-hidden border-2 border-main ${isGuest ? "aspect-4/3" : "aspect-2/3"}`}
    >
      <Image
        alt={image.alt}
        className="object-cover"
        fill
        sizes={IMAGE_SIZES[variant]}
        src={image.src}
      />
    </div>
  );
  const profileList = (
    <div className="flex min-w-0 flex-col gap-l md:gap-ll">
      {profiles.map((profile) => (
        <GuestProfileCard key={profile.name} profile={profile} />
      ))}
    </div>
  );

  return (
    <section aria-labelledby={headingId} className="w-full bg-base py-s text-font-main md:px-4l">
      <div className="mx-auto flex w-full max-w-250 flex-col gap-l md:gap-3l">
        <h2 id={headingId} className="px-l font-kaisotai text-title md:px-0 md:text-Ptitle">
          {isGuest ? "ゲスト" : "MC"}
        </h2>
        {isGuest ? (
          <div className="flex min-w-0 flex-col gap-l md:gap-3l">
            <div className="grid min-w-0 grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-center gap-m md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-3l">
              {imageView}
              <p className="text-center text-button wrap-break-word md:text-title">
                {props.performerName}
              </p>
            </div>
            <div className="grid min-w-0 grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-m md:block">
              <div className="min-w-0 pl-l md:max-w-180 md:pl-0">{profileList}</div>
            </div>
          </div>
        ) : (
          <div className="grid min-w-0 grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-end gap-m md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:gap-4l">
            <div className="min-w-0 pl-l md:pl-0">{profileList}</div>
            {imageView}
          </div>
        )}
      </div>
    </section>
  );
}
