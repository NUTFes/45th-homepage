import NavButton from "@/components/ui/NavButton";
import {
  CarouselDots,
  CarouselNextButton,
  CarouselPrevButton,
  CarouselRoot,
  CarouselSlide,
  CarouselViewport,
} from "@/components/ui/carousel";
import InfoFrame from "@/components/ui/Frame/InfoFrame";
import InfoBlock from "@/components/ui/Frame/InfoBlock";

import { DevPageContainer } from "../_components/DevPageContainer";
import { DevPanel } from "../_components/DevPanel";
import { DevSection } from "../_components/DevSection";

const previewSlides = ["Slide 1", "Slide 2", "Slide 3"];

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

        <DevPanel title="InfoFrame">
          <InfoFrame>本文本文テキストテキストテキスト笹かま笹かま笹かま笹かま笹かま笹かま笹かま笹かま笹かま笹カービィ</InfoFrame>
        </DevPanel>
        <DevPanel title="InfoBlock">
          <InfoFrame>
            <InfoBlock Icon="Apple" title="タイトル">
              本文本文テキストテキストテキスト笹かま笹かま笹かま笹かま笹かま笹かま笹かま笹かま笹かま笹カービィ
            </InfoBlock>
          </InfoFrame>
        </DevPanel>
      </DevSection>
    </DevPageContainer>
  );
}
