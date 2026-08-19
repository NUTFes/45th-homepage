import type { ReactNode } from "react";

import SectionTitle from "@/components/ui/SectionTitle";
import InfoImage, { type InfoImageProps } from "./ui/InfoImage";

type InfoItem = { title: string; body: string; image?: InfoImageProps };

const MAP_IMAGE: InfoImageProps = {
  aspect: "aspect-[312/234]",
  alt: "会場マップ",
  caption: "会場マップ",
  placeholderTitle: "MAP",
  placeholderNote: "NO IMAGE",
};

const TSHIRT_IMAGE: InfoImageProps = {
  aspect: "aspect-[312/234]",
  alt: "技大祭Tシャツ",
  caption: "技大祭Tシャツ",
  placeholderNote: "技大祭Tシャツ画像",
};

const HELP_ITEMS: readonly { description: string; image: InfoImageProps }[] = [
  {
    description:
      "案内所は、講義棟前と体育館前にございます。ご来場の際は、こちらでパンフレットやガイドマップなどの配布物をお受け取りください。",
    image: MAP_IMAGE,
  },
  {
    description:
      "体調不良や落とし物など、お困りの際は案内所へお立ち寄りいただくか、技大祭Tシャツを着用したスタッフまでお声がけください。",
    image: TSHIRT_IMAGE,
  },
];

const PAMPHLET_IMAGE: InfoImageProps = {
  aspect: "aspect-[326/201]",
  alt: "パンフレット",
  caption: "パンフレット",
  placeholderNote: "パンフデジタル画像",
};

const GUIDEMAP_IMAGE: InfoImageProps = {
  aspect: "aspect-[326/201]",
  alt: "ガイドマップ",
  caption: "ガイドマップ",
  placeholderNote: "ガイドマップデジタル画像",
};

const DISTRIBUTION_ITEMS: readonly InfoItem[] = [
  {
    title: "アルコールリストバンド",
    body: "飲酒を希望される方に着用していただくリストバンドです。年齢確認および運転者でないことを確認した後にお渡しします。",
  },
  {
    title: "パンフレット",
    body: "企画紹介やタイムスケジュールなど、技大祭をより楽しむための情報が詰まったパンフレットです。謎解きの回答欄等も掲載しているので、ご来場の際はぜひお受け取りください！",
    image: PAMPHLET_IMAGE,
  },
  {
    title: "ガイドマップ",
    body: "会場全体の配置をひと目で確認できるガイドマップです。企画や施設の場所を確認しながら、スムーズに技大祭をお楽しみいただけます。",
    image: GUIDEMAP_IMAGE,
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

type DistributionImageItem = InfoItem & { image: InfoImageProps };

const DISTRIBUTION_IMAGES = DISTRIBUTION_ITEMS.filter(
  (item): item is DistributionImageItem => item.image !== undefined,
);

const DISTRIBUTION_SPLIT = DISTRIBUTION_ITEMS.reduce(
  (split, item, index) => (item.image ? index + 1 : split),
  0,
);

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

function SectionHeading({ children }: { children: string }) {
  return (
    <div className="md:px-pl">
      <SectionTitle title={children} />
    </div>
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

      <div className="flex flex-col gap-4l py-4l md:gap-pm md:pt-5l md:pb-pm">
        <section aria-label="案内所" className="flex flex-col gap-s lg:gap-4l">
          <SectionHeading>案内所</SectionHeading>

          <div className="flex flex-col gap-ll lg:hidden">
            {HELP_ITEMS.map((item) => (
              <div key={item.image.alt} className="flex flex-col gap-s">
                <p className="px-ll text-text text-white md:text-Ptext">{item.description}</p>
                <div className="px-3l">
                  <InfoImage {...item.image} />
                </div>
              </div>
            ))}
          </div>

          <div className="hidden flex-col gap-ll lg:flex">
            <div className="flex flex-col gap-l px-pll">
              {HELP_ITEMS.map((item) => (
                <p key={item.image.alt} className="text-Ptext text-white">
                  {item.description}
                </p>
              ))}
            </div>
            <InfoImagePair>
              {HELP_ITEMS.map((item) => (
                <InfoImage key={item.image.alt} {...item.image} />
              ))}
            </InfoImagePair>
          </div>
        </section>

        <section aria-label="配布物" className="flex flex-col gap-s lg:gap-ll">
          <SectionHeading>配布物</SectionHeading>

          <div className="flex flex-col gap-3l lg:gap-ll">
            <p className="px-ll text-text text-white md:px-pll md:text-Ptext">
              以下を案内所で配布しています。
            </p>

            <div className="flex flex-col gap-3l lg:hidden">
              {DISTRIBUTION_ITEMS.map((item) => (
                <div key={item.title} className="flex flex-col gap-s">
                  <div className="px-ll">
                    <InfoListItem item={item} />
                  </div>
                  {item.image ? (
                    <div className="px-3l">
                      <InfoImage {...item.image} />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="hidden flex-col gap-3l lg:flex">
              <div className="flex flex-col gap-3l px-pll">
                {DISTRIBUTION_ITEMS.slice(0, DISTRIBUTION_SPLIT).map((item) => (
                  <InfoListItem key={item.title} item={item} />
                ))}
              </div>
              <InfoImagePair>
                {DISTRIBUTION_IMAGES.map((item) => (
                  <InfoImage key={item.title} {...item.image} />
                ))}
              </InfoImagePair>
              <div className="flex flex-col gap-3l px-pll">
                {DISTRIBUTION_ITEMS.slice(DISTRIBUTION_SPLIT).map((item) => (
                  <InfoListItem key={item.title} item={item} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section aria-label="落とし物" className="flex flex-col gap-l lg:gap-ll">
          <SectionHeading>落とし物</SectionHeading>

          <div className="flex flex-col gap-3l px-ll md:px-pll">
            {LOST_ITEMS.map((item) => (
              <InfoListItem key={item.title} item={item} />
            ))}
          </div>
        </section>

        {sponsorAds ? <div className="lg:hidden">{sponsorAds}</div> : null}
      </div>
    </div>
  );
}
