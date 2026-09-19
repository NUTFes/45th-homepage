"use client";

import { createContext, use, useCallback, useState, type ReactNode } from "react";

type HeroAnimationContextValue = {
  isHeroAnimationDone: boolean;
  markHeroAnimationDone: () => void;
};

const HeroAnimationContext = createContext<HeroAnimationContextValue | null>(null);

export function HeroAnimationProvider({ children }: { children: ReactNode }) {
  const [isHeroAnimationDone, setIsHeroAnimationDone] = useState(false);

  // 複数回発火しても問題ない(すでに true なら何もしない)
  const markHeroAnimationDone = useCallback(() => {
    setIsHeroAnimationDone(true);
  }, []);

  return (
    <HeroAnimationContext value={{ isHeroAnimationDone, markHeroAnimationDone }}>
      {children}
    </HeroAnimationContext>
  );
}

// Provider の外で使われた場合は「アニメーションは無い」ものとして扱う
// (常に true を返し、待たせない)。ヒーローが無いページでの誤用を避ける。
export function useHeroAnimation(): HeroAnimationContextValue {
  const context = use(HeroAnimationContext);
  return context ?? { isHeroAnimationDone: true, markHeroAnimationDone: () => {} };
}
