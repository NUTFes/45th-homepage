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
    <article className="flex w-full min-w-0 flex-col gap-xs text-font-main">
      <h3 className="w-fit max-w-full min-w-26 border-b border-main pb-1 text-title-small wrap-break-word md:text-Ptitle-small">
        {profile.name}
      </h3>
      <dl className="flex min-w-0 flex-col gap-1 text-text md:text-Ptext">
        {details.map(({ label, value }) => (
          <div key={label} className="min-w-0 wrap-break-word">
            <dt className="inline font-bold text-accent">{label}：</dt>
            <dd className="inline">{value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
