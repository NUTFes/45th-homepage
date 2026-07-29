import Image from "next/image";

export type GreetingSectionProps = {
  name: string;
  nameEng: string;
  imageSrc: string;
  imageAlt: string;
  greetingTitle: string;
  greetingBody: string;
};

// 写真と名前をコンテナ幅に応じて常に等幅で並べるための共有クラス
const itemWidth = "min-w-0 flex-1 basis-0";

export default function GreetingSection({
  name,
  nameEng,
  imageSrc,
  imageAlt,
  greetingTitle,
  greetingBody,
}: GreetingSectionProps) {
  return (
    <div className="flex flex-col md:flex-row border-t border-b border-main md:pl-pm bg-base-dark text-font-main">
      <div className="md:flex md:flex-1 md:flex-row md:items-center md:justify-center md:gap-ss">
        <div className="hidden md:block md:[writing-mode:vertical-rl] md:text-title md:font-kaisotai">
            <h1>{nameEng}</h1>
        </div>
        <div className="border-b border-main bg-base md:flex md:h-[909px] md:w-100 md:items-center md:justify-center md:py-4l">
            <div className="flex flex-row items-center gap-3l md:w-full md:flex-col md:gap-m">
                <Image
                src={imageSrc}
                alt={imageAlt}
                width={96}
                height={144}
                className={`${itemWidth} aspect-[2/3] w-full border-2 border-main object-cover`}
                />
                <div
                className={`flex items-center justify-start md:flex-col md:justify-center md:gap-m md:shrink-0 ${itemWidth}`}
                >
                <h1 className="text-title-small md:text-Ptitle-small">{name}</h1>
                </div>
            </div>
        </div>
      </div>
      <div className="px-ll md:pl-4l md:pr-pm py-ll">
        <h1 className="text-textb md:text-Ptitle-small">{greetingTitle}</h1>
        <p className="text-text md:text-Ptext whitespace-pre-line">{"\n"+greetingBody}</p>
      </div>
    </div>
  );
}