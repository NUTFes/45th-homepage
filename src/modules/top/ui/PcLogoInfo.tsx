import Image from "next/image";

export default function PcLogoInfo() {
  return (
    <section
      aria-label="技大祭について"
      className="flex w-full items-center justify-center gap-pm bg-linear-to-r from-[#FFFAFA] from-[8.17%] via-[#9399C7] via-[54.81%] to-base px-pll py-ll"
    >
      <Image src="/image/45th-LogoBlue.svg" alt="45th技大祭ロゴ" width={260} height={260} />
      <p className="flex-1 text-center text-Ptext-large font-bold text-font-main">
        これは説明文です。これは説明文です。これは説明文です。 これは説明文です。これは説明文です。
        これは説明文です。これは説明文です。これは説明文です。
      </p>
    </section>
  );
}
