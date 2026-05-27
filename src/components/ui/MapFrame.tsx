import Image from "next/image";

type MapFrameProps = {
  imageSrc?: string;
  alt?: string;
  title?: string;
};

export default function MapFrame({ imageSrc, alt, title }: MapFrameProps) {
  return (
    <div className="relative flex w-full flex-col items-center">
      <div className="w-[80%] p-10">
        <div className="flex w-full items-start items-stretch gap-0">
          <div className="bg-main px-4 text-text-large text-base">{title}</div>
          <div className="-ml-px w-[20px] self-stretch bg-main [clip-path:polygon(0%_0%,20%_0%,100%_100%,0%_100%)]"></div>
        </div>
        <div
          className="relative flex items-center justify-center overflow-hidden border-2 border-main text-text-large md:text-Ptext-large"
          style={{ aspectRatio: "4 / 3" }}
        >
          {imageSrc ? (
            <Image src={imageSrc} alt={alt || ""} fill style={{ objectFit: "cover" }} />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-base text-center text-main">
              <p className="font-kaisotai text-[24px]">MAP</p>
              <p>NO IMAGE</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
