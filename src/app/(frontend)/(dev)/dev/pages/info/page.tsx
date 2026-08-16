import InfoPageView from "@/modules/info/InfoPageView";

import { DevPageContainer } from "../../_components/DevPageContainer";
import { DevPanel } from "../../_components/DevPanel";
import { DevSection } from "../../_components/DevSection";

export const metadata = {
  title: "Info Page Modules - Dev",
  description: "src/modules/info のコンポーネントをページ文脈で確認",
};

export default function DevInfoPageModulesPage() {
  return (
    <DevPageContainer
      title="Info Page Modules"
      description="src/modules/info のコンポーネントをページ文脈で確認"
    >
      <DevSection title="InfoPageView">
        <DevPanel title="InfoPageView (src/modules/info)" fullWidth>
          <div className="bg-base">
            <InfoPageView />
          </div>
        </DevPanel>
      </DevSection>
    </DevPageContainer>
  );
}
