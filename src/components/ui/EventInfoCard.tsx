import ButtonMain from "@/components/ui/ButtonMain";
import MapFrame from "@/components/ui/MapFrame";
import type { MapFrameProps } from "@/components/ui/MapFrame";

type EventInfoCardProps = Pick<MapFrameProps, "title" | "imageSrc" | "alt"> & {
  location: string;
};

export default function EventInfoCard({ location, title, imageSrc, alt }: EventInfoCardProps) {
  return (
    <div className="flex w-full flex-col bg-base-dark pt-l">
      <div className="flex flex-col gap-m">
        <section aria-label="日時" className="flex flex-col gap-xs px-ll">
          <div className="w-fit border-b px-1 text-secondary">
            <div className="text-title-small text-font-main">日時</div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex gap-m pl-ss">
              <time dateTime="2026-09-19" className="text-text-large text-font-main">
                9月19日（土）
              </time>
              <time dateTime="10:00/17:00" className="text-text-large text-font-main">
                10：00 ～ 17：00
              </time>
            </div>
            <div className="flex gap-m pl-ss">
              <time dateTime="2026-09-20" className="text-text-large text-font-main">
                9月20日（日）
              </time>
              <time dateTime="10:00/17:00" className="text-text-large text-font-main">
                10：00 ～ 17：00
              </time>
            </div>
          </div>
        </section>
        <section aria-label="場所" className="flex flex-col gap-xs px-ll pb-m">
          <div className="w-fit border-b px-1 text-secondary">
            <div className="text-title-small text-font-main">場所</div>
          </div>
          <p className="pl-ss text-text text-font-main">{location}</p>
        </section>
      </div>
      <div className="mb-l">
        <MapFrame title={title} imageSrc={imageSrc} alt={alt ?? title} />
      </div>
      <div className="flex items-center justify-center bg-base pt-m">
        <ButtonMain href="/map" title="マップページはこちら" />
      </div>
    </div>
  );
}
