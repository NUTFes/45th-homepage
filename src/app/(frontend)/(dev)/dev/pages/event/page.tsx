import { DevPageContainer } from "../../_components/DevPageContainer";
import { DevPanel } from "../../_components/DevPanel";
import { DevSection } from "../../_components/DevSection";
import EventSection from "@/modules/event/ui/EventSection";
import type { EventFrameProps } from "@/components/ui/EventFrame";
import EventPageView from "@/modules/event/ui/EventPageView";
import ProgramPageView from "@/modules/event/ui/programs/category/[category]/ProgramPageView";
import { PROGRAM_CATEGORIES } from "@/lib/events/constants";
import GuestProfileCard, { type GuestProfile } from "@/modules/event/guest/ui/GuestProfileCard";
import GuestProfileSection from "@/modules/event/guest/ui/GuestProfileSection";

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
    name: "誠さん(左)",
    birthDate: "1999年03月25日",
    birthplace: "東京都 世田谷区",
    hobby: "テニス／絵を描く事／物作り／音楽鑑賞",
    specialSkill: "ハーモニカ／散髪／髭剃り（理容師免許取得）",
  },
  {
    name: "愛さん(右)",
    birthDate: "1996年09月19日",
    birthplace: "神奈川県 横浜市",
    hobby: "動物鑑賞／音楽鑑賞／SMAP",
    specialSkill: "犬の基本的なしつけ／ブルースハープ（ハーモニカ）／肩もみ",
  },
];

const mcProfiles: GuestProfile[] = [
  {
    name: "清野幹さん",
    birthDate: "1979年02月22日",
    birthplace: "阿賀野市",
    hobby: "一人イントロクイズ",
    specialSkill: "二段階右折",
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
          <div className="flex max-w-[430px] flex-col gap-l bg-base p-s">
            {guestProfiles.map((profile) => (
              <GuestProfileCard key={profile.name} profile={profile} />
            ))}
          </div>
        </DevPanel>
      </DevSection>
      <DevSection title="GuestProfileSection">
        <DevPanel title="GuestProfileSection (src/modules/event/guest/ui)">
          <div className="flex flex-col gap-4l bg-base">
            <GuestProfileSection
              id="guest-preview"
              variant="guest"
              performerName="ヨネダ２０００"
              profiles={guestProfiles}
              image={{
                src: "/image/event/guest.jpg",
                alt: "ヨネダ２０００",
              }}
            />
            <GuestProfileSection
              id="mc-preview"
              variant="mc"
              profiles={mcProfiles}
              image={{
                src: "/image/event/mc.jpg",
                alt: "MCの清野幹さん",
              }}
            />
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
      <DevSection title="ProgramPageView">
        {PROGRAM_CATEGORIES.map(({ value, label }) => (
          <DevPanel key={value} title={`ProgramPageView - ${label}`}>
            <div className="bg-base">
              <ProgramPageView category={value} />
            </div>
          </DevPanel>
        ))}
      </DevSection>
    </DevPageContainer>
  );
}
