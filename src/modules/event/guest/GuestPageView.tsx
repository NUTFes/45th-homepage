import Image from "next/image";
import {
  AlertTriangle,
  CameraOff,
  Clock3,
  DoorOpen,
  Ticket,
  UsersRound,
  CandyOff,
} from "lucide-react";

import EventInfoCard, { type EventInfoCardProps } from "@/components/ui/EventInfoCard";
import EventIntroFrame from "@/components/ui/EventIntroFrame";
import SectionTitle from "@/components/ui/SectionTitle";
import TicketDistributionInfo from "@/components/ui/TicketDistributionInfo";
import SponsorAdsBoundary from "@/modules/sponsors/ui/SponsorAdsBoundary";
import GuestInformationSection, {
  type GuestInformationBlock,
} from "@/modules/event/guest/ui/GuestInformationSection";
import GuestProfileSection from "@/modules/event/guest/ui/GuestProfileSection";
import type { GuestProfile } from "@/modules/event/guest/ui/GuestProfileCard";
import type { GuestPageDTO } from "@/modules/events/types";
import MapFrame from "@/components/ui/MapFrame";

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

const TICKET_DISTRIBUTION_BLOCKS = [
  {
    id: "ticket-distribution-schedule",
    title: "スケジュール",
    icon: Clock3,
    body: (
      <div className="flex flex-col gap-y-s md:gap-y-m md:text-Ptext">
        <p>ゲストステージの整理券を以下のスケジュールで配布します。</p>
        <section className="flex flex-col gap-y-s">
          <div className="w-fit border-b">場所</div>
          <p className="cd:font-bold">講義棟１階　B講義室</p>
          <MapFrame showDecoration={false}/>
        </section>
        <section className="flex flex-col gap-y-ss">
          <div className="w-fit border-b">日時</div>
          <div>
            <div className="flex flex-col gap-y-1 text-text md:text-Ptext">
              <div className="text-textb md:text-Ptext md:font-bold">9月19日（土）</div>
              <div>
                　1部　
                <span className="text-textb md:text-Ptext md:font-bold">10：00 ～ 11：30</span>
                　　200枚
              </div>
              <div>
                　2部　
                <span className="text-textb md:text-Ptext md:font-bold">13：00 ～ 14：30</span>
                　　200枚
              </div>
            </div>
            <div>
              <div className="pt-xs text-textb md:text-Ptext md:font-bold">9月20日（日）</div>
              <div>
                　3部　
                <span className="pt-1 text-textb md:text-Ptext md:font-bold">10：00 ～ 11：30</span>
                　　100枚
              </div>
            </div>
          </div>
        </section>
      </div>
    ),
  },
  {
    id: "ticket-distribution-notes",
    title: "注意事項",
    icon: AlertTriangle,
    body: (
      <div className="flex flex-col gap-y-s text-text md:gap-y-l md:text-Ptext">
        <p>
          <span className="text-textb md:text-Ptext md:font-bold">
            整理券１枚につき１人が入場できます。整理券に記載されている数字は、席の指定ではございません。
          </span>
          入場の順番を管理するものです。
        </p>
        <p>
          <span className="text-accent">整理券の再発行はいたしません。</span>
          破損や紛失等には十分ご注意ください。
        </p>
        <p>
          集合時間、入場時間が異なります。遅くとも
          <span className="text-accent">12:50</span>
          までに整列場所にお越しください。12:50を過ぎると整理券を持っていても、一般入場枠でのご案内となります。
        </p>
      </div>
    ),
  },
] satisfies readonly GuestInformationBlock[];

const ADMISSION_BLOCKS = [
  {
    id: "sample-admission",
    title: "整理券での入場方法",
    icon: Ticket,
    body: (
      <div className="flex flex-col gap-y-2.5 text-text md:text-Ptext">
        <p>整理券を受け取りましたら、以下の整列場所へ指定時間内にお集まりください。</p>
        <div>
          <p>
            場所：<span className="text-textb md:text-Ptext md:font-bold">体育館前</span>
          </p>
          <p>
            日付：<span className="text-textb md:text-Ptext md:font-bold">9月20日（日）</span>
          </p>
          <p>
            時間：
            <span className="text-textb md:text-Ptext md:font-bold">
              整理券記載の集合時間をご確認ください
            </span>
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "general-admission",
    title: "一般入場枠について",
    icon: UsersRound,
    body: (
      <div className="flex flex-col gap-y-2.5 text-text md:text-Ptext">
        <p>
          当日は整理券なしでも入場できる
          <span className="text-textb md:text-Ptext md:font-bold">一般入場枠</span>
          がございます。整理券をお持ちのお客様の後での、空きスペースへのご案内となります。
        </p>
        <p>
          <span className="text-textb md:text-Ptext md:font-bold">
            先着順で枠が埋まり次第入場終了となり、入場の確約はできませんのでご注意ください。
          </span>
        </p>
      </div>
    ),
  },
  {
    id: "re-entry",
    title: "再入場について",
    icon: DoorOpen,
    body: (
      <p className="text-text md:text-Ptext">
        飲み物の購入などで会場から一時退場する場合、
        <span className="text-textb md:text-Ptext md:font-bold">
          会場出口にて再入場券を受け取ってください。
          <span className="text-accent">再入場券がない場合の再入場はできません</span>
        </span>
        のでご注意ください。
      </p>
    ),
  },
] satisfies readonly GuestInformationBlock[];

const VENUE_CAUTIONS_BLOCKS = [
  {
    id: "recording-and-photography",
    title: (
      <>
        <span className="text-accent">イベント中の</span>
        <br className="md:hidden" />
        <span className="text-accent">録音・撮影は原則禁止</span>
      </>
    ),
    icon: CameraOff,
    accent: true,
    body: (
      <p className="text-text md:text-Ptext">
        ※MCやゲストの指示があった場合に限り、録音・撮影が可能です。
      </p>
    ),
  },
  {
    id: "candy-off",
    title: (
      <>
        <span className="text-accent">体育館では食事禁止</span>
        <br className="md:hidden" />
        <span className="text-accent">・水分補給のみ可能</span>
      </>
    ),
    icon: CandyOff,
    accent: true,
    body: (
      <div className="flex flex-col gap-y-2.5 text-text md:gap-y-7 md:text-Ptext">
        <p>入場時に手荷物検査へのご協力をお願いします。</p>
        <p>
          <span className="text-textb md:text-Ptext md:font-bold">
            体育館内の床にフロアシートはありません。
          </span>
          ご了承ください。各自で座布団等（1人分）のご用意をお願いいたします。
        </p>
        <p>
          <span className="text-textb md:text-Ptext md:font-bold">
            会場内は非常に暑くなることが予想されます。
          </span>
          手荷物検査後、机に設けられている「技大祭うちわ」をぜひご利用ください。
        </p>
      </div>
    ),
  },
] satisfies readonly GuestInformationBlock[];

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

        <div
          aria-hidden="true"
          className="relative hidden bg-base-dark xl:col-start-2 xl:row-start-1 xl:row-end-7 xl:block xl:after:pointer-events-none xl:after:absolute xl:after:inset-y-0 xl:after:left-full xl:after:w-screen xl:after:bg-base-dark xl:after:content-['']"
        />
        <aside className="relative bg-base-dark xl:sticky xl:top-18 xl:z-20 xl:col-start-2 xl:row-start-1 xl:row-end-7 xl:self-start">
          <EventInfoCard {...GUEST_EVENT_INFO} />
        </aside>

        <GuestInformationSection
          id="ticket-distribution"
          title="整理券配布について"
          status="publishing"
          className="xl:col-start-1 xl:row-start-3 xl:mt-m"
          blocks={TICKET_DISTRIBUTION_BLOCKS}
        />

        <GuestInformationSection
          id="admission"
          title="入場について"
          status="publishing"
          className="xl:col-start-1 xl:row-start-4"
          blocks={ADMISSION_BLOCKS}
        />

        <GuestInformationSection
          id="venue-cautions"
          title="会場での注意事項"
          status="publishing"
          className="xl:col-start-1 xl:row-start-5"
          blocks={VENUE_CAUTIONS_BLOCKS}
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

      <SponsorAdsBoundary className="relative z-10 mx-auto w-full pb-4l" />
    </div>
  );
}
