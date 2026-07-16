import ButtonMain from "@/components/ui/ButtonMain";
import MapFrame from "@/components/ui/MapFrame";
import type { MapFrameProps } from "@/components/ui/MapFrame";

type EventInfoCardProps = Pick<MapFrameProps, "title" | "imageSrc" | "alt"> & {
  location: string;
};

export default function EventInfoCard({ location, title, imageSrc, alt }: EventInfoCardProps) {
  return (
    <div className="flex h-full w-full flex-col bg-base-dark pt-l md:sticky md:top-18 md:gap-ll md:pt-5l md:pb-pm">
      <div className="flex flex-col gap-m">
        <section
          aria-label="日時"
          className="flex flex-col gap-xs px-ll md:gap-ss md:pr-pm md:pl-4l"
        >
          <div className="w-fit border-b px-1 text-secondary">
            <div className="text-title-small text-font-main md:text-Ptitle-small">日時</div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex gap-m pl-ss">
              <time
                dateTime="2026-09-19"
                className="text-text-large text-font-main md:text-Ptext-large"
              >
                9月19日（土）
              </time>
              <span className="text-text-large text-font-main md:text-Ptext-large">
                <time dateTime="10:00">10：00</time> ～ <time dateTime="17:00">17：00</time>
              </span>
            </div>
            <div className="flex gap-m pl-ss">
              <time
                dateTime="2026-09-20"
                className="text-text-large text-font-main md:text-Ptext-large"
              >
                9月20日（日）
              </time>
              <span className="text-text-large text-font-main md:text-Ptext-large">
                <time dateTime="10:00">10：00</time> ～ <time dateTime="17:00">17：00</time>
              </span>
            </div>
          </div>
        </section>
        <section
          aria-label="場所"
          className="flex flex-col gap-xs px-ll pb-m md:gap-ss md:pr-pm md:pb-0 md:pl-4l"
        >
          <div className="w-fit border-b px-1 text-secondary">
            <div className="text-title-small text-font-main md:text-Ptitle-small">場所</div>
          </div>
          <p className="pl-ss text-text text-font-main md:text-Ptext-large">{location}</p>
        </section>
      </div>
      <div className="mb-l md:mb-0 md:pr-pm md:pl-4l">
        <MapFrame title={title} imageSrc={imageSrc} alt={alt ?? title} />
      </div>
      <div className="flex items-center justify-center bg-base pt-m md:bg-transparent md:pt-0 md:pr-pm md:pl-4l">
        <ButtonMain href="/map" title="マップページはこちら" />
      </div>
    </div>
  );
}
