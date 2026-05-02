import { ReactNode } from "react";

type PcImportantFrameProps = {
  title: string;
  children: ReactNode;
};

export default function PcImportantFrame({ title, children }: PcImportantFrameProps) {
  return (
    <div className="w-full border-y-[1.4px] border-main bg-base-dark py-l">
      <div className="mx-auto flex w-full max-w-260 flex-col gap-0.5 px-3l">
        <h3 className="font-sans text-title-small leading-7.25 text-accent md:text-Ptitle-small">
          {title}
        </h3>
        <div className="font-sans text-text-large text-white md:text-Ptext-large">{children}</div>
      </div>
    </div>
  );
}
