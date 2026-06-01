
import { DevPageContainer } from "../../_components/DevPageContainer";
import { DevPanel } from "../../_components/DevPanel";
import { DevSection } from "../../_components/DevSection";
import EventSection from "@/modules/event/ui/EventSection";

export default function DevTopPageModulesPage() {
  return (
    <DevPageContainer
      title="Event Page Modules"
      description="src/modules/event/ui のコンポーネントをページ文脈で確認"
    >
      <DevSection title="EventSection">
        <DevPanel title="EventSection (src/modules/event/ui)">
          <EventSection />
        </DevPanel>
      </DevSection>
    </DevPageContainer>
  );
}
