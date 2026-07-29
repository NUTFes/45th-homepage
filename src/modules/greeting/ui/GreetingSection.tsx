import Image from "next/image";

export type GreetingSectionProps = {
  name: string;
  nameEng: string;
  imageSrc: string;
  imageAlt: string;
  greetingTitle: string;
  greetingBody: string;
};

// モバイル（横並び）で写真と名前を等幅に、PC（縦積み）で高さを分け合うための共有クラス
const itemSize = "min-w-0 flex-1 basis-0";

export default function GreetingSection({
  name,
  nameEng,
  imageSrc,
  imageAlt,
  greetingTitle,
  greetingBody,
}: GreetingSectionProps) {
  return (
    <div className="flex flex-col border-y border-main bg-base-dark text-font-main md:flex-row md:pl-pm">
      <div className="md:flex md:flex-1 md:items-center md:justify-center md:gap-ss">
        <p className="hidden font-kaisotai text-title [writing-mode:vertical-rl] md:block">
          {nameEng}
        </p>
        <div className="border-b border-main bg-base md:flex md:h-[909px] md:w-100 md:items-center md:justify-center md:py-4l">
          <div className="flex items-center gap-3l md:w-full md:flex-col md:gap-m">
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={96}
              height={144}
              className={`${itemSize} aspect-[2/3] w-full border-2 border-main object-cover`}
            />
            <div
              className={`flex items-center md:shrink-0 md:flex-col md:justify-center ${itemSize}`}
            >
              <h2 className="text-title-small md:text-Ptitle-small">{name}</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-m p-ll md:gap-l md:pr-pm md:pl-4l">
        <h2 className="text-textb md:text-Ptitle-small">{greetingTitle}</h2>
        <p className="text-text whitespace-pre-line md:text-Ptext">{greetingBody}</p>
      </div>
    </div>
  );
}
