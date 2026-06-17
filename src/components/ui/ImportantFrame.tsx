import { ReactNode } from "react";

type ImportantFrameProps = {
  title: string;
  children: ReactNode;
};

export default function ImportantFrame({ title, children }: ImportantFrameProps) {
  return (
    <div className="w-full border-y-[1.4px] border-main bg-base-dark py-l shadow-[0px_2px_6px_0px] shadow-base-shadow md:px-pl md:py-3l">
      <div className="mx-auto flex w-full max-w-260 flex-col gap-0.5 px-3l md:px-0">
        <h3 className="font-sans text-button text-accent md:text-Ptitle-small">{title}</h3>
        <div className="font-sans text-textb text-white md:text-Ptext-large">{children}</div>
      </div>
    </div>
  );
}
