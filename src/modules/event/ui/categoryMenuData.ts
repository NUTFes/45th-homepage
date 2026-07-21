const ICON_BASE_PATH = "/image/event/category";

export const categoryIcons = {
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
  icon?: CategoryIcon;
};

export type CategoryMenuVariant = "event" | "program" | "exhibition" | "food" | "goods";

export const categoryMenuItems = {
  event: [
    { label: "食販", icon: "food" },
    { label: "物販", icon: "goods" },
    { label: "体験・遊ぶ", icon: "activity" },
    { label: "見る・聞く", icon: "watch" },
    { label: "展示・学ぶ", icon: "learning" },
    { label: "子ども向け", icon: "children" },
    { label: "要予約", icon: "reservation" },
    { label: "景品あり", icon: "prize" },
    { label: "１日目" },
    { label: "２日目" },
  ],
  program: [
    { label: "体験・遊ぶ", icon: "activity" },
    { label: "見る・聞く", icon: "watch" },
    { label: "子ども向け", icon: "children" },
    { label: "景品あり", icon: "prize" },
    { label: "要予約", icon: "learning" },
    { label: "講義棟", icon: "reservation" },
    { label: "ステージ", icon: "food" },
    { label: "体育館", icon: "goods" },
    { label: "１日目" },
    { label: "２日目" },
  ],
  exhibition: [
    { label: "体験・遊ぶ", icon: "activity" },
    { label: "見る・聞く", icon: "watch" },
    { label: "展示・学ぶ", icon: "learning" },
    { label: "子ども向け", icon: "children" },
    { label: "講義棟", icon: "reservation" },
    { label: "研究室", icon: "prize" },
    { label: "１日目" },
    { label: "２日目" },
  ],
  food: [
    { label: "フード", icon: "activity" },
    { label: "スイーツ", icon: "watch" },
    { label: "ドリンク", icon: "children" },
    { label: "国際グルメ", icon: "prize" },
    { label: "お酒あり", icon: "learning" },
    { label: "学生出店", icon: "reservation" },
    { label: "企業出店", icon: "food" },
    { label: "キッチンカー", icon: "goods" },
  ],
  goods: [
    { label: "体験あり", icon: "activity" },
    { label: "子ども向け", icon: "watch" },
    { label: "技大グッズ", icon: "children" },
  ],
} as const satisfies Record<CategoryMenuVariant, readonly CategoryMenuItem[]>;

export const categoryMenuLabels = {
  event: "ゲスト・企画情報",
  program: "企画",
  exhibition: "展示・体験",
  food: "食販",
  goods: "物販",
} as const satisfies Record<CategoryMenuVariant, string>;
