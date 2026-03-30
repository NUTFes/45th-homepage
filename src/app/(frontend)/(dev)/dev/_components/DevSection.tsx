import type { ReactNode } from "react";

type DevSectionProps = {
  children: ReactNode;
  title: string;
};

export const DevSection = ({ children, title }: DevSectionProps) => {
  return (
    <section className="space-y-s rounded-xl border border-base/20 bg-white p-m shadow-sm">
      <h2 className="text-title-small text-base-dark">{title}</h2>
      {children}
    </section>
  );
};
