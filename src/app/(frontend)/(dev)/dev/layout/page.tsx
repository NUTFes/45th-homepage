import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import Menu from "@/components/layout/Menu";
import ButtonMain from "@/components/ui/ButtonMain";
import SponsorAdCarousel from "@/modules/sponsors/ui/SponsorAdCarousel";
import SponsorAdsSectionSkeleton from "@/modules/sponsors/ui/SponsorAdsSectionSkeleton";
import type { SponsorWithImageDTO } from "@/modules/sponsors/types";

import { DevPageContainer } from "../_components/DevPageContainer";
import { DevPanel } from "../_components/DevPanel";
import { DevSection } from "../_components/DevSection";

const sponsorSamples = [
  {
    companyName: "サンプル株式会社",
    id: "sample-sponsor-1",
    image: {
      alt: "45th logo",
      id: 1,
      url: "/image/45th-logo.svg",
    },
  },
  {
    companyName: "長岡技大広告社",
    id: "sample-sponsor-2",
    image: {
      alt: "45th top icon",
      id: 2,
      url: "/icon/45th-logo-top.svg",
    },
  },
  {
    companyName: "技大祭パートナーズ",
    id: "sample-sponsor-3",
    image: {
      alt: "45th logo",
      id: 3,
      url: "/image/45th-logo.svg",
    },
  },
  {
    companyName: "青葉広告企画",
    id: "sample-sponsor-4",
    image: {
      alt: "45th top icon",
      id: 4,
      url: "/icon/45th-logo-top.svg",
    },
  },
  {
    companyName: "長岡ものづくり株式会社",
    id: "sample-sponsor-5",
    image: {
      alt: "45th logo",
      id: 5,
      url: "/image/45th-logo.svg",
    },
  },
  {
    companyName: "未来協賛社",
    id: "sample-sponsor-6",
    image: {
      alt: "45th top icon",
      id: 6,
      url: "/icon/45th-logo-top.svg",
    },
  },
] satisfies SponsorWithImageDTO[];

export default function DevLayoutComponentsPage() {
  return (
    <DevPageContainer
      title="Layout Components"
      description="レイアウト系コンポーネントの見た目・配置確認"
    >
      <DevSection title="Layout">
        <DevPanel title="Header">
          <Header />
        </DevPanel>

        <DevPanel title="Footer">
          <Footer />
        </DevPanel>

        <DevPanel title="BottomNav">
          <BottomNav />
        </DevPanel>

        <DevPanel title="Menu">
          <Menu />
        </DevPanel>
      </DevSection>

      <DevSection title="Sponsor Ads Slot">
        <DevPanel title="Page-level placement example">
          <div className="bg-base py-4l md:py-5l">
            <section className="flex w-full flex-col items-center gap-m" aria-label="協賛企業広告">
              <SponsorAdCarousel sponsors={sponsorSamples} />
              <ButtonMain href="/sponsors" title="ご協賛いただいた企業様" />
            </section>
          </div>
        </DevPanel>

        <DevPanel title="SponsorAdsSection skeleton fallback">
          <SponsorAdsSectionSkeleton className="bg-base py-4l md:py-5l" />
        </DevPanel>
      </DevSection>
    </DevPageContainer>
  );
}
