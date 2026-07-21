import Image from "next/image";
import EventSection, { type EventSectionEvent } from "@/modules/event/ui/EventSection";
import ButtonMain from "@/components/ui/ButtonMain";
import SectionTitle from "@/components/ui/SectionTitle";
import { PROGRAM_CATEGORIES } from "@/lib/events/constants";

const DUMMY_EVENTS: EventSectionEvent[] = [
  {
    id: "event-sample-1",
    name: "イベント名サンプル1イベント名サンプルイベント名サンプル",
    href: "#1",
    imageUrl: "/favicon/45th-LogoBlue.svg",
  },
  {
    id: "event-sample-2",
    name: "イベント名サンプル2",
    href: "#2",
    imageUrl: "/favicon/45th-LogoBlue.svg",
  },
  {
    id: "event-sample-3",
    name: "イベント名サンプル3",
    href: "#3",
    imageUrl: "/favicon/45th-LogoBlue.svg",
  },
  {
    id: "event-sample-4",
    name: "イベント名サンプル4",
    href: "#4",
    imageUrl: "/favicon/45th-LogoBlue.svg",
  },
  {
    id: "event-sample-5",
    name: "イベント名サンプル5",
    href: "#5",
    imageUrl: "/favicon/45th-LogoBlue.svg",
  },
  {
    id: "event-sample-6",
    name: "イベント名サンプル6",
    href: "#6",
    imageUrl: "/favicon/45th-LogoBlue.svg",
  },
  {
    id: "event-sample-7",
    name: "イベント名サンプル7",
    href: "#7",
    imageUrl: "/favicon/45th-LogoBlue.svg",
  },
  {
    id: "event-sample-8",
    name: "イベント名サンプル8",
    href: "#8",
    imageUrl: "/favicon/45th-LogoBlue.svg",
  },
  {
    id: "event-sample-9",
    name: "イベント名サンプル9",
    href: "#9",
    imageUrl: "/favicon/45th-LogoBlue.svg",
  },
  {
    id: "event-sample-10",
    name: "イベント名サンプル10",
    href: "#10",
    imageUrl: "/favicon/45th-LogoBlue.svg",
  },
];

const EVENT_SECTIONS = PROGRAM_CATEGORIES.map(({ value, label }) => ({
  id: value,
  title: label,
  viewAllHref: `/event/programs/category/${value}`,
  events: DUMMY_EVENTS,
}));

export default function EventPageView() {
  return (
    <div className="flex flex-col gap-4l pb-4l md:gap-5l">
      <section aria-label="ゲスト" className="flex flex-col gap-m md:gap-ll">
        <div className="md:px-pl">
          <SectionTitle title="ゲスト" />
        </div>
        <div className="flex flex-col gap-m md:gap-3l">
          <div className="flex justify-center bg-secondary/20">
            <div className="relative aspect-square w-full md:w-180">
              <Image
                src="/image/event/guest_decoration.webp"
                alt="ゲスト画像"
                fill
                priority
                sizes="(min-width: 768px) 720px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="flex justify-center">
            <ButtonMain href="/guest" title="ゲストページを見る" />
          </div>
        </div>
      </section>
      <section aria-label="イベント・販売" className="flex flex-col gap-s md:gap-ll">
        <div className="md:px-pl">
          <SectionTitle title="イベント・販売" />
        </div>
        <div className="flex flex-col gap-3l bg-base-dark md:gap-5l md:py-4l">
          {EVENT_SECTIONS.map((section) => (
            <EventSection key={section.id} {...section} />
          ))}
        </div>
      </section>
      <section aria-label="協賛企業">
        <div className="flex justify-center">
          <ButtonMain href="/sponsors" title="ご協賛いただいた企業様" />
        </div>
      </section>
    </div>
  );
}
