import MapAccordion from "@/modules/map/ui/MapAccordion";
import MapMenu from "@/modules/map/ui/MapMenu";

import { DevPageContainer } from "../../_components/DevPageContainer";
import { DevPanel } from "../../_components/DevPanel";
import { DevSection } from "../../_components/DevSection";

const items = [
  { id: "map-1", title: "講義棟内マップ", content: <p>内容テキスト</p> },
  { id: "map-2", title: "屋外マップ", content: <p>内容テキスト</p> },
  { id: "map-3", title: "スタンプラリー", content: <p>内容テキスト</p> },
  { id: "map-4", title: "謎解き", content: <p>内容テキスト</p> },
];

export default function DevMapPageModules() {
  return (
    <DevPageContainer
      title="Map Modules"
      description="src/modules/map/ui のコンポーネントをページ文脈で確認"
    >
      <DevSection title="MapAccordion">
        <DevPanel title="Default">
          <MapAccordion items={items} />
        </DevPanel>
      </DevSection>

      <DevSection title="MapMenu">
        <DevPanel title="PC Default">
          <div className="flex min-h-224 justify-end overflow-hidden bg-secondary">
            <MapMenu className="static" />
          </div>
        </DevPanel>
      </DevSection>
    </DevPageContainer>
  );
}
