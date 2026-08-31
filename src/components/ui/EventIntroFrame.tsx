import type { ReactNode } from "react";

export type EventIntroFrameProps = {
  title: ReactNode;
  body: string;
  headingLevel?: 1 | 2;
};

const CORNER_CLASS_NAMES = [
  "top-0 left-0 border-t-[3.6px] border-l-[3.6px] md:top-0 md:left-0 md:border-t-[4.8px] md:border-l-[4.8px]", // 左上
  "top-0 right-0 border-t-[3.6px] border-r-[3.6px] md:top-0 md:right-0 md:border-t-[4.8px] md:border-r-[4.8px]", // 右上
  "bottom-0 left-0 border-b-[3.6px] border-l-[3.6px] md:bottom-0 md:left-0 md:border-b-[4.8px] md:border-l-[4.8px]", // 左下
  "bottom-0 right-0 border-b-[3.6px] border-r-[3.6px] md:bottom-0 md:right-0 md:border-b-[4.8px] md:border-r-[4.8px]", // 右下
] as const;

export default function EventIntroFrame({ title, body, headingLevel = 2 }: EventIntroFrameProps) {
  const Heading = headingLevel === 1 ? "h1" : "h2";

  return (
    <div className="relative flex w-full flex-col gap-s overflow-hidden border border-main bg-base px-m py-s text-secondary shadow-[0px_2px_6px_0px] shadow-base-shadow md:px-ll md:py-m">
      {CORNER_CLASS_NAMES.map((pos, index) => (
        <div
          key={index}
          className={`absolute size-7.5 border-main md:size-10 ${pos}`}
          aria-hidden="true"
        />
      ))}
      <div className="px-xs font-sans md:px-3l">
        <div className="border-b border-secondary px-s md:px-3l">
          <Heading className="text-center text-title-small font-medium md:text-title xl:text-Ptitle">
            {title}
          </Heading>
        </div>
      </div>
      <div className="md:px-s">
        <p className="font-sans text-text whitespace-pre-line md:text-Ptext">{body}</p>
      </div>
    </div>
  );
}
