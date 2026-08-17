type InfoItem = { title: string; body: string };

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

function InfoListItem({ item }: { item: InfoItem }) {
  return (
    <div className="flex w-full flex-col gap-ss">
      <div className="flex w-fit max-w-full items-end gap-ss border-b border-main pb-1 md:gap-xs">
        <span aria-hidden="true" className="size-3.5 shrink-0 bg-main md:size-5" />
        <div className="min-w-0 wrap-break-word font-bold text-textb text-font-main md:text-Ptitle-small">
          {item.title}
        </div>
      </div>
      <p className="px-xs text-text text-font-main md:px-s md:text-Ptext">{item.body}</p>
    </div>
  );
}

export default function InfoPageView() {
  return (
    <div className="flex w-full flex-col gap-4l bg-base py-4l">
      <section className="flex flex-col gap-3l px-ll md:px-pll">
        {DISTRIBUTION_ITEMS.slice(0, DISTRIBUTION_IMAGE_INDEX).map((item) => (
          <InfoListItem key={item.title} item={item} />
        ))}

        {DISTRIBUTION_ITEMS.slice(DISTRIBUTION_IMAGE_INDEX).map((item) => (
          <InfoListItem key={item.title} item={item} />
        ))}
      </section>

      <section className="flex flex-col gap-3l px-ll md:px-pll">
        {LOST_ITEMS.map((item) => (
          <InfoListItem key={item.title} item={item} />
        ))}
      </section>
    </div>
  );
}
