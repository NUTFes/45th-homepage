import { ReactNode } from "react";

type ImportantFrameProps = {
  title: string;
  children: ReactNode;
};

export default function ImportantFrame({ title, children }: ImportantFrameProps) {
  return (
    <div className="w-full border-y-[1.4px] border-main bg-base-dark py-l">
      <div className="mx-auto flex w-full max-w-260 flex-col gap-0.5 px-3l">
        <h3 className="font-sans text-title-small leading-7.25 text-[#ff5bef]">{title}</h3>
        <div className="font-sans text-text-large text-white">{children}</div>
      </div>
    </div>
  );
}
