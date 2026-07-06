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
        sizes={isGuest ? "(min-width: 768px) 400px, 55vw" : "(min-width: 768px) 280px, 42vw"}
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
    <section
      aria-labelledby={headingId}
      className="w-full bg-base px-m py-s text-font-main md:px-4l"
    >
      <div className="mx-auto flex w-full max-w-250 flex-col gap-l md:gap-3l">
        <h2 id={headingId} className="font-kaisotai text-title md:text-Ptitle">
          {isGuest ? "ゲスト" : "MC"}
        </h2>
        {isGuest ? (
          <div className="flex min-w-0 flex-col gap-l md:gap-3l">
            <div className="grid min-w-0 grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-center gap-s md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-4l">
              {imageView}
              <p className="text-center text-textb wrap-break-word md:text-Ptext-large">
                {props.performerName}
              </p>
            </div>
            <div className="min-w-0 md:max-w-180">{profileList}</div>
          </div>
        ) : (
          <div className="grid min-w-0 grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-end gap-s md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:gap-4l">
            {profileList}
            {imageView}
          </div>
        )}
      </div>
    </section>
  );
}
