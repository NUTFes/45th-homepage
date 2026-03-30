import type { ReactNode } from "react";

type PickUpFrameProps = {
  children: ReactNode;
};

const CORNER_SIZE = 20;
const CORNER_TOP_WIDTH = 145;
const CORNER_BOTTOM_WIDTH = 110;

export const PickUpFrame = ({ children }: PickUpFrameProps) => {
  return (
    <div className="relative w-full py-1.5">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[1.2px] bg-main" />
      <div className="relative h-69.5 w-full overflow-hidden border-y-[1.4px] border-button-line bg-base-dark">
        {children}

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-end"
        >
          <div
            className="bg-main"
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 14% 100%)",
              height: CORNER_SIZE,
              width: CORNER_TOP_WIDTH,
            }}
          />
        </div>

        <div aria-hidden className="pointer-events-none absolute bottom-0 left-0 z-10">
          <div
            className="bg-main"
            style={{
              clipPath: "polygon(0 0, 86% 0, 100% 100%, 0 100%)",
              height: CORNER_SIZE,
              width: CORNER_BOTTOM_WIDTH,
            }}
          />
        </div>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[1.2px] bg-main"
      />
    </div>
  );
};

export default PickUpFrame;
