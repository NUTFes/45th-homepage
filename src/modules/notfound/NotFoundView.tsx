import ButtonMain from "@/components/ui/ButtonMain";
import { Suspense } from "react";
import Image from "next/image";

function NotFoundContent() {
  return (
    <div className="z-10 flex h-screen w-full flex-col items-center justify-center gap-y-4l text-center text-text text-white">
      <div className="flex flex-col items-center justify-center">
        <div className="flex h-[66px] flex-col items-center justify-center font-kaisotai text-[44px] lg:h-[120px] lg:text-[80px]">
          Oh No!
        </div>
        <div className="flex h-[120px] flex-col items-center justify-center font-kaisotai text-[100px] lg:h-[180px] lg:text-[160px]">
          404
        </div>
        <div className="flex h-[48px] flex-col items-center justify-center font-kaisotai text-[32px] lg:h-[60px] lg:text-[40px]">
          PAGE NOT FOUND
        </div>
        <div className="flex flex-col items-center justify-center text-text lg:text-Ptext-large">
          お探しのページは見つかりませんでした
        </div>
      </div>
      <ButtonMain href="/" title="GO BACK" px="px-4l" textSize="text-text-large lg:text-Ptitle-small"/>
    </div>
  );
}

function NotFoundSkeleton() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <div className="mb-4 h-16 w-16 animate-pulse rounded-full bg-gray-200"></div>
      <div className="mb-4 h-6 w-48 animate-pulse rounded bg-gray-200"></div>
      <div className="h-4 w-64 animate-pulse rounded bg-gray-200"></div>
    </div>
  );
}

export default function NotFoundView() {
  return (
    <div className="w-full">
      {/* スマホ版 */}
      <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-base py-4l">
        <Image
          src="/image/PageBack1.svg"
          alt="PageBack1"
          width={149}
          height={198}
          className="absolute top-0 right-0 z-0 lg:hidden"
        />
        <Image
          src="/image/PageBack2.svg"
          alt="PageBack2"
          width={149}
          height={198}
          className="absolute bottom-0 left-0 z-0 lg:hidden"
        />
        {/* PC版 */}
        <Image
          src="/image/PageBack1.svg"
          alt="PageBack1"
          width={300}
          height={300}
          className="absolute top-0 right-0 z-0 hidden lg:block"
        />
        <Image
          src="/image/PageBack2.svg"
          alt="PageBack2"
          width={300}
          height={600}
          className="absolute bottom-0 left-0 z-0 hidden lg:block"
        />
        <div className="z-index-0 relative">
          <Suspense fallback={<NotFoundSkeleton />}>
            <NotFoundContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
