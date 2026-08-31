import {
  UserStar,
  Building2,
  TriangleAlert,
  MessageCircleQuestionMark,
  BusFront,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

type InfoMenuItem = {
  name: string;
  icon: LucideIcon;
  href?: string;
  disabled?: boolean;
};

const InfoMenuItems: InfoMenuItem[] = [
  {
    name: "代表者挨拶",
    icon: UserStar,
    href: "/greeting",
  },
  {
    name: "注意事項",
    icon: TriangleAlert,
    href: "/attention",
    disabled: false,
  },
  {
    name: "案内所・ヘルプ",
    icon: MessageCircleQuestionMark,
    href: "/info",
  },
  {
    name: "アクセス",
    icon: BusFront,
    href: "/access",
  },
  {
    name: "協賛企業一覧",
    icon: Building2,
    href: "/sponsors",
    disabled: false,
  },
];

export default function InfoMenu() {
  return (
    <nav>
      <ul className="flex w-full list-none flex-col gap-s md:gap-m">
        {InfoMenuItems.map((item) => (
          <li key={item.name} className="px-3l">
            {item.disabled ? (
              <span aria-disabled="true" className="flex items-center gap-2.5 text-[#8892b0]">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center md:h-7 md:w-7">
                  <item.icon className="text-disabled md:h-7 md:w-7" size={24} />
                </div>
                <span className="text-disabled text-title-small md:text-[24px] md:leading-8.75">
                  {item.name}
                </span>
              </span>
            ) : (
              <Link href={item.href ?? "/"} className="flex items-center gap-2.5">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center md:h-7 md:w-7">
                  <item.icon className="text-secondary md:h-7 md:w-7" size={24} />
                </div>
                <span className="text-title-small text-font-main md:text-[24px] md:leading-8.75">
                  {item.name}
                </span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
