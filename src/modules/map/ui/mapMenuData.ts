export type MapMenuEntry = {
  id: string;
  label: string;
  displayLabel?: string;
  disabled?: boolean;
  type?: "short" | "long";
};

export type MapMenuSection = MapMenuEntry & {
  items?: MapMenuEntry[];
};

export const defaultMapMenuSections: MapMenuSection[] = [
  {
    id: "overall",
    label: "全体",
  },
  {
    id: "lecture-building",
    label: "講義棟内",
    items: [
      { id: "lecture-building-1f", label: "1F", displayLabel: "講義棟　1F", type: "short" },
      { id: "lecture-building-2f", label: "2F", displayLabel: "講義棟　2F", type: "short" },
      { id: "lecture-building-3f", label: "3F", displayLabel: "講義棟　3F", type: "short" },
    ],
  },
  {
    id: "outdoor-area",
    label: "屋外エリア",
    items: [
      { id: "outdoor-overall", label: "屋外エリア全体" },
      { id: "office-area", label: "事務棟エリア" },
      { id: "library-area", label: "図書館エリア" },
      { id: "electrical-area", label: "電気棟エリア" },
      { id: "mechanical-civil-area", label: "機械建設棟エリア" },
    ],
  },
  {
    id: "stamp-rally",
    label: "スタンプラリー",
  },
  {
    id: "mystery-solving",
    label: "謎解き",
  },
  {
    id: "exhibits",
    label: "制作物",
    items: [
      { id: "exhibits-overall", label: "制作物全体" },
      { id: "exhibits-lecture-building-1f", label: "制作物(講義棟　1F)" },
    ],
  },
];

export function getMapDisplayLabel(
  id: string | undefined,
  sections: MapMenuSection[] = defaultMapMenuSections,
): string {
  if (id === undefined) {
    return "";
  }

  for (const section of sections) {
    if (section.id === id) {
      return section.displayLabel ?? section.label;
    }

    const item = section.items?.find((entry) => entry.id === id);

    if (item !== undefined) {
      return item.displayLabel ?? item.label;
    }
  }

  return "";
}
