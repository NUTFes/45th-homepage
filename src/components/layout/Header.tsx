import Image from "next/image";
import Link from "next/link";
export default function Page() {
  return (
    <header className="sticky top-0 w-full bg-white px-xs py-m gap-m flex items-center">
      <Link href="/">
        <Image src="/icon/45th-logo-top.svg" alt="45thNUTFES ロゴ" width={48} height={48} />
      </Link>
      <div className="text-title text-base-dark font-kaisotai">45th NUTFES</div>
    </header>
  );
}
