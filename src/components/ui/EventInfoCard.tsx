import ButtonMain from "@/components/ui/ButtonMain";
import MapFrame from "@/components/ui/MapFrame";
import type { MapFrameProps } from "@/components/ui/MapFrame";

export type EventSchedule = {
  dateLabel: string;
  startLabel: string;
  endLabel: string;
  startsAt: string;
  endsAt: string;
};

type EventInfoMap = Pick<MapFrameProps, "title" | "imageSrc" | "alt"> & {
  href?: string;
  buttonLabel?: string;
};

export type EventInfoCardProps = {
  location: string;
  schedules: readonly EventSchedule[];
  map?: EventInfoMap;
};

export default function EventInfoCard({ location, schedules, map }: EventInfoCardProps) {
  return (
    <div className="flex w-full flex-col bg-base-dark pt-l lg:gap-ll lg:pt-5l lg:pb-pm">
      <div className="flex flex-col gap-m">
        <section className="flex flex-col gap-xs px-ll lg:gap-ss lg:pr-pm lg:pl-4l">
          <div className="w-fit border-b px-1 text-secondary">
            <h2 className="text-title-small text-font-main lg:text-Ptitle-small">日時</h2>
          </div>
          <div className="flex flex-col gap-1">
            {schedules.map((schedule) => (
              <div
                key={schedule.startsAt}
                className="flex flex-wrap gap-x-m gap-y-1 pl-ss text-text-large text-font-main lg:text-Ptext-large"
              >
                <time dateTime={schedule.startsAt}>{schedule.dateLabel}</time>
                <span>
                  <time dateTime={schedule.startsAt}>{schedule.startLabel}</time>~
                  <time dateTime={schedule.endsAt}>{schedule.endLabel}</time>
                </span>
              </div>
            ))}
          </div>
        </section>
        <section className="flex flex-col gap-xs px-ll pb-m lg:gap-ss lg:pr-pm lg:pb-0 lg:pl-4l">
          <div className="w-fit border-b px-1 text-secondary">
            <h2 className="text-title-small text-font-main lg:text-Ptitle-small">場所</h2>
          </div>
          <p className="pl-ss text-text text-font-main lg:text-Ptext-large">{location}</p>
        </section>
      </div>
      {map ? (
        <>
          <div className="mb-l lg:mb-0 lg:pr-pm lg:pl-4l">
            <MapFrame title={map.title} imageSrc={map.imageSrc} alt={map.alt ?? map.title} />
          </div>
          <div className="flex items-center justify-center bg-base pt-m lg:bg-transparent lg:pt-0 lg:pr-pm lg:pl-4l">
            <ButtonMain
              href={map.href ?? "/map"}
              title={map.buttonLabel ?? "マップページはこちら"}
            />
          </div>
        </>
      ) : null}
    </div>
  );
}
