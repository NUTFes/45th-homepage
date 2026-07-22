import Image from "next/image";

import GuestProfileCard, { type GuestProfile } from "./GuestProfileCard";

export type GuestProfileSectionImage = {
  src: string;
  alt: string;
};

type GuestProfileSectionBaseProps = {
  id: string;
  profiles: readonly GuestProfile[];
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
  guest: "(min-width: 1024px) 310px, 224px",
  mc: "(min-width: 1024px) 182px, 150px",
} as const;

export default function GuestProfileSection(props: GuestProfileSectionProps) {
  const { id, profiles, image, variant } = props;
  const isGuest = variant === "guest";
  const headingId = `guest-profile-section-${id}`;
  const imageView = (
    <div
      className={`relative shrink-0 overflow-hidden border-2 border-main ${isGuest ? "size-56 lg:size-77.5" : "h-56.25 w-37.5 lg:h-68.5 lg:w-45.5"}`}
    >
      <Image
        alt={image.alt}
        className={isGuest ? "object-cover" : "object-contain"}
        fill
        sizes={IMAGE_SIZES[variant]}
        src={image.src}
      />
    </div>
  );
  const profileList = (
    <div className="flex min-w-0 flex-col gap-3l">
      {profiles.map((profile) => (
        <GuestProfileCard key={profile.name} profile={profile} />
      ))}
    </div>
  );

  return (
    <section aria-labelledby={headingId} className="w-full bg-base text-font-main">
      <div className="flex w-full flex-col gap-ss">
        <h3 id={headingId} className="px-l font-kaisotai text-title lg:text-Ptitle">
          {isGuest ? "ゲスト" : "MC"}
        </h3>
        {isGuest ? (
          <div className="flex min-w-0 flex-col gap-m lg:gap-ll">
            <div className="flex min-w-0 items-center gap-m pr-l lg:gap-3l">
              {imageView}
              <p className="max-w-36 flex-none text-center text-button whitespace-nowrap lg:max-w-60 lg:text-title">
                {props.performerName}
              </p>
            </div>
            <div className="min-w-0 pl-l lg:pr-5l">{profileList}</div>
          </div>
        ) : (
          <div className="flex min-w-0 items-center justify-between pl-l">
            <div className="min-w-0 flex-1">{profileList}</div>
            {imageView}
          </div>
        )}
      </div>
    </section>
  );
}
