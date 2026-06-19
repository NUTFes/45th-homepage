import SectionTitle from "@/components/ui/SectionTitle";
import EventFrame, { type EventFrameProps } from "@/components/ui/EventFrame";

type ProgramPageViewProps = {
  category: string;
};

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

export default function ProgramPageView({ category }: ProgramPageViewProps) {
  return (
    <div className="bg-base">
      <section aria-label={`${category}の企画一覧`} className="flex flex-col gap-s">
        <SectionTitle title={category} />
        <div className="flex justify-center">
          <ul className="grid grid-cols-[repeat(2,max-content)] gap-x-m gap-y-3l">
            {DUMMY_PROGRAMS.map((program) => (
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
