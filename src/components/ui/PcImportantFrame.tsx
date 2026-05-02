import { ReactNode } from "react";

type PcImportantFrameProps = {
  title: string;
  children: ReactNode;
};

export default function PcImportantFrame({
  title,
  children,
}: PcImportantFrameProps) {
  return (
    <div className="w-full border-y-[1.4px] border-main bg-base-dark px-pl py-3l shadow-[0px_2px_6px_0px_var(--color-base)]">
      <div className="mx-auto flex w-full max-w-260 flex-col gap-0.5">
        <h3 className="font-sans text-Ptitle-small leading-7.25 text-accent">
          {title}
        </h3>
        <div className="font-sans text-Ptext-large text-white">{children}</div>
      </div>
    </div>
  );
}
