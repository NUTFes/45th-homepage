import EventSection from "@/modules/event/ui/EventSection";
import ButtonMain from "@/components/ui/ButtonMain";
import SectionTitle from "@/components/ui/SectionTitle";
import { type EventFrameProps } from "@/components/ui/EventFrame";

const DUMMY_EVENTS: EventFrameProps[] = [
  {
    name: "イベント名サンプル1イベント名サンプルイベント名サンプル",
    href: "#1",
    imageUrl: "/favicon/45th-LogoBlue.svg",
  },
  { name: "イベント名サンプル2", href: "#2", imageUrl: "/favicon/45th-LogoBlue.svg" },
  { name: "イベント名サンプル3", href: "#3", imageUrl: "/favicon/45th-LogoBlue.svg" },
  { name: "イベント名サンプル4", href: "#4", imageUrl: "/favicon/45th-LogoBlue.svg" },
  { name: "イベント名サンプル5", href: "#5", imageUrl: "/favicon/45th-LogoBlue.svg" },
];

const EVENT_SECTIONS = [
  { id: "section1", title: "企画", viewAllHref: "#", events: DUMMY_EVENTS },
  { id: "section2", title: "展示体験", viewAllHref: "#", events: DUMMY_EVENTS },
  { id: "section3", title: "食品販売", viewAllHref: "#", events: DUMMY_EVENTS },
  { id: "section4", title: "物品販売", viewAllHref: "#", events: DUMMY_EVENTS },
  { id: "section5", title: "企業ブース", viewAllHref: "#", events: DUMMY_EVENTS },
];

export default function EventPageView() {
  return (
    <div className="flex flex-col gap-4l pb-4l">
      <section aria-label="ゲスト" className="flex flex-col gap-s">
        <SectionTitle title="ゲスト" />
        <div className="flex justify-center">
          <ButtonMain href="/guest" title="もっと見る　＞" />
        </div>
      </section>
      <section aria-label="イベント・販売" className="flex flex-col gap-3l">
        <SectionTitle title="イベント・販売" />
        {EVENT_SECTIONS.map((section) => (
          <EventSection key={section.id} {...section} />
        ))}
      </section>
      <section aria-label="協賛企業">
        <div className="flex justify-center">
          <ButtonMain href="/sponsors" title="ご協賛いただいた企業様　＞" />
        </div>
      </section>
    </div>
  );
}
