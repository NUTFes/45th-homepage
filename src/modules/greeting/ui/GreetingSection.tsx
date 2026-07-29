import Image from "next/image";

export type GreetingSectionProps = {
  name: string;
  imageSrc: string;
  imageAlt: string;
  greetingTitle: string;
  greetingBody: string;
};

// 写真と名前をコンテナ幅に応じて常に等幅で並べるための共有クラス
const itemWidth = "min-w-0 flex-1 basis-0";

export default function GreetingSection({
  name,
  imageSrc,
  imageAlt,
  greetingTitle,
  greetingBody,
}: GreetingSectionProps) {
  return (
    <div className="flex flex-col border-t border-b border-main bg-base-dark text-font-main">
      <div className="flex flex-row gap-3l border-b border-main bg-base">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={96}
          height={144}
          className={`${itemWidth} aspect-[2/3] w-full border-2 border-main object-cover`}
        />
        <div className={`flex items-center justify-start ${itemWidth}`}>
          <h1 className="text-title-small">{name}</h1>
        </div>
      </div>
      <div className="px-ll py-ll">
        <h1 className="text-textb">{greetingTitle}</h1>
        <p className="text-text whitespace-pre-line">{"\n"+greetingBody}</p>
      </div>
    </div>
  );
}