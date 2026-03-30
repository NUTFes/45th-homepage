"use client";
import { CalendarIcon } from "lucide-react";
import React from "react";
import {
  DatePicker as AriaDatePicker,
  DatePickerProps as AriaDatePickerProps,
  DateValue,
  ValidationResult,
} from "react-aria-components";
import { Calendar } from "@/components/aria/Calendar";
import { DateInput } from "@/components/aria/DateField";
import { Description, FieldError, FieldGroup, Label } from "@/components/aria/Field";
import { Popover } from "@/components/aria/Popover";
import { composeTailwindRenderProps } from "@/lib/react-aria-utils";
import { FieldButton } from "@/components/aria/FieldButton";

export interface DatePickerProps<T extends DateValue> extends AriaDatePickerProps<T> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function DatePicker<T extends DateValue>({
  label,
  description,
  errorMessage,
  ...props
}: DatePickerProps<T>) {
  return (
    <AriaDatePicker
      {...props}
      className={composeTailwindRenderProps(props.className, "group flex flex-col gap-1 font-sans")}
    >
      {label && <Label>{label}</Label>}
      <FieldGroup className="w-auto min-w-[208px] cursor-text disabled:cursor-default">
        <DateInput className="min-w-[150px] flex-1 px-3 text-sm" />
        <FieldButton className="mr-1 w-6 outline-offset-0">
          <CalendarIcon aria-hidden className="h-4 w-4" />
        </FieldButton>
      </FieldGroup>
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
      <Popover className="p-2">
        <Calendar />
      </Popover>
    </AriaDatePicker>
  );
}
