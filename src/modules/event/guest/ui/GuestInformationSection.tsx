import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";

import InfoBlock from "@/components/ui/InfoBlock";
import InfoFrame from "@/components/ui/InfoFrame";
import SectionTitle from "@/components/ui/SectionTitle";

export type GuestInformationBlock = {
  title: string;
  icon: LucideIcon;
  body: ReactNode;
};

type GuestInformationSectionProps = {
  id: string;
  title: string;
  blocks: readonly GuestInformationBlock[];
  className?: string;
};

export default function GuestInformationSection({
  id,
  title,
  blocks,
  className,
}: GuestInformationSectionProps) {
  const headingId = `guest-information-${id}`;

  return (
    <section
      aria-labelledby={headingId}
      className={twMerge("flex min-w-0 flex-col gap-s", className)}
    >
      <h2 id={headingId} className="sr-only">
        {title}
      </h2>
      <div aria-hidden="true">
        <SectionTitle title={title} />
      </div>
      <div className="px-ll py-1 lg:px-0">
        <InfoFrame className="w-full">
          <div className="flex flex-col gap-l">
            {blocks.map((block) => (
              <InfoBlock icon={block.icon} key={block.title} title={block.title}>
                {block.body}
              </InfoBlock>
            ))}
          </div>
        </InfoFrame>
      </div>
    </section>
  );
}
