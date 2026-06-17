"use client";

import { useRowLabel } from "@payloadcms/ui";

type SponsorRowData = {
  companyName?: string | null;
};

export const SponsorRowLabel = () => {
  const { data, rowNumber } = useRowLabel<SponsorRowData>();
  const fallbackNumber = typeof rowNumber === "number" ? rowNumber + 1 : 1;
  const label = data.companyName || `協賛企業 ${fallbackNumber}`;

  return <span>{label}</span>;
};
