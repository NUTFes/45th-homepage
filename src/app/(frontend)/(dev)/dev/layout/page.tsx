import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import Menu from "@/components/layout/Menu";

import { DevPageContainer } from "../_components/DevPageContainer";
import { DevPanel } from "../_components/DevPanel";
import { DevSection } from "../_components/DevSection";

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
    </DevPageContainer>
  );
}
