type SectionTitleProps = {
  title: string;
};

export default function SectionTitle({ title }: SectionTitleProps) {
  return (
    <div className="inline-block border-b-[1.6px] border-button-line px-l">
      <div className="font-kaisotai text-title text-font-main text-shadow-[1px_2px_2px_var(--color-base-dark)]">
        {title}
      </div>
    </div>
  );
}
