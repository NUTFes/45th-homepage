"use client";

import { ChevronDown } from "lucide-react";
import { tv } from "tailwind-variants";
import { twMerge } from "tailwind-merge";
import {
  Button as AriaButton,
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  Popover as AriaPopover,
  Select as AriaSelect,
  SelectValue,
} from "react-aria-components";

import { FieldLabel } from "./FieldLabel";
import { useFieldIds } from "./useFieldIds";

const FIELD_ID_PREFIX = "contact-accordion";

const triggerStyles = tv({
  base: "group/trigger flex min-h-14 w-full items-center justify-between rounded-lg border-[0.8px] border-base-dark bg-secondary px-l py-xs text-left text-text-large text-base-dark outline-hidden transition focus-visible:border-main focus-visible:ring-2 focus-visible:ring-main/40 disabled:cursor-not-allowed disabled:opacity-60 md:text-Ptext-large",
  variants: {
    invalid: {
      true: "border-2 border-required focus-visible:border-required focus-visible:ring-required/40",
      false: "",
    },
  },
});

const errorWrapperStyles = tv({
  base: "w-full bg-required-bg px-l py-[19px]",
});

const popoverStyles = tv({
  base: "w-(--trigger-width) overflow-hidden rounded-lg border border-base-dark bg-font-main shadow-lg outline-0",
});

const optionStyles = tv({
  base: "flex w-full cursor-pointer items-center border-b-[0.8px] border-base-dark px-l py-s text-left text-text-large text-base-dark outline-hidden last:border-b-0 hover:bg-base-dark/10 aria-selected:bg-base-dark aria-selected:text-font-main",
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

type ContactAccordionSectionProps = (ControlledValueProps | UncontrolledValueProps) & {
  label: string;
  required?: boolean;
  options: readonly string[];
  onBlur?: () => void;
  placeholder?: string;
  name?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  error?: string;
  autoComplete?: string;
};

const isNonEmpty = (value: string | undefined): value is string =>
  typeof value === "string" && value.length > 0;

export default function ContactAccordionSection({
  label,
  required = false,
  options,
  onChange,
  onBlur,
  placeholder = "選択してください",
  name,
  disabled,
  className,
  id,
  error,
  autoComplete,
  ...valueProps
}: ContactAccordionSectionProps) {
  const ids = useFieldIds({ prefix: FIELD_ID_PREFIX, id });
  const hasError = Boolean(error);
  const describedBy = hasError ? ids.errorId : undefined;

  const selectValueProps =
    "value" in valueProps
      ? { selectedKey: isNonEmpty(valueProps.value) ? valueProps.value : null }
      : {
          defaultSelectedKey: isNonEmpty(valueProps.defaultValue)
            ? valueProps.defaultValue
            : undefined,
        };

  return (
    <div
      className={twMerge(
        "flex w-full flex-col items-start gap-ss md:flex-row md:gap-ll",
        className,
      )}
    >
      <FieldLabel id={ids.labelId} label={label} htmlFor={ids.id} required={required} />
      <div
        className={twMerge(
          "w-full px-ll md:min-w-0 md:flex-1 md:px-0",
          hasError && errorWrapperStyles(),
          hasError && "md:px-l",
        )}
      >
        <AriaSelect
          className="group/select block w-full"
          isDisabled={disabled}
          isRequired={required}
          isInvalid={hasError}
          name={name}
          autoComplete={autoComplete}
          aria-labelledby={ids.labelId}
          aria-describedby={describedBy}
          aria-errormessage={hasError ? ids.errorId : undefined}
          {...selectValueProps}
          onSelectionChange={(key) => {
            if (key != null) {
              onChange?.(String(key));
            }
          }}
          onFocusChange={(isFocused) => {
            if (!isFocused) onBlur?.();
          }}
        >
          <AriaButton id={ids.id} className={triggerStyles({ invalid: hasError })}>
            <SelectValue className="flex-1 truncate">
              {({ selectedText, isPlaceholder }) =>
                isPlaceholder ? (
                  <span className="text-text-large text-placeholder md:text-Ptext-large">
                    {placeholder}
                  </span>
                ) : (
                  <span className="text-text-large text-base-dark md:text-Ptext-large">
                    {selectedText}
                  </span>
                )
              }
            </SelectValue>
            <ChevronDown
              aria-hidden
              className="size-10 shrink-0 text-base-dark transition-transform duration-200 group-data-open/select:rotate-180"
            />
          </AriaButton>
          <AriaPopover placement="bottom start" offset={4} className={popoverStyles()}>
            <AriaListBox
              aria-label={label}
              className="flex max-h-60 flex-col overflow-y-auto outline-hidden"
            >
              {options.map((option) => (
                <AriaListBoxItem
                  key={option}
                  id={option}
                  textValue={option}
                  className={optionStyles()}
                >
                  {option}
                </AriaListBoxItem>
              ))}
            </AriaListBox>
          </AriaPopover>
        </AriaSelect>
        {hasError && (
          <p id={ids.errorId} role="alert" className="mt-ss text-button text-required">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
