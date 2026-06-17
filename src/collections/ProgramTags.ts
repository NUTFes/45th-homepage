import type { CollectionConfig } from "payload";

import { preventDeleteUsedProgramTags } from "./hooks/preventDeleteUsedProgramTags";
import {
  revalidateProgramTagsAfterChange,
  revalidateProgramTagsAfterDelete,
} from "./hooks/revalidatePrograms";

export const ProgramTags: CollectionConfig = {
  slug: "program-tags",
  labels: {
    singular: {
      ja: "企画タグ",
      en: "Program Tag",
    },
    plural: {
      ja: "企画タグ",
      en: "Program Tags",
    },
  },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "updatedAt"],
    group: {
      ja: "コンテンツ",
      en: "Content",
    },
    description: {
      ja: "企画一覧の絞り込みに使用するタグを管理します。タグを増やしすぎると来場者が探しにくくなるため、必要なものだけ登録してください。",
      en: "Manage tags used for filtering programs.",
    },
  },
  hooks: {
    beforeDelete: [preventDeleteUsedProgramTags],
    afterChange: [revalidateProgramTagsAfterChange],
    afterDelete: [revalidateProgramTagsAfterDelete],
  },
  fields: [
    {
      name: "name",
      label: {
        ja: "タグ名",
        en: "Name",
      },
      type: "text",
      required: true,
      unique: true,
      maxLength: 60,
    },
  ],
  timestamps: true,
};
