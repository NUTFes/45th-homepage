import PickUpCarousel from "@/modules/top/ui/PickUpCarousel";
import PickUpFrame from "@/modules/top/ui/PickUpFrame";

import { DevPageContainer } from "../../_components/DevPageContainer";
import { DevPanel } from "../../_components/DevPanel";
import { DevSection } from "../../_components/DevSection";
import { topModuleSlides } from "../../_data/topModuleSlides";
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
        <DevPanel title="PickUpCarousel" fullWidth>
          <PickUpFrame>
            <PickUpCarousel slides={[...topModuleSlides]} autoPlay={{ delay: 2500 }} />
          </PickUpFrame>
        </DevPanel>
        <DevPanel title="PickUpFrame" fullWidth>
          <PickUpFrame>
            <PickUpCarousel slides={[]} />
          </PickUpFrame>
        </DevPanel>
      </DevSection>
      <DevSection title="Sponsor">
        <DevPanel title="SponsorSection (src/modules/top/ui)" fullWidth>
          <SponsorSection />
        </DevPanel>
      </DevSection>
      <DevSection title="InfoMenu">
        <DevPanel title="InfoMenu (src/modules/top/ui)" fullWidth>
          <InfoMenu />
        </DevPanel>
      </DevSection>
      <DevSection title="LogoInfo">
        <DevPanel title="LogoInfo (src/modules/top/ui)" fullWidth>
          <LogoInfo />
        </DevPanel>
      </DevSection>
    </DevPageContainer>
  );
}
