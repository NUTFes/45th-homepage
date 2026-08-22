"use client";

import { FieldDescription, FieldError, FieldLabel, useField } from "@payloadcms/ui";
import { useCallback } from "react";
import type { TextFieldClientComponent, Validate } from "payload";

import { TIMETABLE_END_TIME, TIMETABLE_START_TIME } from "@/lib/events/constants";

export const TimeField: TextFieldClientComponent = ({
  field,
  path: pathFromProps,
  readOnly,
  validate,
}) => {
  const { admin, label, localized, maxLength, minLength, required } = field;
  const memoizedValidate = useCallback<Validate>(
    (value, options) => {
      if (typeof validate !== "function") return true;

      return validate(
        value as string | null | undefined,
        {
          ...options,
          maxLength,
          minLength,
          required,
        } as Parameters<NonNullable<typeof validate>>[1],
      );
    },
    [maxLength, minLength, required, validate],
  );
  const { disabled, path, setValue, showError, value } = useField<string>({
    potentiallyStalePath: pathFromProps,
    validate: memoizedValidate,
  });
  const isDisabled = Boolean(readOnly || disabled);

  return (
    <div
      className={[
        "field-type",
        "text",
        admin?.className,
        showError ? "error" : undefined,
        isDisabled ? "read-only" : undefined,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <FieldLabel label={label} localized={localized} path={path} required={required} />
      <div className="field-type__wrap">
        <FieldError path={path} showError={showError} />
        <input
          disabled={isDisabled}
          id={`field-${path.replace(/\./g, "__")}`}
          max={TIMETABLE_END_TIME}
          min={TIMETABLE_START_TIME}
          name={path}
          onChange={(event) => setValue(event.target.value)}
          required={required}
          step={60}
          type="time"
          value={typeof value === "string" ? value : ""}
        />
        <FieldDescription description={admin?.description} path={path} />
      </div>
    </div>
  );
};
