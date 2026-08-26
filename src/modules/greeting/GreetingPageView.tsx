import ThemeSection from "./ui/ThemeSection";
import SectionTitle from "@/components/ui/SectionTitle";
import UniversitySection from "./ui/UniversitySection";
import GreetingSection from "./ui/GreetingSection";
import Image from "next/image";

export function GreetingPagePCView() {
  return (
    <div className="relative min-h-screen bg-base pb-pm">
      <ThemeSection />
      <div className="relative overflow-hidden">
        <Image
          src="/image/PageBack1.svg"
          alt=""
          aria-hidden="true"
          width={286}
          height={332}
          className="pointer-events-none absolute top-0 right-0 z-0 hidden md:block"
        />

        <Image
          src="/image/PageBack2.svg"
          alt=""
          aria-hidden="true"
          width={243}
          height={644}
          className="pointer-events-none absolute top-1/5 left-0 z-0 hidden md:block"
        />

        <div className="relative z-10 flex flex-col gap-y-5l py-5l">
          <div className="flex flex-col gap-y-ll">
            <div className="px-pl">
              <SectionTitle title="学長挨拶" />{" "}
            </div>
            <GreetingSection
              name="鎌土重晴"
              nameEng="SHIGEHARU KAMADO"
                imageSrc="/image/greeting/picture_kamado.jpg"
              imageAlt="校長挨拶"
              greetingTitle="技大祭へようこそ。頑張る学生に激励を！"
              greetingBody={`第 45 回技大祭へようこそお越しくださいました。技大祭はこれまで地域の皆様に温かく支えられ、本学が誇る理念としての「技学」の魅力や、学生たちの豊かな創造性を学内外へと発信する、活気ある交流の場として成長してまいりました。心より感謝申し上げます。

          今年度の技大祭実行委員会が掲げたテーマは「Bluem Up Date（ブルーム アップ デート）」です。このテーマには、青春（Blue）、開花（Bloom up）、そして進化（Up date）の意味が掛け合わされています。その頭文字が示す“BUD（つぼみ）”の通り、学生たちがこれまでの伝統を大切に守りながらも、現状に満足することなく次の 50 年に向けて新たな挑戦を重ね、大きな花を咲かせていくという強い想いと覚悟が込められています。

          また、技術革新や未来へのアップデートを連想させる「近未来感」というコンセプトを体現する試みとして、幻想的な空間を創出する「プロジェクションマッピング」や、一昨年の初登場以来、ご好評をいただいています迫力満点の「技大神輿」など、技大生だけでなく、ご来場いただいたすべての皆様が一緒に楽しめる企画が多数用意されております。技大祭をきっかけとして、学生とご来場の皆様との間に温かい新たな交流が生まれることを大いに期待しております。

          今日まで日々準備に奔走してきた学生たちの生き生きとした姿をぜひご覧いただき、その奮闘ぶりに温かいご声援をいただけますと幸いです。
          今後とも本学へのご支援をどうぞよろしくお願いします.`}
            />
          </div>
        </div>
        <div className="flex flex-col gap-y-ll">
          <div className="px-pl">
            <SectionTitle title="実行委員長挨拶" />{" "}
          </div>
          <GreetingSection
            name="齊藤　翔太"
            nameEng="SHOTA SAITO"
            imageSrc="/image/greeting/picture_shota.jpg"
            imageAlt="実行委員長挨拶"
            greetingTitle=""
            greetingBody={`皆様、本日は第45回 技大祭にご来場いただき、誠にありがとうございます。実行委員会を代表して、皆様を心より歓迎いたします。また、開催にあたり多大なるご支援をいただきました協賛団体の皆様、参加団体、大学関係者の方々、そして今日まで共に走り抜けてくれた350名を超える実行委員の仲間に、この場をお借りして深く感謝申し上げます。

今年のテーマは「Bluem Up Date」です。本学の先進性や近未来感を象徴する「Blue」と、新体制で新しいことに挑戦する「Up Date」など、様々な想いを込めました。私たち実行委員自身が祭づくりを全力で楽しみながら、常に新しい挑戦を続けていくという決意の表れでもあります。

その挑戦の象徴として、今年は新たな試みである「プロジェクションマッピング企画」をご用意いたしました。技大ならではの技術とアイデアが詰まった、近未来的な光の演出をぜひお楽しみください。さらに、お笑いゲストには「ヨネダ2000」さんをお迎えし、会場を大きな笑顔で包み込みます。

伝統を受け継ぎながらも、過去最高に「アップデート」された新しい技大祭の姿を、ぜひ全身で体感してください。皆様にとって、今日という日が最高に刺激的で、忘れられない一日となることを願い、実行委員長の挨拶とさせていただきます。どうぞ最後までお楽しみください.`}
          />
        </div>
      </div>
      <div className="border-b-2 border-main px-pl pt-5l pb-m">
        <UniversitySection />
      </div>
    </div>
  );
}
export function GreetingPageMobileView() {
  return (
    <div className="relative min-h-screen bg-base pb-pm">
      <ThemeSection />

      <div className="relative z-10 flex flex-col gap-y-5l py-5l">
        <div className="flex flex-col gap-y-ll">
          <div>
            <SectionTitle title="学長挨拶" />{" "}
          </div>
          <GreetingSection
            name="鎌土重晴"
            nameEng="SHIGEHARU KAMADO"
              imageSrc="/image/greeting/picture_kamado.jpg"
            imageAlt="校長挨拶"
            greetingTitle="技大祭へようこそ。頑張る学生に激励を！"
            greetingBody={`第 45 回技大祭へようこそお越しくださいました。技大祭はこれまで地域の皆様に温かく支えられ、本学が誇る理念としての「技学」の魅力や、学生たちの豊かな創造性を学内外へと発信する、活気ある交流の場として成長してまいりました。心より感謝申し上げます。

          今年度の技大祭実行委員会が掲げたテーマは「Bluem Up Date（ブルーム アップ デート）」です。このテーマには、青春（Blue）、開花（Bloom up）、そして進化（Up date）の意味が掛け合わされています。その頭文字が示す“BUD（つぼみ）”の通り、学生たちがこれまでの伝統を大切に守りながらも、現状に満足することなく次の 50 年に向けて新たな挑戦を重ね、大きな花を咲かせていくという強い想いと覚悟が込められています。

          また、技術革新や未来へのアップデートを連想させる「近未来感」というコンセプトを体現する試みとして、幻想的な空間を創出する「プロジェクションマッピング」や、一昨年の初登場以来、ご好評をいただいています迫力満点の「技大神輿」など、技大生だけでなく、ご来場いただいたすべての皆様が一緒に楽しめる企画が多数用意されております。技大祭をきっかけとして、学生とご来場の皆様との間に温かい新たな交流が生まれることを大いに期待しております。

          今日まで日々準備に奔走してきた学生たちの生き生きとした姿をぜひご覧いただき、その奮闘ぶりに温かいご声援をいただけますと幸いです。
          今後とも本学へのご支援をどうぞよろしくお願いします.`}
          />
        </div>
      </div>
      <div className="flex flex-col gap-y-ll">
        <div>
          <SectionTitle title="実行委員長挨拶" />{" "}
        </div>
        <GreetingSection
          name="齊藤　翔太"
          nameEng="SHOTA SAITO"
          imageSrc="/image/greeting/picture_shota.jpg"
          imageAlt="実行委員長挨拶"
          greetingTitle=""
          greetingBody={`皆様、本日は第45回 技大祭にご来場いただき、誠にありがとうございます。実行委員会を代表して、皆様を心より歓迎いたします。また、開催にあたり多大なるご支援をいただきました協賛団体の皆様、参加団体、大学関係者の方々、そして今日まで共に走り抜けてくれた350名を超える実行委員の仲間に、この場をお借りして深く感謝申し上げます。

今年のテーマは「Bluem Up Date」です。本学の先進性や近未来感を象徴する「Blue」と、新体制で新しいことに挑戦する「Up Date」など、様々な想いを込めました。私たち実行委員自身が祭づくりを全力で楽しみながら、常に新しい挑戦を続けていくという決意の表れでもあります。

その挑戦の象徴として、今年は新たな試みである「プロジェクションマッピング企画」をご用意いたしました。技大ならではの技術とアイデアが詰まった、近未来的な光の演出をぜひお楽しみください。さらに、お笑いゲストには「ヨネダ2000」さんをお迎えし、会場を大きな笑顔で包み込みます。

伝統を受け継ぎながらも、過去最高に「アップデート」された新しい技大祭の姿を、ぜひ全身で体感してください。皆様にとって、今日という日が最高に刺激的で、忘れられない一日となることを願い、実行委員長の挨拶とさせていただきます。どうぞ最後までお楽しみください.`}
        />
      </div>

      <div className="border-b-2 border-main pt-5l pb-m">
        <UniversitySection />
      </div>
    </div>
  );
}

export default function GreetingPageView() {
  return (
    <div>
      <div className="hidden md:flex">
        <GreetingPagePCView />
      </div>
      <div className="md:hidden">
        <GreetingPageMobileView />
      </div>
    </div>
  );
}
