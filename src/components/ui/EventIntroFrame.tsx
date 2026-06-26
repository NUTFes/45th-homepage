export type EventIntroFrameProps = {
  title: string;
  body: string;
};

const CORNER_CLASS_NAMES = [
  "top-0 left-0 border-t-[3.6] border-l-[3.6] md:top-0 md:left-0 md:border-t-[4.8] md:border-l-[4.8]", // 左上
  "top-0 right-0 border-t-[3.6] border-r-[3.6] md:top-0 md:right-0 md:border-t-[4.8] md:border-r-[4.8]", // 右上
  "bottom-0 left-0 border-b-[3.6] border-l-[3.6] md:bottom-0 md:left-0 md:border-b-[4.8] md:border-l-[4.8]", // 左下
  "bottom-0 right-0 border-b-[3.6] border-r-[3.6] md:bottom-0 md:right-0 md:border-b-[4.8] md:border-r-[4.8]", // 右下
] as const;

export default function EventIntroFrame({ title, body }: EventIntroFrameProps) {
  return (
    <div className="relative flex w-full flex-col gap-s overflow-hidden border-1 border-main bg-base px-m py-s text-secondary shadow-[0px_2px_6px_0px] shadow-base-shadow md:px-ll md:py-m">
      {CORNER_CLASS_NAMES.map((pos, index) => (
        <div
          key={index}
          className={`absolute size-7.5 border-main md:size-10 ${pos}`}
          aria-hidden="true"
        />
      ))}
      <div className="px-xs font-kaisotai md:px-3l">
        <div className="border-b-1 border-secondary px-s md:px-3l">
          <p className="text-center text-title-small md:text-title">{title}</p>
        </div>
      </div>
      <div className="md:px-s">
        <p className="font-sans text-text md:text-Ptext">{body}</p>
      </div>
    </div>
  );
}
