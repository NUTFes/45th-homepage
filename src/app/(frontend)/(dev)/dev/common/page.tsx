import NavButton from "@/components/ui/NavButton";
import {
  CarouselDots,
  CarouselNextButton,
  CarouselPrevButton,
  CarouselRoot,
  CarouselSlide,
  CarouselViewport,
} from "@/components/ui/carousel";
import InfoFrame from "@/components/ui/InfoFrame";
import InfoBlock from "@/components/ui/InfoBlock";
import ImportantFrame from "@/components/ui/ImportantFrame";
import NewsItem from "@/components/ui/NewsItem";
import {
  Beer,
  BusFront,
  CameraOff,
  CandyOff,
  CigaretteOff,
  Clock,
  DoorOpen,
  Tickets,
  TriangleAlert,
  Users,
} from "lucide-react";

import { DevPageContainer } from "../_components/DevPageContainer";
import { DevPanel } from "../_components/DevPanel";
import { DevSection } from "../_components/DevSection";
import ButtonMain from "@/components/ui/ButtonMain";
import SectionTitle from "@/components/ui/SectionTitle";
import { sampleNewsItems } from "../_data/sampleNews";

const previewSlides = ["Slide 1", "Slide 2", "Slide 3"];
const noImportantNewsMessage = "現在、重要なお知らせはありません。";
const sampleImportantNewsBody =
  sampleNewsItems.find((item) => item.important)?.body ?? noImportantNewsMessage;

export default function DevCommonComponentsPage() {
  return (
    <DevPageContainer
      title="Common Components"
      description="共通UI（aria除く）の表示と基本動作確認"
    >
      <DevSection title="Common UI">
        <DevPanel title="NavButton">
          <NavButton />
        </DevPanel>

        <DevPanel title="Carousel">
          <CarouselRoot ariaLabel="Dev preview carousel" className="relative" loop={false}>
            <CarouselViewport className="overflow-hidden rounded-lg border border-base/20">
              {previewSlides.map((slideLabel, index) => (
                <CarouselSlide
                  key={slideLabel}
                  index={index}
                  className="min-w-full bg-secondary px-l py-4l text-center text-title-small text-base-dark"
                >
                  {slideLabel}
                </CarouselSlide>
              ))}
            </CarouselViewport>

            <div className="mt-s flex items-center justify-between">
              <CarouselPrevButton className="rounded-md border border-base/20 px-s py-xs text-text-small disabled:opacity-50" />
              <CarouselDots className="flex items-center gap-ss rounded-full bg-base/10 px-s py-xs" />
              <CarouselNextButton className="rounded-md border border-base/20 px-s py-xs text-text-small disabled:opacity-50" />
            </div>
          </CarouselRoot>
        </DevPanel>

        <DevPanel title="NewsItem">
          <div className="bg-base">
            <NewsItem
              date="2026.04.08"
              dateTime="2026-04-08"
              title="タイトル"
              content={"1行目のテキストです。\n2行目のテキストです。\n3行目のテキストです。"}
            />
          </div>
        </DevPanel>
        <DevPanel title="InfoFrame">
          <InfoFrame>
            本文本文テキストテキストテキスト笹かま笹かま笹かま笹かま笹かま笹かま笹かま笹かま笹かま笹カービィ
          </InfoFrame>
        </DevPanel>
        <DevPanel title="ImportantFrame">
          <ImportantFrame title="重要なお知らせ">{sampleImportantNewsBody}</ImportantFrame>
        </DevPanel>
        <DevPanel title="InfoBlock">
          <InfoFrame>
            <div className="flex flex-col gap-y-8">
              <InfoBlock icon={Clock} title="Clock">
                営業時間や受付時間に関する案内です。
              </InfoBlock>

              <InfoBlock icon={TriangleAlert} title="TriangleAlert">
                注意が必要な項目や重要なお知らせを示しています。
              </InfoBlock>

              <InfoBlock icon={Tickets} title="Tickets">
                チケットの購入・確認・入場に関する情報です。
              </InfoBlock>

              <InfoBlock icon={Users} title="Users">
                利用者や参加者に関する案内をまとめています。
              </InfoBlock>

              <InfoBlock icon={DoorOpen} title="DoorOpen">
                出入口や入退場に関するルールや案内です。
              </InfoBlock>

              <InfoBlock icon={CameraOff} title="CameraOff">
                撮影禁止エリアや撮影に関する注意事項です。
              </InfoBlock>

              <InfoBlock icon={CandyOff} title="CandyOff">
                飲食物の持ち込み制限や禁止事項についての案内です。
              </InfoBlock>

              <InfoBlock icon={CigaretteOff} title="CigaretteOff">
                喫煙禁止エリアや喫煙に関するルールです。
              </InfoBlock>

              <InfoBlock icon={Beer} title="Beer">
                アルコールの提供や飲酒に関する注意事項です。
              </InfoBlock>

              <InfoBlock icon={BusFront} title="BusFront">
                バスや交通アクセスに関する案内です。
              </InfoBlock>

              <InfoBlock title="HelpCircle">icon変数の記載がない場合にデフォルトで表示。</InfoBlock>
            </div>
          </InfoFrame>
        </DevPanel>

        <DevPanel title="ButtonMain">
          <div className="flex w-full justify-center pb-ss">
            <ButtonMain href={"/"} title={"タイトルを入力"} />
          </div>
        </DevPanel>

        <DevPanel title="SectionTitle">
          <div className="bg-base">
            <SectionTitle title="PICK UP" />
          </div>
        </DevPanel>
      </DevSection>
    </DevPageContainer>
  );
}
