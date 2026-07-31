import Image from "next/image";

import EventInfoCard, { type EventInfoCardProps } from "@/components/ui/EventInfoCard";
import EventIntroFrame from "@/components/ui/EventIntroFrame";
import SectionTitle from "@/components/ui/SectionTitle";
import TicketDistributionInfo from "@/components/ui/TicketDistributionInfo";
import SponsorAdsBoundary from "@/modules/sponsors/ui/SponsorAdsBoundary";
import GuestInformationSection from "@/modules/event/guest/ui/GuestInformationSection";
import GuestProfileSection from "@/modules/event/guest/ui/GuestProfileSection";
import type { GuestProfile } from "@/modules/event/guest/ui/GuestProfileCard";
import type { GuestPageDTO } from "@/modules/events/types";

const INTRODUCTION = {
  title: (
    <>
      <span>ヨネダ２０００が</span>
      <span className="xl:block">やってくる！</span>
    </>
  ),
  body: `お笑い界の異端児「ヨネダ2000」が技大祭にやってくる！

まさに奇想天外！M1ファイナリストにして脳を揺さぶる独特なテンポと、クセになるリズムネタが炸裂します！

ゲストイベントは技大祭2日目、9月20日(日)13:00~14:00に体育館にて行われます。この日限りのヨネダワールドをぜひお見逃しなく!`,
} as const;

const GUEST_EVENT_INFO = {
  location: "体育館",
  schedules: [
    {
      dateLabel: "9月20日(日)",
      startLabel: "13:00",
      endLabel: "14:00",
      startsAt: "2026-09-20T13:00:00+09:00",
      endsAt: "2026-09-20T14:00:00+09:00",
    },
  ],
  map: {
    title: "体育館",
  },
} satisfies EventInfoCardProps;

const GUEST_PROFILES: readonly GuestProfile[] = [
  {
    name: "誠さん(左)",
    birthDate: "1999年03月25日",
    birthplace: "東京都 世田谷区",
    hobby: "テニス/絵を描く事/物作り/音楽鑑賞",
    specialSkill: "ハーモニカ/散髪/髭剃り（理容師免許取得）",
  },
  {
    name: "愛さん(右)",
    birthDate: "1996年09月19日",
    birthplace: "神奈川県 横浜市",
    hobby: "動物鑑賞/音楽鑑賞/SMAP",
    specialSkill: "犬の基本的なしつけ/ブルースハープ（ハーモニカ）/肩もみ",
  },
];

const MC_PROFILES: readonly GuestProfile[] = [
  {
    name: "清野幹さん",
    birthDate: "1979年02月22日",
    birthplace: "阿賀野市",
    hobby: "一人イントロクイズ",
    specialSkill: "二段階右折",
  },
];

type GuestPageViewProps = {
  data: GuestPageDTO;
};

export default function GuestPageView({ data }: GuestPageViewProps) {
  return (
    <div className="relative min-h-dvh overflow-x-clip bg-base">
      <TicketDistributionInfo statusText={data.ticketDistributionStatusText} />
      <Image
        src="/image/PageBack2.svg"
        alt=""
        aria-hidden="true"
        width={243}
        height={644}
        className="pointer-events-none absolute top-171 left-xs z-0 hidden xl:block"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-[1320px] grid-cols-1 gap-y-4l pb-4l md:pb-pm xl:grid-cols-[minmax(0,1fr)_minmax(320px,540px)] xl:gap-x-5l xl:pl-4l">
        <div className="relative isolate xl:col-start-1 xl:row-start-1 xl:pt-5l">
          <Image
            src="/image/PageBack1.svg"
            alt=""
            aria-hidden="true"
            width={287}
            height={333}
            className="pointer-events-none absolute top-0 -right-[110px] z-0 hidden max-w-none xl:block"
          />
          <Image
            src="/image/event/guest-main.png"
            alt="お笑いコンビ「ヨネダ2000」の誠さんと愛さん"
            width={2992}
            height={2992}
            preload
            sizes="(min-width: 1320px) 640px, (min-width: 1280px) calc(100vw - 680px), 100vw"
            className="relative z-10 h-auto w-full"
          />
        </div>

        <div className="px-ll xl:col-start-1 xl:row-start-2 xl:px-0">
          <EventIntroFrame {...INTRODUCTION} headingLevel={1} />
        </div>

        <aside className="relative bg-base-dark xl:sticky xl:top-18 xl:z-20 xl:col-start-2 xl:row-start-1 xl:row-end-7 xl:h-[calc(100dvh-4.5rem)] xl:self-start">
          <div className="relative min-h-full bg-base-dark xl:after:pointer-events-none xl:after:absolute xl:after:inset-y-0 xl:after:left-full xl:after:w-screen xl:after:bg-base-dark xl:after:content-['']">
            <EventInfoCard {...GUEST_EVENT_INFO} />
          </div>
        </aside>

        <GuestInformationSection
          id="ticket-distribution"
          title="整理券配布について"
          status="coming-soon"
          className="xl:col-start-1 xl:row-start-3 xl:mt-m"
        />

        <GuestInformationSection
          id="admission"
          title="入場について"
          status="coming-soon"
          className="xl:col-start-1 xl:row-start-4"
        />

        <GuestInformationSection
          id="venue-cautions"
          title="会場での注意事項"
          status="coming-soon"
          className="xl:col-start-1 xl:row-start-5"
        />

        <section
          aria-labelledby="guest-performers-heading"
          className="relative flex min-w-0 flex-col gap-s xl:col-start-1 xl:row-start-6"
        >
          <Image
            src="/icon/45th-logo-top.svg"
            alt=""
            aria-hidden="true"
            width={729}
            height={729}
            className="pointer-events-none absolute -top-[463px] left-[187px] z-0 hidden max-w-none opacity-10 brightness-0 invert xl:block"
          />
          <h2 id="guest-performers-heading" className="sr-only">
            出演者情報
          </h2>
          <div className="relative z-10" aria-hidden="true">
            <SectionTitle title="出演者情報" />
          </div>
          <div className="relative z-10 flex flex-col gap-4l lg:gap-5l">
            <GuestProfileSection
              id="yoneda-2000"
              variant="guest"
              performerName="ヨネダ２０００"
              profiles={GUEST_PROFILES}
              image={{
                src: "/image/event/guest.jpg",
                alt: "ヨネダ2000の誠さんと愛さん",
              }}
            />
            <GuestProfileSection
              id="mc-kiyono-miki"
              variant="mc"
              profiles={MC_PROFILES}
              image={{
                src: "/image/event/mc.jpg",
                alt: "MCの清野幹さん",
              }}
            />
          </div>
        </section>
      </div>

      <SponsorAdsBoundary
        className="relative z-10 mx-auto w-full max-w-320 pb-4l"
        surface="transparent"
      />
    </div>
  );
}
