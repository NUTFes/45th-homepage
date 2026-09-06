import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";

import InfoBlock from "@/components/ui/InfoBlock";
import InfoFrame from "@/components/ui/InfoFrame";
import SectionTitle from "@/components/ui/SectionTitle";

export type GuestInformationBlock = {
  id: string;
  title: ReactNode;
  icon: LucideIcon;
  accent?: boolean;
  body: ReactNode;
};

type GuestInformationSectionBaseProps = {
  id: string;
  title: string;
  className?: string;
};

type GuestInformationSectionProps = GuestInformationSectionBaseProps &
  (
    | {
        status?: "published" | "publishing";
        blocks: readonly GuestInformationBlock[];
      }
    | {
        status: "coming-soon";
        blocks?: never;
      }
  );

export default function GuestInformationSection(props: GuestInformationSectionProps) {
  const { id, title, className, status } = props;
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
          {status === "coming-soon" ? (
            <p className="flex min-h-pm items-center justify-center text-center font-kaisotai text-title text-main md:text-Ptitle">
              COMING SOON
            </p>
          ) : (
            <div className="flex flex-col gap-l md:gap-4l">
              {props.blocks.map((block) => (
                <InfoBlock
                  accent={block.accent}
                  icon={block.icon}
                  key={block.id}
                  title={block.title}
                >
                  {block.body}
                </InfoBlock>
              ))}
            </div>
          )}
        </InfoFrame>
      </div>
    </section>
  );
}
