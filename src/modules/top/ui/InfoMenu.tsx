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
  },
  {
    name: "注意事項",
    icon: TriangleAlert,
    href: "/",
  },
  {
    name: "案内所・ヘルプ",
    icon: MessageCircleQuestionMark,
    href: "/",
  },
  {
    name: "アクセス",
    icon: BusFront,
    href: "/",
  },
  {
    name: "協賛企業一覧",
    icon: Building2,
    href: "/",
  },
];

export default function InfoMenu() {
  return (
    <nav className="bg-base">
      <ul className="flex w-full list-none flex-col gap-s">
        {InfoMenuItems.map((item) => (
          <li key={item.name} className="px-3l">
            <Link href={item.href} className="pointer-events-none flex items-center gap-[10px]">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center">
                <item.icon
                  className={/* 本来のフォントカラー　 "text-secondary" */ "text-[#8892b0]"}
                  size={24}
                />
              </div>
              <span
                className={
                  /* 本来のフォントカラー "text-font-main" */ "text-title-small text-[#8892b0]"
                }
              >
                {item.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
