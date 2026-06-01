import EventFrame, { type EventFrameProps } from "@/components/ui/EventFrame";
import Link from "next/link";

type EventSectionProps = {
  title: string;
  viewAllHref: string;
  events: EventFrameProps[];
};

export default function EventSection({ title, viewAllHref, events }: EventSectionProps) {
  return (
    <div className="gap-ss flex flex-col">
      <div className="flex items-center justify-between pr-m pl-l">
        <div className="font-kaisotai text-title text-font-main">{title}</div>
        <Link href={viewAllHref} className="text-text text-font-main">
          すべて表示
        </Link>
      </div>
    </div>
  );
}
