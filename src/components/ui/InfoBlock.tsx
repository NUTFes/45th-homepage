import type { ReactNode } from "react";
import { HelpCircle, type LucideIcon } from "lucide-react";

interface InfoBlockProps {
  icon?: LucideIcon;
  title: string;
  children: ReactNode;
}

export default function InfoBlock({ icon: Icon = HelpCircle, title, children }: InfoBlockProps) {
  return (
    <div className="flex flex-col gap-ss">
      <div className="flex w-fit max-w-full items-center gap-2.5 border-b border-white px-ss pb-1">
        <Icon aria-hidden="true" className="size-7 shrink-0" />
        <h3 className="min-w-0 text-title-small wrap-break-word text-white lg:text-Ptitle-small">
          {title}
        </h3>
      </div>
      <div className="pl-3 text-text lg:text-Ptext">{children}</div>
    </div>
  );
}
