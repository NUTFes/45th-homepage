import Image from "next/image";

import { Link } from "@/components/aria/Link";
import SectionTitle from "@/components/ui/SectionTitle";

const ANNIVERSARY_SITE_URL = "https://www.nagaokaut.ac.jp/j/50th/index.html";

export default function UniversitySection() {
  return (
    <section className="flex flex-col gap-s md:gap-m">
      <div className="flex flex-col gap-m md:gap-ll">
        <div className="md:mx-auto md:w-full md:max-w-[880px]">
          <SectionTitle title="学校について" />
        </div>

        <div className="w-full md:border-y md:border-main md:bg-secondary/20">
          <div className="relative mx-auto aspect-[3/2] w-full overflow-hidden border-2 border-main md:aspect-video md:max-w-[880px]">
            <Image
              src="/image/greeting/university-campus.png"
              alt="長岡技術科学大学のキャンパス"
              fill
              sizes="(min-width: 768px) 880px, 100vw"
              className="object-cover md:object-[center_76%]"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3l md:gap-ll">
        <div className="w-full px-ll md:mx-auto md:max-w-[880px] md:px-0">
          <div className="text-text text-font-main md:text-Ptext">
            <p className="text-textb md:text-Ptext md:font-bold">
              長岡技術科学大学は、令和8（2026）年10月1日に開学50周年を迎えます。
            </p>
            <p className="mt-[22px] md:mt-7">
              大学では技大祭のほか、地域の皆様や本学に関係する皆様と本学教職員・在校生との交流を深めていただくイベントを開催していきます。
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-ss">
          <p className="w-full px-ll text-center text-text text-font-main md:mx-auto md:max-w-[880px] md:px-0 md:text-Ptext">
            50周年記念サイトはこちら
          </p>
          <Link
            href={ANNIVERSARY_SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="長岡技術科学大学開学50周年記念サイト「独創を、発展へ。」を開く"
            className="flex h-[55px] w-[228px] shrink-0 items-center justify-center rounded-sm border-2 border-[#56aabc] bg-white px-s py-ss text-inherit no-underline shadow-[0_4px_2px_rgba(0,0,0,0.25)] outline-main md:h-[66px] md:w-[274px] md:rounded-[2px] md:border-[3px] md:px-[23px] md:py-[11px] md:shadow-[0_5.649px_2.825px_rgba(0,0,0,0.25)]"
          >
            <Image
              src="/image/greeting/university-50th-banner.jpg"
              alt=""
              width={1200}
              height={228}
              sizes="(min-width: 768px) 223px, 192px"
              className="block max-h-full max-w-full object-contain"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
