import type { Media, SponsorsPage } from "@/payload-types";

import type { SponsorDTO, SponsorMediaDTO, SponsorWithImageDTO } from "./types";

type SponsorRow = NonNullable<SponsorsPage["sponsors"]>[number];

const isMediaDoc = (value: SponsorRow["image"]): value is Media =>
  typeof value === "object" && value !== null && "id" in value;

export const toSponsorMediaDTO = (value: SponsorRow["image"]): SponsorMediaDTO | undefined => {
  if (!isMediaDoc(value) || !value.url) {
    return undefined;
  }

  return {
    alt: value.alt,
    id: value.id,
    ...(value.height ? { height: value.height } : {}),
    url: value.url,
    ...(value.width ? { width: value.width } : {}),
  };
};

export const toSponsorDTO = (row: SponsorRow, index: number): SponsorDTO | null => {
  const companyName = row.companyName.trim();

  if (!companyName) {
    return null;
  }

  const image = toSponsorMediaDTO(row.image);

  return {
    companyName,
    id: row.id ?? `${companyName}-${index}`,
    ...(image ? { image } : {}),
  };
};

export const hasSponsorImage = (sponsor: SponsorDTO): sponsor is SponsorWithImageDTO =>
  sponsor.image !== undefined;
