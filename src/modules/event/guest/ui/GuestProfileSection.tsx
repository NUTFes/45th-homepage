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
  guest:
    "(min-width: 1024px) 310px, (min-width: 768px) min(384px, calc(100vw - 356px)), min(224px, calc(100vw - 152px))",
  mc: "(min-width: 1024px) 182px, (min-width: 768px) min(313px, 42vw), min(160px, 40vw)",
} as const;

export default function GuestProfileSection(props: GuestProfileSectionProps) {
  const { id, profiles, image, variant } = props;
  const isGuest = variant === "guest";
  const headingId = `guest-profile-section-${id}`;
  const imageView = (
    <div
      className={`relative min-w-0 overflow-hidden border-2 border-main ${isGuest ? "aspect-4/3 max-w-56 flex-[1_1_14rem] md:aspect-3/2 md:max-w-96 lg:aspect-auto lg:size-77.5 lg:max-w-none lg:flex-none" : "aspect-2/3 max-w-40 flex-[1_1_8rem] md:max-w-78.25 lg:aspect-auto lg:h-68.5 lg:w-45.5 lg:max-w-none lg:flex-none"}`}
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
    <section aria-labelledby={headingId} className="w-full bg-base text-font-main md:px-4l lg:px-0">
      <div className="mx-auto flex w-full max-w-250 flex-col gap-ss">
        <h3 id={headingId} className="px-l font-kaisotai text-title md:px-0 md:text-Ptitle lg:px-l">
          {isGuest ? "ゲスト" : "MC"}
        </h3>
        {isGuest ? (
          <div className="flex min-w-0 flex-col gap-m md:gap-3l lg:gap-ll">
            <div className="flex min-w-0 items-center gap-m pr-l md:gap-3l">
              {imageView}
              <p className="max-w-36 flex-none text-center text-button wrap-break-word md:max-w-60 md:text-title">
                {props.performerName}
              </p>
            </div>
            <div className="min-w-0 pl-l md:px-0 lg:pr-5l lg:pl-l">{profileList}</div>
          </div>
        ) : (
          <div className="flex min-w-0 items-center gap-m pl-l md:gap-4l md:pl-0 lg:gap-l lg:pl-l">
            <div className="min-w-0 flex-1">{profileList}</div>
            {imageView}
          </div>
        )}
      </div>
    </section>
  );
}
