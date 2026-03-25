import Image from "next/image";
import Link from "next/link";
export default function Page() {
  return (
    <header className="sticky top-0 flex w-full items-center gap-m bg-white px-xs py-m">
      <Link href="/">
        <Image src="/icon/45th-logo-top.svg" alt="45thNUTFES ロゴ" width={48} height={48} />
      </Link>
      <div className="font-kaisotai text-title text-base-dark">45th NUTFES</div>
    </header>
  );
}
