export type MapMenuEntry = {
  id: string;
  label: string;
  displayLabel?: string;
  imageSrc?: string;
  imageAlt?: string;
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
    imageSrc: "/image/map/all_map.png",
    imageAlt: "長岡技術科学大学の会場全体マップ",
  },
  {
    id: "lecture-building",
    label: "講義棟内",
    items: [
      {
        id: "lecture-building-1f",
        label: "1F",
        displayLabel: "講義棟　1F",
        imageSrc: "/image/map/1f_map.png",
        imageAlt: "講義棟1階マップ",
        type: "short",
      },
      {
        id: "lecture-building-2f",
        label: "2F",
        displayLabel: "講義棟　2F",
        imageSrc: "/image/map/2f_map.png",
        imageAlt: "講義棟2階マップ",
        type: "short",
      },
      {
        id: "lecture-building-3f",
        label: "3F",
        displayLabel: "講義棟　3F",
        imageSrc: "/image/map/3f_map.png",
        imageAlt: "講義棟3階マップ",
        type: "short",
      },
    ],
  },
  {
    id: "outdoor-area",
    label: "屋外エリア",
    items: [
      {
        id: "outdoor-overall",
        label: "屋外エリア全体",
        imageSrc: "/image/map/okugai_all_map.png",
        imageAlt: "屋外エリア全体マップ",
      },
      {
        id: "office-area",
        label: "事務棟エリア",
        imageSrc: "/image/map/jim_map.png",
        imageAlt: "事務棟エリアマップ",
      },
      {
        id: "library-area",
        label: "図書館エリア",
        imageSrc: "/image/map/toshokan_map.png",
        imageAlt: "図書館エリアマップ",
      },
      {
        id: "electrical-area",
        label: "電気棟エリア",
        imageSrc: "/image/map/denki_map.png",
        imageAlt: "電気棟エリアマップ",
      },
      {
        id: "mechanical-civil-area",
        label: "機械建設棟エリア",
        imageSrc: "/image/map/kikai_map.png",
        imageAlt: "機械建設棟エリアマップ",
      },
    ],
  },
  {
    id: "mystery-solving",
    label: "謎解き",
    imageSrc: "/image/map/nazotoki_map.png",
    imageAlt: "謎解きマップ",
  },
  {
    id: "exhibits",
    label: "制作物",
    items: [
      {
        id: "exhibits-overall",
        label: "制作物全体",
        imageSrc: "/image/map/seisaku_map.png",
        imageAlt: "制作物全体マップ",
      },
    ],
  },
];

export function getMapEntry(
  id: string | undefined,
  sections: MapMenuSection[] = defaultMapMenuSections,
): MapMenuEntry | undefined {
  if (id === undefined) {
    return undefined;
  }

  for (const section of sections) {
    if (section.id === id) {
      return section;
    }

    const item = section.items?.find((entry) => entry.id === id);

    if (item !== undefined) {
      return item;
    }
  }

  return undefined;
}

export function getMapDisplayLabel(
  id: string | undefined,
  sections: MapMenuSection[] = defaultMapMenuSections,
): string {
  const entry = getMapEntry(id, sections);

  return entry?.displayLabel ?? entry?.label ?? "";
}
