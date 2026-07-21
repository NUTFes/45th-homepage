"use client";

import { useState } from "react";
import { Button } from "react-aria-components";

import CategoryMenu, { type CategoryMenuVariant } from "@/modules/event/ui/CategoryMenu";

const variants: CategoryMenuVariant[] = ["event", "program", "exhibition", "food", "goods"];

const variantLabels = {
  event: "ゲスト・企画情報",
  program: "企画",
  exhibition: "展示・体験",
  food: "食販",
  goods: "物販",
} as const satisfies Record<CategoryMenuVariant, string>;

const initialSelectedTags = {
  event: ["物販"],
  program: ["体育館"],
  exhibition: [],
  food: ["キッチンカー"],
  goods: [],
} satisfies Record<CategoryMenuVariant, string[]>;

export default function CategoryMenuPreview() {
  const [visibleVariants, setVisibleVariants] = useState<CategoryMenuVariant[]>(variants);
  const [selectedTags, setSelectedTags] =
    useState<Record<CategoryMenuVariant, string[]>>(initialSelectedTags);

  return (
    <div className="flex flex-col gap-4l bg-secondary/40 py-l">
      {variants.map((variant) => (
        <section key={variant} aria-label={`${variantLabels[variant]}用タグ検索`}>
          <h3 className="mb-xs px-m text-textb text-base-dark md:px-4l">
            {variantLabels[variant]}
          </h3>
          {visibleVariants.includes(variant) ? (
            <CategoryMenu
              variant={variant}
              value={selectedTags[variant]}
              onChange={(value) => setSelectedTags((current) => ({ ...current, [variant]: value }))}
              onClose={() =>
                setVisibleVariants((current) => current.filter((item) => item !== variant))
              }
            />
          ) : (
            <div className="px-m md:px-4l">
              <Button
                className="cursor-pointer rounded-full bg-base-dark px-m py-xs text-button text-font-main focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main"
                onPress={() => setVisibleVariants((current) => [...current, variant])}
              >
                {variantLabels[variant]}を再表示
              </Button>
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
