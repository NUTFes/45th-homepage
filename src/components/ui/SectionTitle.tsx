import type { ReactNode } from "react";

type SectionTitleProps = {
  title: ReactNode;
  pb?: boolean;
};

export default function SectionTitle({ title, pb = false }: SectionTitleProps) {
  return (
    <div
      className={`inline-block w-fit max-w-full border-b-[1.6px] border-button-line px-l${pb ? " pb-ss" : ""}`}
    >
      <div className="font-kaisotai text-title break-words text-font-main text-shadow-[1px_2px_2px_var(--color-base-dark)] md:text-Ptitle">
        {title}
      </div>
    </div>
  );
}
