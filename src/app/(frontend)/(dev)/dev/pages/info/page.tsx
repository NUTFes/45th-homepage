import ButtonMain from "@/components/ui/ButtonMain";
import InfoPageView from "@/modules/info/InfoPageView";
import SponsorCard from "@/modules/sponsors/ui/SponsorCard";

import { DevPageContainer } from "../../_components/DevPageContainer";
import { DevPanel } from "../../_components/DevPanel";
import { DevSection } from "../../_components/DevSection";

export const metadata = {
  title: "Info Page Modules - Dev",
  description: "src/modules/info のコンポーネントをページ文脈で確認",
};

const SponsorAdsPreview = (
  <section aria-label="協賛企業広告" className="flex w-full flex-col items-center gap-m">
    <div className="w-full bg-base-dark py-s lg:px-5l">
      <SponsorCard
        className="mx-auto w-full max-w-75 gap-xs md:w-full lg:max-w-62"
        sponsor={{ companyName: "企業名", id: "sponsor-ad-preview" }}
      />
    </div>
    <ButtonMain href="/sponsors" title="ご協賛いただいた企業様" />
  </section>
);

export default function DevInfoPageModulesPage() {
  return (
    <DevPageContainer
      title="Info Page Modules"
      description="src/modules/info のコンポーネントをページ文脈で確認"
    >
      <DevSection title="InfoPageView">
        <DevPanel title="InfoPageView (src/modules/info)" fullWidth>
          <div className="bg-base">
            <InfoPageView sponsorAds={SponsorAdsPreview} />
          </div>
        </DevPanel>
      </DevSection>
    </DevPageContainer>
  );
}
