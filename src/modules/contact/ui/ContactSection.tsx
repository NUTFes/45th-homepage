"use client";

import type { InputHTMLAttributes } from "react";
import { tv } from "tailwind-variants";
import { twMerge } from "tailwind-merge";

import { FieldLabel } from "./FieldLabel";
import { useFieldIds } from "./useFieldIds";

const FIELD_ID_PREFIX = "contact-section";

const baseFieldStyles = tv({
  base: "w-full rounded-lg border bg-secondary px-l text-Ptext-large text-base-dark outline-hidden transition placeholder:text-placeholder disabled:cursor-not-allowed disabled:opacity-60 md:text-Ptext-large",
  variants: {
    variant: {
      text: "min-h-14 border-base-dark py-xs focus-visible:border-main focus-visible:ring-2 focus-visible:ring-main/40",
      textarea:
        "border-base-dark py-[15px] focus-visible:border-main focus-visible:ring-2 focus-visible:ring-main/40",
    },
    invalid: {
      true: "border-2 border-required focus-visible:border-required focus-visible:ring-required/40",
      false: "",
    },
  },
});

const errorWrapperStyles = tv({
  base: "w-full bg-required-bg px-l py-[19px]",
});

type ControlledValueProps = {
  value: string;
  onChange?: (value: string) => void;
  defaultValue?: never;
};

type UncontrolledValueProps = {
  defaultValue?: string;
  value?: never;
  onChange?: (value: string) => void;
};

type InputType = Extract<
  InputHTMLAttributes<HTMLInputElement>["type"],
  "email" | "search" | "tel" | "text" | "url"
>;

type BaseProps = (ControlledValueProps | UncontrolledValueProps) & {
  label: string;
  required?: boolean;
  placeholder?: string;
  onBlur?: () => void;
  name?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  error?: string;
  autoComplete?: InputHTMLAttributes<HTMLInputElement>["autoComplete"];
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  enterKeyHint?: InputHTMLAttributes<HTMLInputElement>["enterKeyHint"];
};

type TextProps = BaseProps & {
  type?: InputType;
};

type TextareaProps = BaseProps & {
  type: "textarea";
  rows?: number;
};

export type ContactSectionProps = TextProps | TextareaProps;

export default function ContactSection(props: ContactSectionProps) {
  const {
    label,
    required = false,
    placeholder,
    onChange,
    onBlur,
    name,
    disabled,
    className,
    id,
    error,
    autoComplete,
    maxLength,
    minLength,
    pattern,
    enterKeyHint,
  } = props;

  const ids = useFieldIds({ prefix: FIELD_ID_PREFIX, id });
  const hasError = Boolean(error);
  const describedBy = hasError ? ids.errorId : undefined;

  const isTextarea = props.type === "textarea";
  const rows = isTextarea ? (props.rows ?? 5) : undefined;
  const fieldClassName = baseFieldStyles({
    variant: isTextarea ? "textarea" : "text",
    invalid: hasError,
  });

  const inputSharedProps = {
    id: ids.id,
    name,
    disabled,
    placeholder,
    autoComplete,
    maxLength,
    minLength,
    required,
    "aria-required": required || undefined,
    "aria-invalid": hasError || undefined,
    "aria-errormessage": hasError ? ids.errorId : undefined,
    "aria-describedby": describedBy,
  } as const;
  const valueProps =
    "value" in props ? { value: props.value } : { defaultValue: props.defaultValue };
  const readOnly = "value" in props && !onChange;

  return (
    <div
      className={twMerge(
        "flex w-full flex-col items-start gap-ss md:flex-row md:gap-ll",
        className,
      )}
    >
      <FieldLabel label={label} htmlFor={ids.id} required={required} />
      <div
        className={twMerge(
          "w-full px-ll md:min-w-0 md:flex-1 md:px-0",
          hasError && errorWrapperStyles(),
          hasError && "md:px-l",
        )}
      >
        {isTextarea ? (
          <textarea
            {...inputSharedProps}
            {...valueProps}
            rows={rows}
            readOnly={readOnly}
            onChange={(event) => onChange?.(event.target.value)}
            onBlur={onBlur}
            className={fieldClassName}
          />
        ) : (
          <input
            {...inputSharedProps}
            type={props.type ?? "text"}
            {...valueProps}
            inputMode={props.inputMode}
            pattern={pattern}
            enterKeyHint={enterKeyHint}
            readOnly={readOnly}
            onChange={(event) => onChange?.(event.target.value)}
            onBlur={onBlur}
            className={fieldClassName}
          />
        )}
        {hasError && (
          <p id={ids.errorId} role="alert" className="mt-ss text-button text-required">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
