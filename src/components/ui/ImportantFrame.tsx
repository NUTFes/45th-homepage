import { ReactNode } from "react";

type ImportantFrameProps = {
  title: string;
  children: ReactNode;
};

export default function ImportantFrame({ title, children }: ImportantFrameProps) {
  return (
    <div className="w-full border-y-[1.4px] border-main bg-base-dark px-3l py-l">
      <div className="flex w-full flex-col gap-0.5">
        <h3 className="font-sans text-title-small leading-7.25 text-[#ff5bef]">{title}</h3>
        <div className="font-sans text-text-large text-white">{children}</div>
      </div>
    </div>
  );
}
