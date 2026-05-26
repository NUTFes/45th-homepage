import Image from "next/image";

type MapFrameProps = {
  imageSrc?: string;
  alt?: string;
  title?: string;
};

export default function MapFrame({ imageSrc, alt, title }: MapFrameProps) {
  return (
    <div className="relative flex flex-col items-center w-full">

        <div className="p-10 w-[80%]">
            <div className="flex items-stretch gap-0 w-full items-start">
                <div className="text-base text-text-large px-4 bg-main">
                    {title}
                </div>
                <div className="[clip-path:polygon(0%_0%,20%_0%,100%_100%,0%_100%)] self-stretch -ml-px w-[20px] bg-main"></div>

            </div>
            <div className="border-2 border-main relative overflow-hidden flex items-center justify-center text-text-large md:text-Ptext-large" style={{ aspectRatio: '4 / 3' }}>
                {imageSrc ? (
                  <Image src={imageSrc} alt={alt || ''} fill style={{ objectFit: 'cover' }} />
                ) : (
                  <div className="flex flex-col w-full h-full text-main text-center items-center justify-center gap-2">
                    <p className="font-kaisotai text-[24px]">MAP</p>
                    <p>NO IMAGE</p>
                  </div>
                )}
            </div>
        </div>

    </div>

  );
}

