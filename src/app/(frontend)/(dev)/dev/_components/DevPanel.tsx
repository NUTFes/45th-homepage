import type { ReactNode } from "react";

type DevPanelProps = {
  children: ReactNode;
  title: string;
};

export const DevPanel = ({ children, title }: DevPanelProps) => {
  return (
    <div className="space-y-m rounded-lg border border-base/10 p-m">
      <p className="text-text-small text-base-dark/70">{title}</p>
      {children}
    </div>
  );
};
