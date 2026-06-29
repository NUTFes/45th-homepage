import Image from "next/image";
import Link from "next/link";
import HeaderMenuButton from "@/components/layout/HeaderMenuButton";

const headerNavItems = [
  { label: "企画情報" },
  { label: "スケジュール" },
  { label: "マップ" },
  { label: "利用案内" },
] as const;

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
              <li key={item.label}>
                <span aria-disabled="true" className="cursor-not-allowed text-font-gray">
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </nav>
        <HeaderMenuButton />
      </div>
    </header>
  );
}
