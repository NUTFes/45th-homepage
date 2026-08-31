"use client";

import { useCallback, useRef, useState } from "react";
import type {
  ContactFormErrors,
  ContactFormField,
  ContactFormSubmitResult,
  ContactFormSubmitter,
  ContactFormTouched,
  ContactFormValidator,
  ContactFormValues,
} from "./types";

export type FieldRegisterProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
};

export type UseContactFormOptions = {
  defaultValues: ContactFormValues;
  validate?: ContactFormValidator;
  onSubmit: ContactFormSubmitter;
};

export type UseContactFormReturn = {
  values: ContactFormValues;
  errors: ContactFormErrors;
  touched: ContactFormTouched;
  isSubmitting: boolean;
  register: (name: ContactFormField) => FieldRegisterProps;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<ContactFormSubmitResult>;
  setValue: (name: ContactFormField, value: string) => void;
  setError: (name: ContactFormField, message: string) => void;
  clearError: (name: ContactFormField) => void;
  reset: () => void;
};

const omitKey = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  key: K,
): Omit<T, K> => {
  const { [key]: _omitted, ...rest } = obj;
  return rest;
};

export function useContactForm({
  defaultValues,
  validate,
  onSubmit,
}: UseContactFormOptions): UseContactFormReturn {
  const [values, setValues] = useState<ContactFormValues>(defaultValues);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [touched, setTouched] = useState<ContactFormTouched>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  const setValue = useCallback((name: ContactFormField, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? omitKey(prev, name) : prev));
  }, []);

  const setError = useCallback((name: ContactFormField, message: string) => {
    setErrors((prev) => ({ ...prev, [name]: message }));
  }, []);

  const clearError = useCallback((name: ContactFormField) => {
    setErrors((prev) => (prev[name] ? omitKey(prev, name) : prev));
  }, []);

  const markTouched = useCallback((name: ContactFormField) => {
    setTouched((prev) => (prev[name] ? prev : { ...prev, [name]: true }));
  }, []);

  const reset = useCallback(() => {
    setValues(defaultValues);
    setErrors({});
    setTouched({});
  }, [defaultValues]);

  const register = useCallback(
    (name: ContactFormField): FieldRegisterProps => ({
      value: values[name] ?? "",
      onChange: (value) => setValue(name, value),
      onBlur: () => markTouched(name),
    }),
    [values, setValue, markTouched],
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (isSubmittingRef.current) {
        return { ok: false, error: "送信中です" } as const;
      }

      const allTouched = Object.keys(values).reduce<ContactFormTouched>((acc, key) => {
        acc[key as ContactFormField] = true;
        return acc;
      }, {});
      setTouched(allTouched);

      const nextErrors: ContactFormErrors = validate ? await validate(values) : {};
      setErrors(nextErrors);

      const hasErrors = Object.values(nextErrors).some(Boolean);
      if (hasErrors) {
        return { ok: false, error: "入力内容を確認してください" } as const;
      }

      isSubmittingRef.current = true;
      setIsSubmitting(true);
      try {
        await onSubmit(values);
        return { ok: true } as const;
      } catch (error) {
        return {
          ok: false,
          error: error instanceof Error ? error.message : "送信に失敗しました",
        } as const;
      } finally {
        isSubmittingRef.current = false;
        setIsSubmitting(false);
      }
    },
    [values, validate, onSubmit],
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    register,
    handleSubmit,
    setValue,
    setError,
    clearError,
    reset,
  };
}
