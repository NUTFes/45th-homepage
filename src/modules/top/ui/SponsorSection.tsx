"use client";

import InfoFrame from "@/components/ui/InfoFrame";
import { Button } from "../../../components/aria/Button";
import { Copy, LucideFile } from "lucide-react";

const SPONSOR_EMAIL = "nutfes_kyosan@googlegroups.com";

export default function SponsorSection() {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SPONSOR_EMAIL);
      alert("企業協賛募集メールアドレスをコピーしました");
    } catch (err) {
      console.error("メールアドレスのコピーに失敗しました", err);
    }
  };

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
            <Button className="h-fit w-[225px] justify-start gap-x-s rounded-sm bg-white px-m py-m text-base-dark hover:bg-main md:w-[300px] md:rounded-md md:px-m md:py-m">
              <div className="shrink-0">
                <LucideFile size={24} />
              </div>
              <a href="https://kyosan.nutfes.net/" target="_blank" className="flex-1 text-start text-text-large md:text-center md:text-Ptext-large">
                資料を見る
              </a>
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-y-s md:gap-y-m">
          <div className="px-ss text-text md:text-center md:text-Ptext">
            協賛のお問い合わせは、以下のメールアドレスからご連絡ください。
          </div>

          <div className="shadow-[1px_2px_2px_rgba(8,18,94,1.0)]">
            <Button
              onPress={handleCopy}
              className="h-fit w-[225px] justify-start gap-x-s rounded-sm bg-white px-m py-s text-base-dark hover:bg-main md:w-[300px] md:rounded-md md:px-m md:py-m"
            >
              <div className="shrink-0">
                <Copy size={24} />
              </div>
              <div className="flex-1 text-start text-text-large md:text-Ptext-large md:whitespace-nowrap">
                <span className="whitespace-nowrap">メールアドレスを</span>
                <br className="md:hidden" />
                <span>コピー</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </InfoFrame>
  );
}
