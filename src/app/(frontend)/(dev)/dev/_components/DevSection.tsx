import type { ReactNode } from "react";

type DevSectionProps = {
  children: ReactNode;
  title: string;
};

export const DevSection = ({ children, title }: DevSectionProps) => {
  return (
    <section className="space-y-m">
      <h2 className="mx-auto w-full max-w-7xl px-m text-title-small text-base-dark">{title}</h2>
      {children}
    </section>
  );
};
