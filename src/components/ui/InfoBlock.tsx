import { ReactNode } from "react";
import { LucideIcon, HelpCircle } from "lucide-react";

interface InfoBlockProps {
  icon?: LucideIcon;
  title: string;
  children: ReactNode;
}

export default function InfoBlock({ icon: Icon = HelpCircle, title, children }: InfoBlockProps) {
  return (
    <div className="flex flex-col gap-ss">
      <div className="flex w-fit items-center gap-2.5 border-b border-white px-ss pb-1">
        <Icon size={28} />
        <div className="text-title-small text-white">{title}</div>
      </div>
      <div className="pl-3 text-text">{children}</div>
    </div>
  );
}
