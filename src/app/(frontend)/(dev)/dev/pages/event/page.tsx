import { DevPageContainer } from "../../_components/DevPageContainer";
import { DevPanel } from "../../_components/DevPanel";
import { DevSection } from "../../_components/DevSection";
import EventSection from "@/modules/event/ui/EventSection";
import type { EventFrameProps } from "@/components/ui/EventFrame";
import EventPageView from "@/modules/event/ui/EventPageView";
import GuestProfileCard, { type GuestProfile } from "@/modules/event/guest/ui/GuestProfileCard";

export const metadata = {
  title: "Event Page Modules - Dev",
  description: "src/modules/event のコンポーネントをページ文脈で確認",
};

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

const guestProfiles: GuestProfile[] = [
  {
    name: "○○　○○さん",
    birthDate: "2000年1月1日",
    birthplace: "新潟県",
    hobby: "映画鑑賞",
    specialSkill: "ダンス",
  },
  {
    name: "長い名前の出演者サンプルさん",
    birthDate: "2000年12月31日",
    birthplace: "とても長い地名が入った場合の表示確認",
    hobby: "映画鑑賞、音楽鑑賞、スポーツ観戦",
    specialSkill: "長いプロフィール情報を折り返して表示すること",
  },
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
      <DevSection title="GuestProfileCard">
        <DevPanel title="GuestProfileCard (src/modules/event/guest/ui)">
          <div className="flex max-w-[430px] flex-col gap-m">
            {guestProfiles.map((profile) => (
              <GuestProfileCard key={profile.name} profile={profile} />
            ))}
          </div>
        </DevPanel>
      </DevSection>
      <DevSection title="EventPageView">
        <DevPanel title="EventPageView (src/modules/event/ui)">
          <div className="bg-base">
            <EventPageView />
          </div>
        </DevPanel>
      </DevSection>
    </DevPageContainer>
  );
}
