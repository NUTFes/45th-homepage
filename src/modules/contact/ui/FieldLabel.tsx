import { twMerge } from "tailwind-merge";

type FieldLabelProps = {
  label: string;
  htmlFor: string;
  id?: string;
  required?: boolean;
  className?: string;
};

export function FieldLabel({ label, htmlFor, id, required = false, className }: FieldLabelProps) {
  return (
    <div
      className={twMerge(
        "flex w-full items-start justify-between gap-ss pr-3l pl-ll md:w-60 md:shrink-0 md:px-0",
        className,
      )}
    >
      <label
        id={id}
        htmlFor={htmlFor}
        className="font-sans text-Ptext-large text-font-main md:text-Ptitle-small"
      >
        {label}
      </label>
      {required && (
        <span
          aria-hidden="true"
          className="shrink-0 rounded-lg bg-required-badge px-ss py-1 text-button text-font-main md:text-Pbutton"
        >
          必須
        </span>
      )}
    </div>
  );
}
