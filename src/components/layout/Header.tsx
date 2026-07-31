import Image from "next/image";
import Link from "next/link";
import HeaderDropdown from "@/components/layout/HeaderDropdown";
import type { HeaderDropdownItem } from "@/components/layout/HeaderDropdown";
import HeaderMenuButton from "@/components/layout/HeaderMenuButton";

type HeaderNavItem =
  | {
      label: string;
      href: string;
      disabled?: boolean;
    }
  | {
      label: string;
      items: HeaderDropdownItem[];
      disabled?: boolean;
    };

const headerNavItems: HeaderNavItem[] = [
  {
    label: "企画情報",
    items: [
      { label: "すべてのイベント・販売", href: "/event" },
      { label: "ゲスト", href: "/event/guest" },
      { label: "コラボ", href: "/#", disabled: true },
      { label: "企画", href: "/event/programs/category/program" },
      { label: "展示・体験", href: "/event/programs/category/exhibition" },
      { label: "食品販売", href: "/event/programs/category/food" },
      { label: "物品販売", href: "/event/programs/category/goods" },
      { label: "企業ブース", href: "/event/programs/category/corporate" },
    ],
  },
  { label: "スケジュール", href: "/schedule" },
  { label: "マップ", href: "/map" },
  {
    label: "利用案内",
    items: [
      { label: "注意事項", href: "/attention" },
      { label: "案内所・ヘルプ", href: "/#", disabled: true },
      { label: "アクセス", href: "/access" },
    ],
  },
];

export default function Page() {
  return (
    <header className="sticky top-0 z-100 flex h-(--header-height) w-full items-center justify-between bg-white px-m py-xs [--header-height:72px] md:px-5l">
      <div>
        <Link
          href="/#top"
          aria-label="45th 技大祭 トップへ"
          className="flex min-w-0 shrink-0 items-center gap-xs rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-main"
        >
          <Image src="/icon/45th-logo-top.svg" alt="" width={48} height={48} className="size-12" />

          <p className="truncate font-kaisotai text-title text-base-dark">
            45th <span className="tracking-[-0.2rem]">技大祭</span>
          </p>
        </Link>
      </div>

      <div className="hidden items-center gap-4l md:flex">
        <nav aria-label="ヘッダーナビゲーション" className="hidden lg:block">
          <ul className="flex items-center gap-4l text-Pbutton text-base-dark">
            {headerNavItems.map((item) => (
              <li key={item.label} className="flex h-(--header-height) items-center">
                {"items" in item ? (
                  <HeaderDropdown disabled={item.disabled} label={item.label} items={item.items} />
                ) : item.disabled ? (
                  <span
                    aria-disabled="true"
                    className="inline-flex cursor-not-allowed py-s text-font-gray"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="inline-flex rounded-sm py-s transition-colors duration-200 hover:text-base hover:underline hover:underline-offset-4 focus-visible:underline focus-visible:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-main"
                  >
                    {item.label}
                  </Link>
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
