import Link from "next/link";

import { DevPageContainer } from "../_components/DevPageContainer";
import { DevSection } from "../_components/DevSection";

export const metadata = {
  title: "Page Modules - Dev",
  description: "ページ単位のコンポーネント群をカテゴリ別で確認",
};

export default function DevPageModulesIndexPage() {
  return (
    <DevPageContainer
      title="Page Modules"
      description="ページ単位のコンポーネント群をカテゴリ別で確認"
    >
      <DevSection title="Available Pages">
        <div className="mx-auto grid w-full max-w-7xl gap-m px-m md:grid-cols-2">
          <Link
            href="/dev/pages/top"
            className="space-y-xs rounded-lg border border-base/10 p-m transition-colors hover:bg-secondary"
          >
            <h3 className="text-title-small text-base-dark">Top Page</h3>
            <p className="text-text text-base-dark/80">src/modules/top/ui のコンポーネント確認</p>
            <p className="text-text-small text-base-dark underline">Open →</p>
          </Link>
          <Link
            href="/dev/pages/news"
            className="space-y-xs rounded-lg border border-base/10 p-m transition-colors hover:bg-secondary"
          >
            <h3 className="text-title-small text-base-dark">News Page</h3>
            <p className="text-text text-base-dark/80">src/modules/news/ui のコンポーネント確認</p>
            <p className="text-text-small text-base-dark underline">Open →</p>
          </Link>
          <Link
            href="/dev/pages/map"
            className="space-y-xs rounded-lg border border-base/10 p-m transition-colors hover:bg-secondary"
          >
            <h3 className="text-title-small text-base-dark">Map Page</h3>
            <p className="text-text text-base-dark/80">src/modules/map/ui のコンポーネント確認</p>
            <p className="text-text-small text-base-dark underline">Open →</p>
          </Link>
          <Link
            href="/dev/pages/event"
            className="space-y-xs rounded-lg border border-base/10 p-m transition-colors hover:bg-secondary"
          >
            <h3 className="text-title-small text-base-dark">Event Page</h3>
            <p className="text-text text-base-dark/80">src/modules/event/ui のコンポーネント確認</p>
            <p className="text-text-small text-base-dark underline">Open →</p>
          </Link>
          <Link
            href="/dev/pages/contact"
            className="space-y-xs rounded-lg border border-base/10 p-m transition-colors hover:bg-secondary"
          >
            <h3 className="text-title-small text-base-dark">Contact Page</h3>
            <p className="text-text text-base-dark/80">
              src/modules/contact/ui のコンポーネント確認
            </p>
            <p className="text-text-small text-base-dark underline">Open →</p>
          </Link>
          <Link
            href="/dev/pages/greeting"
            className="space-y-xs rounded-lg border border-base/10 p-m transition-colors hover:bg-secondary"
          >
            <h3 className="text-title-small text-base-dark">Greeting Page</h3>
            <p className="text-text text-base-dark/80">
              src/modules/greeting/ui のコンポーネント確認
            </p>
            href="/dev/pages/info"
            className="space-y-xs rounded-lg border border-base/10 p-m transition-colors hover:bg-secondary"
          >
            <h3 className="text-title-small text-base-dark">Info Page</h3>
            <p className="text-text text-base-dark/80">src/modules/info のコンポーネント確認</p>
            <p className="text-text-small text-base-dark underline">Open →</p>
          </Link>
        </div>
      </DevSection>
    </DevPageContainer>
  );
}
