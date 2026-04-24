import Image from "next/image";

export default function LogoInfo() {
  return (
    <section className="flex w-full flex-col items-center justify-center gap-ll bg-linear-to-b from-[#FFFAFA] from-[6.73%] via-[#9399C7] via-[50.48%] to-base py-3l">
      <Image src="/image/45th-logo.svg" alt="45th技大祭ロゴ" width={140} height={140} />
      <p className="px-12 text-center text-text text-font-main">
        これは説明文です。これは説明文です。これは説明文です。 これは説明文です。これは説明文です。
        これは説明文です。これは説明文です。これは説明文です。
      </p>
    </section>
  );
}
