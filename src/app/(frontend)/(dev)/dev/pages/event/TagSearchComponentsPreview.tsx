"use client";

import { useState } from "react";
import ActiveTag from "@/modules/event/ui/ActiveTag";
import TagSearchButton from "@/modules/event/ui/TagSearchButton";

const INITIAL_TAGS = ["飲食", "体験・遊ぶ", "ステージ", "子ども向け", "雨天開催"];

export default function TagSearchComponentsPreview() {
  const [tags, setTags] = useState(INITIAL_TAGS);

  return (
    <div className="flex flex-col gap-ss bg-base pb-ss md:gap-xs md:pb-xs">
      <div className="flex justify-end bg-base-dark px-l py-m shadow-[0_2px_6px_0_var(--color-base)] md:px-pm">
        <TagSearchButton onPress={() => undefined} />
      </div>
      <div aria-label="選択中のタグ" className="flex flex-wrap gap-ss px-m md:gap-s md:px-pm">
        {tags.map((tag) => (
          <ActiveTag
            key={tag}
            label={tag}
            onPress={() => setTags((current) => current.filter((item) => item !== tag))}
          />
        ))}
        {tags.length === 0 && <p className="text-textb text-font-main">選択中のタグはありません</p>}
      </div>
    </div>
  );
}
