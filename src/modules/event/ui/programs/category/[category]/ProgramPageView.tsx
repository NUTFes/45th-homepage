import SectionTitle from "@/components/ui/SectionTitle";
import EventFrame, { type EventFrameProps } from "@/components/ui/EventFrame";
import { PROGRAM_CATEGORIES, type ProgramCategory } from "@/lib/events/constants";

const DUMMY_PROGRAMS: EventFrameProps[] = [
  { name: "企画名サンプル1", href: "#1", imageUrl: "/favicon/45th-LogoBlue.svg" },
  { name: "企画名サンプル2", href: "#2", imageUrl: "/favicon/45th-LogoBlue.svg" },
  { name: "企画名サンプル3", href: "#3", imageUrl: "/favicon/45th-LogoBlue.svg" },
  { name: "企画名サンプル4", href: "#4", imageUrl: "/favicon/45th-LogoBlue.svg" },
  { name: "企画名サンプル5", href: "#5", imageUrl: "/favicon/45th-LogoBlue.svg" },
  { name: "企画名サンプル6", href: "#6", imageUrl: "/favicon/45th-LogoBlue.svg" },
  { name: "企画名サンプル7", href: "#7", imageUrl: "/favicon/45th-LogoBlue.svg" },
  { name: "企画名サンプル8", href: "#8", imageUrl: "/favicon/45th-LogoBlue.svg" },
  { name: "企画名サンプル9", href: "#9", imageUrl: "/favicon/45th-LogoBlue.svg" },
  { name: "企画名サンプル10", href: "#10", imageUrl: "/favicon/45th-LogoBlue.svg" },
];

type ProgramPageViewProps = {
  category: ProgramCategory;
  programs?: EventFrameProps[];
};

export default function ProgramPageView({
  category,
  programs = DUMMY_PROGRAMS,
}: ProgramPageViewProps) {
  const categoryLabel =
    PROGRAM_CATEGORIES.find(({ value }) => value === category)?.label ?? category;

  return (
    <div className="flex flex-col gap-4l bg-base pb-4l">
      <section aria-label={`${categoryLabel}の企画一覧`} className="flex flex-col gap-l">
        <SectionTitle title={categoryLabel} />
        <div className="flex justify-center">
          <ul className="grid grid-cols-[repeat(2,max-content)] gap-x-m gap-y-3l">
            {programs.map((program) => (
              <li key={program.href}>
                <EventFrame {...program} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
