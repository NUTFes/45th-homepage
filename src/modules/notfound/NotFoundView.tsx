import Button404 from "@/components/ui/Button404";
import Image from "next/image";

function NotFoundContent() {
  return (
    <div className="z-10 flex h-screen w-full flex-col items-center justify-center gap-y-4l pb-4l text-center text-text text-white">
      <div className="flex flex-col items-center justify-center">
        <div className="flex h-16.5 flex-col items-center justify-center font-kaisotai text-[44px] lg:h-pm lg:text-[80px]">
          Oh No!
        </div>
        <div className="flex h-pm flex-col items-center justify-center font-kaisotai text-[100px] lg:h-45 lg:text-[160px]">
          404
        </div>
        <div className="flex h-12 flex-col items-center justify-center font-kaisotai text-[32px] lg:h-4l lg:text-[40px]">
          PAGE NOT FOUND
        </div>
        <div className="flex flex-col items-center justify-center text-text lg:text-Ptext-large">
          お探しのページは見つかりませんでした
        </div>
      </div>
      <Button404 title="GO BACK" />
    </div>
  );
}

export default function NotFoundView() {
  return (
    <div data-not-found-view className="fixed inset-0 z-400 h-dvh w-full overflow-hidden bg-base">
      <div className="relative flex h-full flex-col items-center overflow-hidden bg-base py-4l">
        <Image
          src="/image/PageBack1.svg"
          alt=""
          aria-hidden="true"
          width={287}
          height={333}
          className="absolute top-0 right-0 z-0 h-49.5 w-37.25 lg:h-75 lg:w-75"
        />
        <Image
          src="/image/PageBack2.svg"
          alt=""
          aria-hidden="true"
          width={243}
          height={644}
          className="absolute bottom-0 left-0 z-0 h-49.5 w-37.25 lg:h-150 lg:w-75"
        />
        <div className="z-index-0 relative">
          <NotFoundContent />
        </div>
      </div>
    </div>
  );
}
