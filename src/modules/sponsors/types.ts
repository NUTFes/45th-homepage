import type { Media, SponsorsPage } from "@/payload-types";

export type SponsorMediaDTO = {
  id: Media["id"];
  url: string;
  alt: string;
  width?: number;
  height?: number;
};

export type SponsorDTO = {
  id: string;
  companyName: string;
  image?: SponsorMediaDTO;
};

export type SponsorWithImageDTO = SponsorDTO & {
  image: SponsorMediaDTO;
};

export type SponsorsPageData = {
  thanksMessage: SponsorsPage["thanksMessage"];
  sponsors: SponsorDTO[];
};
