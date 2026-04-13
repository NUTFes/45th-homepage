import PickUpCarousel from "@/modules/top/ui/PickUpCarousel";
import PickUpFrame from "@/modules/top/ui/PickUpFrame";
import NewsTop from "@/modules/top/ui/NewsTop";

import { DevPageContainer } from "../../_components/DevPageContainer";
import { DevPanel } from "../../_components/DevPanel";
import { DevSection } from "../../_components/DevSection";
import { topModuleSlides } from "../../_data/topModuleSlides";
import { sampleNewsItems } from "../../_data/sampleNews";
import SponsorSection from "@/modules/top/ui/SponsorSection";
import InfoMenu from "@/modules/top/ui/InfoMenu";
import LogoInfo from "@/modules/top/ui/LogoInfo";

export default function DevTopPageModulesPage() {
  return (
    <DevPageContainer
      title="Top Page Modules"
      description="src/modules/top/ui のコンポーネントをページ文脈で確認"
    >
      <DevSection title="Top">
        <DevPanel title="PickUpCarousel">
          <PickUpFrame>
            <PickUpCarousel slides={[...topModuleSlides]} autoPlay={{ delay: 2500 }} />
          </PickUpFrame>
        </DevPanel>
        <DevPanel title="PickUpFrame">
          <PickUpFrame>
            <PickUpCarousel slides={[]} />
          </PickUpFrame>
        </DevPanel>
      </DevSection>
      <DevSection title="News">
        <DevPanel title="NewsTop (src/modules/top/ui)">
          <div className="grid place-items-center bg-base py-m">
            <NewsTop items={sampleNewsItems.slice(0, 3)} />
          </div>
        </DevPanel>
        <DevPanel title="NewsTop — empty state">
          <div className="grid place-items-center bg-base py-m">
            <NewsTop items={[]} />
          </div>
        </DevPanel>
      </DevSection>
      <DevSection title="Sponsor">
        <DevPanel title="SponsorSection (src/modules/top/ui)">
          <SponsorSection />
        </DevPanel>
      </DevSection>
      <DevSection title="InfoMenu">
        <DevPanel title="InfoMenu (src/modules/top/ui)">
          <InfoMenu />
        </DevPanel>
      </DevSection>
      <DevSection title="LogoInfo">
        <DevPanel title="LogoInfo (src/modules/top/ui)">
          <LogoInfo />
        </DevPanel>
      </DevSection>
    </DevPageContainer>
  );
}
