type ProgramTagBadgeProps = {
  label: string;
};

export default function ProgramTagBadge({ label }: ProgramTagBadgeProps) {
  return (
    <span className="rounded-[10px] border border-main bg-base-dark px-s py-ss text-center text-textb wrap-break-word text-font-main md:text-Ptext md:font-bold">
      {label}
    </span>
  );
}
