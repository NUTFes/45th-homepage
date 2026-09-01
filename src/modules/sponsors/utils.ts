import type { Media, SponsorsPage } from "@/payload-types";

import type { SponsorMediaDTO, SponsorWithImageDTO } from "./types";

export const SPONSOR_NAME_MAX_LENGTH = 80;

export const parseSponsorNameList = (value?: string | null): string[] =>
  (value ?? "")
    .split(/\r?\n/)
    .map((name) => name.trim())
    .filter(Boolean);

type SponsorRow = NonNullable<SponsorsPage["sponsors"]>[number];

const isMediaDoc = (value: SponsorRow["image"]): value is Media =>
  typeof value === "object" && value !== null && "id" in value;

const normalizeHref = (rawHref?: string | null): string | undefined => {
  if (!rawHref) {
    return undefined;
  }

  const href = rawHref.trim();
  if (!href) {
    return undefined;
  }

  if (href.startsWith("/") && !href.startsWith("//")) {
    return href;
  }

  if (/^https?:\/\//i.test(href)) {
    return href;
  }

  return undefined;
};

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

export const toSponsorWithImageDTO = (
  row: SponsorRow,
  index: number,
): SponsorWithImageDTO | null => {
  const companyName = row.companyName.trim();
  const image = toSponsorMediaDTO(row.image);

  if (!companyName || !image) {
    return null;
  }

  const href = normalizeHref(row.href);

  return {
    companyName,
    id: row.id ?? `${companyName}-${index}`,
    ...(href ? { href } : {}),
    image,
  };
};
