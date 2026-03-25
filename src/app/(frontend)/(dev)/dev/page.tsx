import Link from "next/link";

import { DevPageContainer } from "./_components/DevPageContainer";

export default function DevPreviewPage() {
  return (
    <DevPageContainer
      description="コンポーネントが増えても追いやすいよう、カテゴリ別ページに分割しています。"
      title="Dev Preview"
    >
      <div className="grid gap-m md:grid-cols-2">
        <Link
          href="/dev/layout"
          className="space-y-xs rounded-xl border border-base/20 bg-white p-m shadow-sm transition-colors hover:bg-secondary"
        >
          <h2 className="text-title-small text-base-dark">Layout Components</h2>
          <p className="text-text text-base-dark/80">Header / Footer / BottomNav の確認</p>
          <p className="text-text-small text-base-dark underline">Open →</p>
        </Link>

        <Link
          href="/dev/common"
          className="space-y-xs rounded-xl border border-base/20 bg-white p-m shadow-sm transition-colors hover:bg-secondary"
        >
          <h2 className="text-title-small text-base-dark">Common Components</h2>
          <p className="text-text text-base-dark/80">NavButton と Carousel 基本部品の確認</p>
          <p className="text-text-small text-base-dark underline">Open →</p>
        </Link>

        <Link
          href="/dev/pages"
          className="space-y-xs rounded-xl border border-base/20 bg-white p-m shadow-sm transition-colors hover:bg-secondary md:col-span-2"
        >
          <h2 className="text-title-small text-base-dark">Page Modules</h2>
          <p className="text-text text-base-dark/80">
            ページ単位（例: Top）のコンポーネント群を確認
          </p>
          <p className="text-text-small text-base-dark underline">Open →</p>
        </Link>
      </div>
    </DevPageContainer>
  );
}
