import {
  PROGRAM_TAG_LABELS,
  type FestivalDay,
  type ProgramArea,
  type ProgramCategory,
  type ProgramTagValue,
} from "@/lib/events/constants";

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

export type CategoryFilterMatch =
  | { type: "category"; value: ProgramCategory }
  | { type: "area"; value: ProgramArea }
  | { type: "day"; value: FestivalDay }
  | { type: "programTag"; value: ProgramTagValue };

export type CategoryFilterDefinition = {
  value: string;
  label: string;
  match: CategoryFilterMatch;
};

export type CategoryMenuVariant =
  | "event"
  | "program"
  | "exhibition"
  | "food"
  | "goods"
  | "corporate";

const programTagFilter = (value: ProgramTagValue): CategoryFilterDefinition => ({
  value: `tag:${value}`,
  label: PROGRAM_TAG_LABELS[value],
  match: { type: "programTag", value },
});

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
    { value: "category:food", label: "食販", match: { type: "category", value: "food" } },
    { value: "category:goods", label: "物販", match: { type: "category", value: "goods" } },
    programTagFilter("activity"),
    programTagFilter("watch"),
    programTagFilter("learning"),
    programTagFilter("children"),
    programTagFilter("reservation"),
    programTagFilter("prize"),
    { value: "day:day1", label: "１日目", match: { type: "day", value: "day1" } },
    { value: "day:day2", label: "２日目", match: { type: "day", value: "day2" } },
  ],
  program: [
    programTagFilter("activity"),
    programTagFilter("watch"),
    programTagFilter("children"),
    programTagFilter("prize"),
    programTagFilter("reservation"),
    { value: "area:lecture", label: "講義棟", match: { type: "area", value: "lecture" } },
    programTagFilter("stage"),
    { value: "area:gym", label: "体育館", match: { type: "area", value: "gym" } },
    { value: "day:day1", label: "１日目", match: { type: "day", value: "day1" } },
    { value: "day:day2", label: "２日目", match: { type: "day", value: "day2" } },
  ],
  exhibition: [
    programTagFilter("activity"),
    programTagFilter("watch"),
    programTagFilter("learning"),
    programTagFilter("children"),
    { value: "area:lecture", label: "講義棟", match: { type: "area", value: "lecture" } },
    programTagFilter("laboratory"),
    { value: "day:day1", label: "１日目", match: { type: "day", value: "day1" } },
    { value: "day:day2", label: "２日目", match: { type: "day", value: "day2" } },
  ],
  food: [
    programTagFilter("food"),
    programTagFilter("sweets"),
    programTagFilter("drink"),
    programTagFilter("international-food"),
    programTagFilter("alcohol"),
    programTagFilter("student"),
    programTagFilter("corporate"),
    {
      value: "area:kitchen-car",
      label: "キッチンカー",
      match: { type: "area", value: "kitchen_car" },
    },
  ],
  goods: [
    programTagFilter("with-activity"),
    programTagFilter("children"),
    programTagFilter("nagaoka-ut-goods"),
  ],
  corporate: [],
} as const satisfies Record<CategoryMenuVariant, readonly CategoryFilterDefinition[]>;

export const categoryMenuLabels = {
  event: "ゲスト・企画情報",
  program: "企画",
  exhibition: "展示・体験",
  food: "食販",
  goods: "物販",
  corporate: "企業ブース",
} as const satisfies Record<CategoryMenuVariant, string>;
