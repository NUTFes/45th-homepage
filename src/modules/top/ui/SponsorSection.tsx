"use client";

import InfoFrame from "@/components/ui/InfoFrame";
import { Button } from "../../../components/aria/Button";
import { Copy, LucideFile } from "lucide-react";

const SPONSOR_EMAIL = "sponsor@example.com";

export default function SponsorSection() {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SPONSOR_EMAIL);
      alert("技大祭企業協賛募集メールアドレスをコピーしました");
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  };

  return (
    <InfoFrame>
      <div className="flex flex-col items-center gap-y-3l">
        <div className="flex flex-col items-center gap-y-s">
          <div className="flex flex-col items-center">
            <div className="border-b border-white">
              <div className="w-fit pb-1 text-center font-kaisotai text-title text-shadow-[1px_2px_2px_rgba(8,18,94,1.0)]">
                企業協賛大募集！
              </div>
            </div>
          </div>

          <div className="px-ss">
            技大祭実行委員会では、企業の皆さまからのご協賛を募集しております。
            <br />
            ご関心をお持ちの方は、以下の資料をご覧いただき、メールにてご連絡ください。
          </div>

          <div className="shadow-[1px_2px_2px_rgba(8,18,94,1.0)]">
            <Button className="forced-colors:none rounded-1 h-fit gap-x-s rounded-sm bg-white px-m py-m text-base-dark hover:bg-main">
              <LucideFile size={24} />
              <div className="text-title-small px-l">資料を見る</div>
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-y-s">
          <div className="px-ss">
            協賛のお問い合わせは、以下のメールアドレスからご連絡ください。
          </div>

          <div className="shadow-[1px_2px_2px_rgba(8,18,94,1.0)]">
            <Button
              onPress={handleCopy}
              className="forced-colors:none rounded-1 h-fit gap-x-s rounded-sm bg-white px-m py-s text-base-dark hover:bg-main"
            >
              <Copy size={24} />
              <div className="text-title-small text-start">
                メールアドレスを<br />
                コピー
              </div>
            </Button>
          </div>
        </div>
      </div>
    </InfoFrame>
  );
}