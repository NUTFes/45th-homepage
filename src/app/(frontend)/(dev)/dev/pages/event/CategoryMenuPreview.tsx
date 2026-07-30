"use client";

import { useState } from "react";
import { Button } from "react-aria-components";

import CategoryMenu from "@/modules/event/ui/CategoryMenu";
import {
  categoryMenuItems,
  categoryMenuLabels,
  type CategoryMenuVariant,
} from "@/modules/event/ui/categoryMenuData";

const variants: CategoryMenuVariant[] = [
  "event",
  "program",
  "exhibition",
  "food",
  "goods",
  "corporate",
];

const initialSelectedTags = {
  event: ["category:goods"],
  program: ["area:gym"],
  exhibition: [],
  food: ["area:kitchen-car"],
  goods: [],
  corporate: [],
} satisfies Record<CategoryMenuVariant, string[]>;

export default function CategoryMenuPreview() {
  const [visibleVariants, setVisibleVariants] = useState<CategoryMenuVariant[]>(variants);
  const [selectedTags, setSelectedTags] =
    useState<Record<CategoryMenuVariant, string[]>>(initialSelectedTags);

  return (
    <div className="flex flex-col gap-4l bg-secondary/40 py-l">
      {variants.map((variant) => (
        <section key={variant} aria-label={`${categoryMenuLabels[variant]}用タグ検索`}>
          <h3 className="mb-xs px-m text-textb text-base-dark md:px-4l">
            {categoryMenuLabels[variant]}
          </h3>
          {categoryMenuItems[variant].length === 0 ? (
            <p className="px-m text-textb text-base-dark md:px-4l">固定検索条件はありません</p>
          ) : visibleVariants.includes(variant) ? (
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
                {categoryMenuLabels[variant]}を再表示
              </Button>
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
