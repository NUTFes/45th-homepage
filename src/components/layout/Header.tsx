import { LucideHamburger, LucideIceCream, LucideMenu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
export default function Page() {
  return (
    <header className="sticky top-0 flex w-full items-center justify-between bg-white px-5l py-m">
      <div className="flex gap-xs items-center">
      <Link href="/">
        <Image src="/icon/45th-logo-top.svg" alt="45thNUTFES ロゴ" width={48} height={48} />
      </Link>
      <div className="font-kaisotai text-title text-base-dark">45th NUTFES</div>
      </div>
      <div className="hidden lg:flex text-button text-base-dark gap-4l">
        <div className="text-font-gray">
          企画情報
        </div>
        <div className="text-font-gray">
          スケジュール
        </div>
       <div className="text-font-gray">
          マップ
        </div>
        <div className="text-font-gray">
          利用案内
        </div>
        <LucideMenu className="text-base-dark" size={36}/>
      </div>
    </header>
  );
}
