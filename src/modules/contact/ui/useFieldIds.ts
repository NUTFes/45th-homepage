import { useId } from "react";

type UseFieldIdsOptions = {
  prefix: string;
  id?: string;
};

export function useFieldIds({ prefix, id }: UseFieldIdsOptions) {
  const reactId = useId();
  const base = id ?? `${prefix}-${reactId}`;
  return {
    id: base,
    labelId: `${base}-label`,
    errorId: `${base}-error`,
    descriptionId: `${base}-description`,
  };
}
