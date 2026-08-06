import Image from "next/image";

export default function ThemeSection() {
  return (
    <div className="relative w-full overflow-hidden bg-base-dark text-white">
      <div className="pointer-events-none absolute -top-4 md:-top-6 right-0 z-0">
        <Image
          src="/image/greeting/45th-logo-touka.svg"
          alt="45thロゴ"
          width={220}
          height={220}
          className="opacity-90 mix-blend-screen md:hidden"
        />
                <Image
          src="/image/greeting/45th-logo-touka.svg"
          alt="45thロゴ"
          width={300}
          height={300}
          className="opacity-90 mix-blend-screen md:flex hidden"
        />
      </div>
      <div className="z-10 flex flex-col justify-start gap-y-ss px-ll py-5l font-kaisotai text-title md:px-pl md:text-Ptitle">
        <div>技大祭テーマ</div>
        <div className="hidden font-goldman sm:flex">Bluem Up Date</div>
        <div className="font-goldman sm:hidden">
          Bluem Up <br />
          Date
        </div>
        <div className="font-sans text-text md:text-Ptext">
          青春の中で積み重ねた努力を当日に花開かせ、技大祭をさらに進化させていくことを表現しています。
        </div>
      </div>
    </div>
  );
}
