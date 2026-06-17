import type { ReactNode } from "react";

type SectionTitleProps = {
  title: ReactNode;
};

export default function SectionTitle({ title }: SectionTitleProps) {
  return (
    <div className="inline-block w-fit max-w-full border-b-[1.6px] border-button-line px-l">
      <div className="font-kaisotai text-title break-words text-font-main text-shadow-[1px_2px_2px_var(--color-base-dark)] md:text-Ptitle">
        {title}
      </div>
    </div>
  );
}
