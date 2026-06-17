import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import Menu from "@/components/layout/Menu";
import HeaderDropdown from "@/components/layout/HeaderDropdown";

import { DevPageContainer } from "../_components/DevPageContainer";
import { DevPanel } from "../_components/DevPanel";
import { DevSection } from "../_components/DevSection";

const headerDropdownItems = [
  { label: "ゲスト", href: "/event/guest" },
  { label: "コラボ", href: "/#", disabled: true },
  { label: "企画", href: "/event/programs" },
  { label: "展示・体験", href: "/#", disabled: true },
];

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

        <DevPanel title="HeaderDropdown">
          <div className="flex min-h-40 items-start justify-center bg-white pt-l [--header-height:72px]">
            <HeaderDropdown label="企画情報" items={headerDropdownItems} />
          </div>
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
