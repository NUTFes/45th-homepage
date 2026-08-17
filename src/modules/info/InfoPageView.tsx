import type { ReactNode } from "react";

import SectionTitle from "@/components/ui/SectionTitle";
import InfoImage from "./ui/InfoImage";

type InfoItem = { title: string; body: string };

const HELP_DESCRIPTIONS: readonly [string, string] = [
  "案内所は、講義棟前と体育館前にございます。ご来場の際は、こちらでパンフレットやガイドマップなどの配布物をお受け取りください。",
  "体調不良や落とし物など、お困りの際は案内所へお立ち寄りいただくか、技大祭Tシャツを着用したスタッフまでお声がけください。",
];

const MAP_IMAGE = {
  aspect: "aspect-[312/234]",
  alt: "会場マップ",
  caption: "会場マップ",
  placeholderTitle: "MAP",
  placeholderNote: "NO IMAGE",
} as const;

const TSHIRT_IMAGE = {
  aspect: "aspect-[312/234]",
  alt: "技大祭Tシャツ",
  caption: "技大祭Tシャツ",
  placeholderNote: "技大祭Tシャツ画像",
} as const;

const DISTRIBUTION_ITEMS: readonly InfoItem[] = [
  {
    title: "アルコールリストバンド",
    body: "飲酒を希望される方に着用していただくリストバンドです。年齢確認および運転者でないことを確認した後にお渡しします。",
  },
  {
    title: "パンフレット",
    body: "企画紹介やタイムスケジュールなど、技大祭をより楽しむための情報が詰まったパンフレットです。謎解きの回答欄等も掲載しているので、ご来場の際はぜひお受け取りください！",
  },
  {
    title: "ガイドマップ",
    body: "会場全体の配置をひと目で確認できるガイドマップです。企画や施設の場所を確認しながら、スムーズに技大祭をお楽しみいただけます。",
  },
  {
    title: "スタンプラリー台紙",
    body: "技大祭スタンプラリーの台紙です。全てのスタンプを集めるとビンゴ大会に参加できます。豪華景品GETのチャンス！",
  },
  {
    title: "技大祭うちわ",
    body: "技大祭のテーマにあったデザインが施されたうちわです。熱中症対策にご活用ください。技大祭の記念品としても◎",
  },
  {
    title: "水（数量限定）",
    body: "ペットボトルの水を配布しております。熱中症対策にご活用ください。",
  },
];

const DISTRIBUTION_IMAGE_INDEX = 3;

const LOST_ITEMS: readonly InfoItem[] = [
  {
    title: "落とし物をした",
    body: "案内所、または電気棟1Fの本部にお越しください。",
  },
  {
    title: "落とし物を拾った",
    body: "案内所、または電気棟1Fの本部にお届けいただくか、技大祭Tシャツを着たスタッフにお渡しください。",
  },
];

function ImportantBanner() {
  return (
    <div className="w-full border-y-[1.4px] border-main bg-base-dark px-3l py-l shadow-[0px_2px_6px_0px_var(--color-base-shadow)] md:px-pl md:py-3l">
      <p className="text-textb text-white md:text-Ptext-large">
        お困りの際は、技大祭のTシャツを
        <br className="md:hidden" />
        着たスタッフにお声がけください
      </p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-ll md:gap-3l">
      <div className="md:px-pl">
        <SectionTitle title={title} />
      </div>
      {children}
    </section>
  );
}

function InfoListItem({ item }: { item: InfoItem }) {
  return (
    <div className="flex w-full flex-col gap-ss">
      <div className="flex w-fit max-w-full items-end gap-ss border-b border-main pb-1 md:gap-xs">
        <span aria-hidden="true" className="size-3.5 shrink-0 bg-main md:size-5" />
        <div className="min-w-0 text-textb font-bold wrap-break-word text-font-main md:text-Ptitle-small">
          {item.title}
        </div>
      </div>
      <p className="px-xs text-text text-font-main md:px-s md:text-Ptext">{item.body}</p>
    </div>
  );
}

function InfoImagePair({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3l px-3l lg:flex-row lg:items-stretch lg:px-pll">
      {children}
    </div>
  );
}

export default function InfoPageView({ sponsorAds }: { sponsorAds?: ReactNode }) {
  return (
    <div className="flex w-full flex-col bg-base">
      <ImportantBanner />

      <div className="flex flex-col gap-4l py-4l md:gap-pm md:py-5l">
        <Section title="案内所">
          <div className="flex flex-col gap-l lg:hidden">
            <p className="px-ll text-text text-white">{HELP_DESCRIPTIONS[0]}</p>
            <div className="px-3l">
              <InfoImage {...MAP_IMAGE} />
            </div>
            <p className="px-ll text-text text-white">{HELP_DESCRIPTIONS[1]}</p>
            <div className="px-3l">
              <InfoImage {...TSHIRT_IMAGE} />
            </div>
          </div>

          <div className="hidden flex-col gap-ll lg:flex">
            <div className="flex flex-col gap-l px-pll">
              <p className="text-Ptext text-white">{HELP_DESCRIPTIONS[0]}</p>
              <p className="text-Ptext text-white">{HELP_DESCRIPTIONS[1]}</p>
            </div>
            <InfoImagePair>
              <InfoImage {...MAP_IMAGE} />
              <InfoImage {...TSHIRT_IMAGE} />
            </InfoImagePair>
          </div>
        </Section>

        <Section title="配布物">
          <p className="px-ll text-text text-white md:px-pll md:text-Ptext">
            以下を案内所で配布しています。
          </p>
          <div className="flex flex-col gap-3l px-ll md:px-pll">
            {DISTRIBUTION_ITEMS.slice(0, DISTRIBUTION_IMAGE_INDEX).map((item) => (
              <InfoListItem key={item.title} item={item} />
            ))}
          </div>
          <InfoImagePair>
            <InfoImage
              aspect="aspect-[326/201]"
              alt="パンフレット"
              caption="パンフレット"
              placeholderNote="パンフデジタル画像"
            />
            <InfoImage
              aspect="aspect-[326/201]"
              alt="ガイドマップ"
              caption="ガイドマップ"
              placeholderNote="ガイドマップデジタル画像"
            />
          </InfoImagePair>
          <div className="flex flex-col gap-3l px-ll md:px-pll">
            {DISTRIBUTION_ITEMS.slice(DISTRIBUTION_IMAGE_INDEX).map((item) => (
              <InfoListItem key={item.title} item={item} />
            ))}
          </div>
        </Section>

        <Section title="落とし物">
          <div className="flex flex-col gap-3l px-ll md:px-pll">
            {LOST_ITEMS.map((item) => (
              <InfoListItem key={item.title} item={item} />
            ))}
          </div>
        </Section>

        {sponsorAds ? <div className="lg:hidden">{sponsorAds}</div> : null}
      </div>
    </div>
  );
}
