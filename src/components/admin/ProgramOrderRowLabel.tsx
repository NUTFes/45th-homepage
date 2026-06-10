"use client";

import { useRowLabel } from "@payloadcms/ui";

type ProgramRelationship =
  | number
  | string
  | {
      adminLabel?: string | null;
      id?: number | string;
      title?: string | null;
    };

type ProgramOrderRowData = {
  program?: ProgramRelationship | null;
  programLabel?: string | null;
};

const getRelationshipLabel = (program: ProgramRelationship | null | undefined) => {
  if (typeof program !== "object" || program === null) {
    return null;
  }

  return program.adminLabel || program.title || null;
};

export const ProgramOrderRowLabel = () => {
  const { data, rowNumber } = useRowLabel<ProgramOrderRowData>();
  const fallbackNumber = typeof rowNumber === "number" ? rowNumber + 1 : 1;
  const label = data.programLabel || getRelationshipLabel(data.program) || `企画 ${fallbackNumber}`;

  return <span>{label}</span>;
};
