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
    <div className="flex flex-col border-y border-main text-font-main lg:flex-row lg:items-stretch lg:pl-pm">
      <div className="lg:flex lg:flex-1 lg:justify-center lg:gap-ss">
        <p className="hidden font-kaisotai text-title [writing-mode:vertical-rl] lg:block lg:self-center">
          {nameEng}
        </p>
        <div className="border-b border-main lg:flex lg:w-100 lg:flex-col lg:justify-center lg:border-x lg:border-b-0 lg:py-4l">
          <div className="flex items-center gap-3l lg:w-full lg:flex-col lg:gap-m">
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={96}
              height={144}
              className={`${itemSize} aspect-[2/3] w-full border border-main object-cover`}
            />
            <div
              className={`flex items-center lg:shrink-0 lg:flex-col lg:justify-center ${itemSize}`}
            >
              <h2 className="text-title-small lg:text-Ptitle-small">{name}</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center gap-m bg-base-dark p-ll lg:gap-l lg:pr-pm lg:pl-4l">
        <h2 className="text-textb lg:text-Ptitle-small">{greetingTitle}</h2>
        <p className="text-text whitespace-pre-line lg:text-Ptext">{greetingBody}</p>
      </div>
    </div>
  );
}
