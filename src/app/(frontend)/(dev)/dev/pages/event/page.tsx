import { DevPageContainer } from "../../_components/DevPageContainer";
import { DevPanel } from "../../_components/DevPanel";
import { DevSection } from "../../_components/DevSection";
import EventSection from "@/modules/event/ui/EventSection";
import type { EventFrameProps } from "@/components/ui/EventFrame";

const dummyEvents: EventFrameProps[] = [
  { name: "Sweet Photato Contest", href: "/news", imageUrl: "/icon/Instagram.png" },
  { name: "カラフルコーラスフェスティバル", href: "/dev", imageUrl: "/icon/Instagram.png" },
  {
    name: "ドローン・ロボット操縦体験＋研究紹介ああああああああああああああ",
    href: "/dev/events",
    imageUrl: "/icon/Instagram.png",
  },
  { name: "無線機器、電子工作物展示会", href: "/common", imageUrl: "/icon/Instagram.png" },
];

export default function DevTopPageModulesPage() {
  return (
    <DevPageContainer
      title="Event Page Modules"
      description="src/modules/event/ui のコンポーネントをページ文脈で確認"
    >
      <DevSection title="EventSection">
        <DevPanel title="EventSection (src/modules/event/ui)">
          <div className="bg-base">
            <EventSection id="event-section" title="企画" viewAllHref="/" events={dummyEvents} />
          </div>
        </DevPanel>
      </DevSection>
    </DevPageContainer>
  );
}
