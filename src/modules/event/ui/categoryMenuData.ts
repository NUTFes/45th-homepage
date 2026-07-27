const ICON_BASE_PATH = "/image/event/category";

const categoryIcons = {
  activity: `${ICON_BASE_PATH}/activity.svg`,
  children: `${ICON_BASE_PATH}/children.svg`,
  food: `${ICON_BASE_PATH}/food.svg`,
  goods: `${ICON_BASE_PATH}/goods.svg`,
  learning: `${ICON_BASE_PATH}/learning.svg`,
  prize: `${ICON_BASE_PATH}/prize.svg`,
  reservation: `${ICON_BASE_PATH}/reservation.svg`,
  watch: `${ICON_BASE_PATH}/watch.svg`,
} as const;

type CategoryIcon = keyof typeof categoryIcons;

type CategoryMenuItem = {
  label: string;
};

export type CategoryMenuVariant = "event" | "program" | "exhibition" | "food" | "goods";

const categoryIconByLabel: Partial<Record<string, CategoryIcon>> = {
  食販: "food",
  物販: "goods",
  "体験・遊ぶ": "activity",
  "見る・聞く": "watch",
  "展示・学ぶ": "learning",
  子ども向け: "children",
  要予約: "reservation",
  景品あり: "prize",
};

export function getCategoryIconSrc(label: string) {
  const icon = categoryIconByLabel[label];
  return icon === undefined ? undefined : categoryIcons[icon];
}

export const categoryMenuItems = {
  event: [
    { label: "食販" },
    { label: "物販" },
    { label: "体験・遊ぶ" },
    { label: "見る・聞く" },
    { label: "展示・学ぶ" },
    { label: "子ども向け" },
    { label: "要予約" },
    { label: "景品あり" },
    { label: "１日目" },
    { label: "２日目" },
  ],
  program: [
    { label: "体験・遊ぶ" },
    { label: "見る・聞く" },
    { label: "子ども向け" },
    { label: "景品あり" },
    { label: "要予約" },
    { label: "講義棟" },
    { label: "ステージ" },
    { label: "体育館" },
    { label: "１日目" },
    { label: "２日目" },
  ],
  exhibition: [
    { label: "体験・遊ぶ" },
    { label: "見る・聞く" },
    { label: "展示・学ぶ" },
    { label: "子ども向け" },
    { label: "講義棟" },
    { label: "研究室" },
    { label: "１日目" },
    { label: "２日目" },
  ],
  food: [
    { label: "フード" },
    { label: "スイーツ" },
    { label: "ドリンク" },
    { label: "国際グルメ" },
    { label: "お酒あり" },
    { label: "学生出店" },
    { label: "企業出店" },
    { label: "キッチンカー" },
  ],
  goods: [{ label: "体験あり" }, { label: "子ども向け" }, { label: "技大グッズ" }],
} as const satisfies Record<CategoryMenuVariant, readonly CategoryMenuItem[]>;

export const categoryMenuLabels = {
  event: "ゲスト・企画情報",
  program: "企画",
  exhibition: "展示・体験",
  food: "食販",
  goods: "物販",
} as const satisfies Record<CategoryMenuVariant, string>;
