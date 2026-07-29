import GreetingSection from "@/modules/greeting/ui/GreetingSection";

import { DevPageContainer } from "../../_components/DevPageContainer";
import { DevPanel } from "../../_components/DevPanel";
import { DevSection } from "../../_components/DevSection";

export const metadata = {
  title: "Greeting Page Modules - Dev",
  description: "src/modules/greeting のコンポーネントをページ文脈で確認",
};

export default function DevGreetingPageModulesPage() {
  return (
    <DevPageContainer
      title="Greeting Page Modules"
      description="src/modules/greeting/ui のコンポーネントをページ文脈で確認"
    >
      <DevSection title="GreetingSection">
        <DevPanel title="通常状態" fullWidth>
          <GreetingSection
            name="鎌土　重晴"
            nameEng="SHIGEHARU KAMADO"
            imageSrc="/image/event/guest.jpg"
            imageAlt="鎌土　重晴"
            greetingTitle="技大祭へようこそ。頑張る学生に激励を！"
            greetingBody={
              "第 45 回技大祭へようこそお越しくださいました。技大祭はこれまで地域の皆様に温かく支えられ、本学が誇る理念としての「技学」の魅力や、学生たちの豊かな創造性を学内外へと発信する、活気ある交流の場として成長してまいりました。心より感謝申し上げます。\n\n" +
              "今年度の技大祭実行委員会が掲げたテーマは「Bluem Up Date（ブルーム アップ デート）」です。このテーマには、青春（Blue）、開花（Bloom up）、そして進化（Up date）の意味が掛け合わされています。その頭文字が示す“BUD（つぼみ）”の通り、学生たちがこれまでの伝統を大切に守りながらも、現状に満足することなく次の 50 年に向けて新たな挑戦を重ね、大きな花を咲かせていくという強い想いと覚悟が込められています。\n\n" +
              "また、技術革新や未来へのアップデートを連想させる「近未来感」というコンセプトを体現する試みとして、幻想的な空間を創出する「プロジェクションマッピング」や、一昨年の初登場以来、ご好評をいただいています迫力満点の「技大神輿」など、技大生だけでなく、ご来場いただいたすべての皆様が一緒に楽しめる企画が多数用意されております。技大祭をきっかけとして、学生とご来場の皆様\nとの間に温かい新たな交流が生まれることを大いに期待しております。\n\n" +
              "今日まで日々準備に奔走してきた学生たちの生き生きとした姿をぜひご覧いただき、その奮闘ぶりに温かいご声援をいただけますと幸いです。\n今後とも本学へのご支援をどうぞよろしくお願いします。"
            }
          />
        </DevPanel>
      </DevSection>
    </DevPageContainer>
  );
}
