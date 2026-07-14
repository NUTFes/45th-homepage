import type { ReactNode } from "react";
import { DevNavigation } from "./_components/DevNavigation";

export default function DevLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-secondary/40">
      <div className="border-y border-base/20 bg-white px-m py-s shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-s">
          <div>
            <p className="text-title-small text-base-dark">Dev Preview</p>
            <p className="text-text-small text-base-dark/70">
              コンポーネントを実際の表示幅に近い状態で確認する開発専用ページ
            </p>
          </div>
          <DevNavigation />
        </div>
      </div>

      <main className="w-full min-w-0 py-l">{children}</main>
    </div>
  );
}
