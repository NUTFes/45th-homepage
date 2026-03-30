import type { ReactNode } from "react";

type DevPageContainerProps = {
  children: ReactNode;
  description: string;
  title: string;
};

export const DevPageContainer = ({ children, description, title }: DevPageContainerProps) => {
  return (
    <div className="flex flex-col gap-l">
      <header className="space-y-xs">
        <h1 className="text-title-large text-base-dark">{title}</h1>
        <p className="text-text text-base-dark/80">{description}</p>
      </header>
      {children}
    </div>
  );
};
