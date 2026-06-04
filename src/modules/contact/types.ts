export type ContactFormValues = {
  name: string;
  kana: string;
  gender: string;
  age: string;
  region: string;
  email: string;
  phone: string;
  inquiryType: string;
  inquiry: string;
};

export type ContactFormField = keyof ContactFormValues;

export type ContactFormErrors = {
  [K in ContactFormField]?: string;
};

export type ContactFormTouched = {
  [K in ContactFormField]?: boolean;
};

export type ContactFormValidator = (
  values: ContactFormValues,
) => ContactFormErrors | Promise<ContactFormErrors>;

export type ContactFormSubmitter = (values: ContactFormValues) => void | Promise<void>;

export type ContactFormSubmitResult = { ok: true } | { ok: false; error: string };
