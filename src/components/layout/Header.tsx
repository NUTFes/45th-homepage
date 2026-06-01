import Image from "next/image";
import Link from "next/link";
import HeaderDropdown from "@/components/layout/HeaderDropdown";
import type { HeaderDropdownItem } from "@/components/layout/HeaderDropdown";
import HeaderMenuButton from "@/components/layout/HeaderMenuButton";

type HeaderNavItem =
  | {
      label: string;
      href?: string;
    }
  | {
      label: string;
      items: HeaderDropdownItem[];
    };

const headerNavItems: HeaderNavItem[] = [
  {
    label: "企画情報",
    items: [
      { label: "ゲスト", href: "/event/guest" },
      { label: "コラボ" },
      { label: "企画", href: "/event/programs" },
      { label: "展示・体験" },
      { label: "食品販売" },
      { label: "物品販売" },
      { label: "企業ブース" },
    ],
  },
  { label: "スケジュール", href: "/schedule" },
  { label: "マップ", href: "/map" },
  {
    label: "利用案内",
    items: [
      { label: "注意事項", href: "/attention" },
      { label: "案内所・ヘルプ" },
      { label: "アクセス", href: "/access" },
    ],
  },
];

export default function Page() {
  return (
    <header className="sticky top-0 z-100 flex h-(--header-height) w-full items-center justify-between bg-white px-m py-xs [--header-height:72px] md:px-5l">
      <div className="flex min-w-0 items-center gap-xs">
        <Link
          href="/"
          aria-label="45th NUTFES トップへ"
          className="shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-main"
        >
          <Image src="/icon/45th-logo-top.svg" alt="" width={48} height={48} className="size-12" />
        </Link>
        <p className="truncate font-kaisotai text-title text-base-dark">45th NUTFES</p>
      </div>

      <div className="hidden items-center gap-4l md:flex">
        <nav aria-label="ヘッダーナビゲーション" className="hidden lg:block">
          <ul className="flex items-center gap-4l text-Pbutton text-base-dark">
            {headerNavItems.map((item) => (
              <li key={item.label} className="flex h-(--header-height) items-center">
                {"items" in item ? (
                  <HeaderDropdown label={item.label} items={item.items} />
                ) : item.href ? (
                  <Link
                    href={item.href}
                    className="rounded-sm transition-colors duration-200 hover:text-base focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-main"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span>{item.label}</span>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <HeaderMenuButton />
      </div>
    </header>
  );
}
