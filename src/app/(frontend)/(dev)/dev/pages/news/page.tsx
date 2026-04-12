import SectionTitle from "@/components/ui/SectionTitle";
import NewsList from "@/modules/news/ui/NewsList";
import NewsPagination from "@/modules/news/ui/NewsPagination";
import { sampleNewsItems } from "../../_data/sampleNews";

import { DevPageContainer } from "../../_components/DevPageContainer";
import { DevPanel } from "../../_components/DevPanel";
import { DevSection } from "../../_components/DevSection";
import NewsPaginationClient from "./NewsPaginationClient";

export const metadata = {
  title: "News Page Modules - Dev",
  description: "src/modules/news のコンポーネントをページ文脈で確認",
};

export default function DevNewsPageModulesPage() {
  return (
    <DevPageContainer
      title="News Page Modules"
      description="src/modules/news のコンポーネントをページ文脈で確認"
    >
      <DevSection title="News Page View">
        <DevPanel title="NewsPageView (Mocked Data)">
          <div className="flex w-full flex-col items-center bg-base py-4l">
            <div className="flex w-full max-w-105 flex-col gap-4l">
              <div className="flex flex-col gap-s">
                <SectionTitle title="お知らせ" />
                <div className="w-full px-ll">
                  <NewsList items={sampleNewsItems.slice(0, 5)} />
                </div>
              </div>
              <NewsPagination currentPage={1} totalPages={2} />
            </div>
          </div>
        </DevPanel>
      </DevSection>
      <DevSection title="Pagination">
        <DevPanel title="NewsPagination (src/modules/news/ui)">
          <NewsPaginationClient />
        </DevPanel>
        <DevPanel title="NewsPagination - 3ページ目">
          <NewsPaginationClient initialPage={3} />
        </DevPanel>
        <DevPanel title="NewsPagination - 最後のページ">
          <NewsPaginationClient initialPage={5} />
        </DevPanel>
      </DevSection>
    </DevPageContainer>
  );
}
