import { LucideHamburger, LucideIceCream, LucideMenu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
export default function Page() {
  return (
    <header className="sticky top-0 flex w-full items-center justify-between bg-white px-m py-m lg:px-m">
      <div className="flex items-center gap-xs">
        <Link href="/">
          <Image src="/icon/45th-logo-top.svg" alt="45thNUTFES ロゴ" width={48} height={48} />
        </Link>
        <div className="font-kaisotai text-title text-base-dark">45th NUTFES</div>
      </div>
      <div className="hidden gap-4l text-button text-base-dark lg:flex">
        <div className="text-font-gray">企画情報</div>
        <div className="text-font-gray">スケジュール</div>
        <div className="text-font-gray">マップ</div>
        <div className="text-font-gray">利用案内</div>
        <LucideMenu className="text-base-dark" size={36} />
      </div>
    </header>
  );
}
