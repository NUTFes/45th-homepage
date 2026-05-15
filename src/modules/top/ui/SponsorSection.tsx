import InfoFrame from "@/components/ui/InfoFrame";
import { LucideFile } from "lucide-react";
import SponsorCopyButton from "./SponsorCopyButton";

const SPONSOR_EMAIL = "nutfes_kyosan@googlegroups.com";

export default function SponsorSection() {
  return (
    <InfoFrame>
      <div className="flex flex-col items-center gap-y-3l md:text-center">
        <div className="flex flex-col items-center gap-y-s md:gap-y-m">
          <div className="flex flex-col items-center">
            <div className="border-b border-white">
              <div className="w-fit pb-1 text-center font-kaisotai text-title text-shadow-[1px_2px_2px_rgba(8,18,94,1.0)] md:text-Ptitle">
                企業協賛大募集！
              </div>
            </div>
          </div>

          <div className="px-ss text-text md:text-center md:text-Ptext">
            技大祭実行委員会では、企業の皆さまからのご協賛を募集しております。
            <br />
            ご関心をお持ちの方は、以下の資料をご覧いただき、メールにてご連絡ください。
          </div>

          <div className="shadow-[1px_2px_2px_rgba(8,18,94,1.0)]">
            <a
              href="https://kyosan.nutfes.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex h-fit w-[225px] cursor-default items-center justify-start gap-x-s rounded-sm border border-transparent bg-white px-m py-m text-center font-sans text-base-dark transition [-webkit-tap-highlight-color:transparent] hover:bg-main md:w-[300px] md:rounded-md md:px-m md:py-m"
            >
              <div className="shrink-0">
                <LucideFile size={24} />
              </div>
              <span className="flex-1 text-center text-text-large md:text-Ptext-large">
                資料を見る
              </span>
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center gap-y-s md:gap-y-m">
          <div className="px-ss text-text md:text-center md:text-Ptext">
            協賛のお問い合わせは、以下のメールアドレスからご連絡ください。
          </div>

          <div className="shadow-[1px_2px_2px_rgba(8,18,94,1.0)]">
            <SponsorCopyButton
              className="inline-flex h-fit w-[225px] items-center justify-start gap-x-s rounded-sm bg-white px-m py-s text-base-dark hover:bg-main md:w-[300px] md:rounded-md md:px-m md:py-m"
              email={SPONSOR_EMAIL}
            />
          </div>
        </div>
      </div>
    </InfoFrame>
  );
}
