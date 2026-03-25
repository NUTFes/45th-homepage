import Link from "next/link";

import { DevPageContainer } from "../_components/DevPageContainer";
import { DevSection } from "../_components/DevSection";

export default function DevPageModulesIndexPage() {
  return (
    <DevPageContainer
      title="Page Modules"
      description="ページ単位のコンポーネント群をカテゴリ別で確認"
    >
      <DevSection title="Available Pages">
        <div className="grid gap-m md:grid-cols-2">
          <Link
            href="/dev/pages/top"
            className="space-y-xs rounded-lg border border-base/10 p-m transition-colors hover:bg-secondary"
          >
            <h3 className="text-title-small text-base-dark">Top Page</h3>
            <p className="text-text text-base-dark/80">src/modules/top/ui のコンポーネント確認</p>
            <p className="text-text-small text-base-dark underline">Open →</p>
          </Link>
        </div>
      </DevSection>
    </DevPageContainer>
  );
}
