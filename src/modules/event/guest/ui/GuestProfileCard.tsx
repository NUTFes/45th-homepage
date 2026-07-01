export type GuestProfile = {
  name: string;
  birthDate: string;
  birthplace: string;
  hobby: string;
  specialSkill: string;
};

type GuestProfileCardProps = {
  profile: GuestProfile;
};

export default function GuestProfileCard({ profile }: GuestProfileCardProps) {
  const details = [
    { label: "生年月日", value: profile.birthDate },
    { label: "出身地", value: profile.birthplace },
    { label: "趣味", value: profile.hobby },
    { label: "特技", value: profile.specialSkill },
  ];

  return (
    <article className="flex w-full flex-col bg-base px-s pt-ss pr-3l pb-s text-font-main">
      <h2 className="border-b border-font-main pb-ss text-title-large wrap-break-word">
        {profile.name}
      </h2>
      <dl className="mt-3l flex flex-col gap-s text-title">
        {details.map(({ label, value }) => (
          <div key={label} className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)]">
            <dt className="whitespace-nowrap">{label}：</dt>
            <dd className="min-w-0 wrap-break-word">{value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
