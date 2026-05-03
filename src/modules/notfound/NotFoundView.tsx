import ButtonMain from "@/components/ui/ButtonMain";
import { Suspense } from "react";
import Image from "next/image";

function NotFoundContent() {
  return (
    <div className="flex flex-col items-center justify-center text-center w-full h-screen text-white gap-y-4l text-text z-10">

        
        <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center font-kaisotai text-[44px] lg:text-[80px] h-[66px] lg:h-[120px]">Oh No!</div>  
        <div className="flex flex-col items-center justify-center font-kaisotai h-[120px] lg:h-[180px] flex justify-center text-[100px] lg:text-[160px] items-center">404</div>
        <div className="flex flex-col items-center justify-center font-kaisotai text-[32px] lg:text-[40px] h-[48px] lg:h-[60px]">PAGE NOT FOUND</div>
        <div className="flex flex-col items-center justify-center text-text lg:text-Ptext-large">お探しのページは見つかりませんでした</div>
      </div>
      <ButtonMain href="/" title="GO　BACK" px="px-4l" textSize="text-text-large lg:text-Ptitle-small"/>
    </div>
  );
}

function NotFoundSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <div className="w-16 h-16 bg-gray-200 rounded-full mb-4 animate-pulse"></div>
      <div className="w-48 h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
      <div className="w-64 h-4 bg-gray-200 rounded animate-pulse"></div>
    </div>
  );
}

export default function NotFoundView() {
  return (
    <div className="w-full">
      {/* スマホ版 */}
      <div className="relative flex min-h-screen flex-col items-center bg-base py-4l overflow-hidden">
      <Image
        src="/image/PageBack1.svg"
        alt="PageBack1"
        width={149}
        height={198}
        className="absolute right-0 top-0 z-0 lg:hidden"
      />
      <Image
        src="/image/PageBack2.svg"
        alt="PageBack2"
        width={149}
        height={198}
        className="absolute left-0 bottom-0 z-0 lg:hidden"
      />
      {/* PC版 */}
      <Image
        src="/image/PageBack1.svg"
        alt="PageBack1"
        width={300}
        height={300}
        className="absolute right-0 top-0 z-0 hidden lg:block"
      />
      <Image
        src="/image/PageBack2.svg"
        alt="PageBack2"
        width={300}
        height={600}
        className="absolute left-0 bottom-0 z-0 hidden lg:block"
      />
      <div className="relative z-index-0">
        <Suspense fallback={<NotFoundSkeleton />}>
          <NotFoundContent />
        </Suspense>
      </div>
    </div>
    </div>
  );
}