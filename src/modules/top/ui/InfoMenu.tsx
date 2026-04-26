import {
  UserStar,
  Building2,
  TriangleAlert,
  MessageCircleQuestionMark,
  BusFront,
} from "lucide-react";
import Link from "next/link";

const InfoMenuItems = [
  {
    name: "代表者挨拶",
    icon: UserStar,
    href: "/",
    disabled: true,
  },
  {
    name: "注意事項",
    icon: TriangleAlert,
    href: "/",
    disabled: true,
  },
  {
    name: "案内所・ヘルプ",
    icon: MessageCircleQuestionMark,
    href: "/",
    disabled: true,
  },
  {
    name: "アクセス",
    icon: BusFront,
    href: "/",
    disabled: true,
  },
  {
    name: "協賛企業一覧",
    icon: Building2,
    href: "/",
    disabled: true,
  },
];

export default function InfoMenu() {
  return (
    <nav >
      <ul className="flex w-full list-none flex-col gap-s">
        {InfoMenuItems.map((item) => (
          <li key={item.name} className="px-3l">
            {item.disabled ? (
              <span aria-disabled="true" className="flex items-center gap-[10px] text-[#8892b0]">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center">
                  <item.icon className="text-disabled" size={24} />
                </div>
                <span className="text-disabled text-title-small">{item.name}</span>
              </span>
            ) : (
              <Link href={item.href} className="flex items-center gap-[10px]">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center">
                  <item.icon className="text-secondary" size={24} />
                </div>
                <span className="text-title-small text-font-main">{item.name}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
