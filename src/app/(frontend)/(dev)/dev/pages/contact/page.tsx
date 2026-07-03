import { DevPageContainer } from "../../_components/DevPageContainer";
import { DevPanel } from "../../_components/DevPanel";
import { DevSection } from "../../_components/DevSection";
import ContactSectionPreview from "./ContactSectionPreview";
import ContactSectionErrorPreview from "./ContactSectionErrorPreview";
import ContactAccordionSectionPreview from "./ContactAccordionSectionPreview";
import ContactAccordionSectionErrorPreview from "./ContactAccordionSectionErrorPreview";

export const metadata = {
  title: "Contact Page Modules - Dev",
  description: "src/modules/contact のコンポーネントをページ文脈で確認",
};

export default function DevContactPageModulesPage() {
  return (
    <DevPageContainer
      title="Contact Page Modules"
      description="src/modules/contact のコンポーネントをページ文脈で確認"
    >
      <DevSection title="ContactSection (手入力フィールド)">
        <DevPanel title="通常状態">
          <ContactSectionPreview />
        </DevPanel>
        <DevPanel title="エラー状態">
          <ContactSectionErrorPreview />
        </DevPanel>
      </DevSection>

      <DevSection title="ContactAccordionSection (セレクトフィールド)">
        <DevPanel title="通常状態">
          <ContactAccordionSectionPreview />
        </DevPanel>
        <DevPanel title="エラー状態">
          <ContactAccordionSectionErrorPreview />
        </DevPanel>
      </DevSection>
    </DevPageContainer>
  );
}
