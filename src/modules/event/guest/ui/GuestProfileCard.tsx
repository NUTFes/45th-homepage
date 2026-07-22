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
    <article className="flex w-full max-w-50 min-w-0 flex-col gap-s text-font-main md:max-w-none">
      <h4 className="w-40 max-w-full border-b border-font-main pb-1 text-textb font-bold wrap-break-word md:w-fit md:min-w-26 md:pr-l md:text-Ptitle-small lg:w-40 lg:min-w-0 lg:pr-0 lg:text-Ptext">
        {profile.name}
      </h4>
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
