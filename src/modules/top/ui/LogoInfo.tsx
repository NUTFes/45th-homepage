import Image from "next/image";

export default function LogoInfo() {
  return (
    <section
      aria-label="技大祭について"
      className="flex w-full flex-col items-center justify-center gap-ll bg-linear-to-b from-[#FFFAFA] from-[6.73%] via-[#9399C7] via-[64.42%] to-base py-3l md:flex-row md:gap-pm md:bg-linear-to-r md:from-[8.17%] md:via-[54.81%] md:px-pll md:py-ll"
    >
      <Image
        src="/favicon/45th-LogoBlue.svg"
        alt="45th技大祭ロゴ"
        width={260}
        height={260}
        className="h-[140px] w-[140px] md:h-[260px] md:w-[260px]"
      />
      <p className="px-3l text-center text-textb text-font-main md:flex-1 md:px-0 md:text-left md:text-Ptext-large md:font-bold">
        技大祭へようこそ！
        <br />
        「Bluem Up Date」と一緒に、花開くような
        <br />
        変化と新しいワクワクに出会おう。
      </p>
    </section>
  );
}
