import type { ReactNode } from "react";

type DevPanelProps = {
  children: ReactNode;
  fullWidth?: boolean;
  title: string;
};

export const DevPanel = ({ children, fullWidth = false, title }: DevPanelProps) => {
  return (
    <article
      className={
        fullWidth
          ? "border-y border-base/20 bg-white shadow-sm"
          : "mx-m overflow-hidden rounded-xl border border-base/20 bg-white shadow-sm xl:mx-auto xl:w-full xl:max-w-6xl"
      }
    >
      <header className="border-b border-base/10 bg-secondary/50 px-m py-xs">
        <h3 className="text-text-small text-base-dark/70">{title}</h3>
      </header>
      <div className={fullWidth ? "min-w-0 overflow-x-auto" : "min-w-0 overflow-x-auto p-m"}>
        {children}
      </div>
    </article>
  );
};
