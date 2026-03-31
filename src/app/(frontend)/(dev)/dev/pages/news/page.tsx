import NewsPaginationClient from "./NewsPaginationClient";

import { DevPageContainer } from "../../_components/DevPageContainer";
import { DevPanel } from "../../_components/DevPanel";
import { DevSection } from "../../_components/DevSection";

export const metadata = {
  title: "News Page Modules - Dev",
  description: "src/modules/news/ui のコンポーネントをページ文脈で確認",
};

export default function DevNewsPageModulesPage() {
  return (
    <DevPageContainer
      title="News Page Modules"
      description="src/modules/news/ui のコンポーネントをページ文脈で確認"
    >
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
