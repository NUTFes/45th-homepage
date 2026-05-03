"use client";

import InfoFrame from "@/components/ui/InfoFrame";
import { Button } from "../../../components/aria/Button";
import { Copy, LucideFile } from "lucide-react";

const SPONSOR_EMAIL = "nutfes_kyosan@googlegroups.com";

export default function PcSponsorSection() {
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
      <div className="flex flex-col items-center gap-y-3l text-center text-Ptext">
        <div className="flex flex-col items-center gap-y-m">
          <div className="flex flex-col items-center">
            <div className="border-b border-white">
              <div className="w-fit pb-1 font-kaisotai text-Ptitle text-shadow-[1px_2px_2px_rgba(8,18,94,1.0)]">
                企業協賛大募集！
              </div>
            </div>
          </div>

          <div>
            技大祭実行委員会では、企業の皆さまからのご協賛を募集しております。
            <br />
            ご関心をお持ちの方は、以下の資料をご覧いただき、メールにてご連絡ください。
          </div>

          <div className="shadow-[1px_2px_2px_rgba(8,18,94,1.0)]">
            <Button className="forced-colors:none h-fit gap-x-m rounded-md bg-white px-4l py-m text-base-dark hover:bg-main">
              <LucideFile size={24} />
              <div className="text-Pbutton">資料を見る</div>
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-y-m">
          <div>
            協賛のお問い合わせは、以下のメールアドレスからご連絡ください。
          </div>

          <div className="shadow-[1px_2px_2px_rgba(8,18,94,1.0)]">
            <Button
              onPress={handleCopy}
              className="forced-colors:none h-fit gap-x-m rounded-md bg-white px-4l py-s text-base-dark hover:bg-main"
            >
              <Copy size={24} />
              <div className="text-center text-Pbutton">
                メールアドレスをコピー
              </div>
            </Button>
          </div>
        </div>
      </div>
    </InfoFrame>
  );
}
