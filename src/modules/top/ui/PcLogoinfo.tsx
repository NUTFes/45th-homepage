import Image from "next/image";

export default function PcLogoInfo() {
  return (
    <section className="flex w-full  items-center justify-center gap-pm bg-linear-to-b from-[#FFFAFA] from-[6.73%] via-[#9399C7] via-[50.48%] to-base py-ll px-pll">
      <Image src="/image/45th-LogoBlue.svg" alt="45th技大祭ロゴ" width={256} height={256} />
      <p className="px-12 text-center text-text text-font-main">
        これは説明文です。これは説明文です。これは説明文です。 これは説明文です。これは説明文です。
        これは説明文です。これは説明文です。これは説明文です。
      </p>
    </section>
  );
}
