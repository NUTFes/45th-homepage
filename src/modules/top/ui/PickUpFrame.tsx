import type { ReactNode } from "react";

type PickUpFrameProps = {
  children: ReactNode;
};

export const PickUpFrame = ({ children }: PickUpFrameProps) => {
  return (
    <div className="relative w-full py-1.5">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[1.2px] bg-main" />
      <div className="relative h-69.5 w-full overflow-hidden border-y-[1.4px] border-button-line bg-base-dark md:h-110">
        {children}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[1.2px] bg-main"
      />
    </div>
  );
};

export default PickUpFrame;
