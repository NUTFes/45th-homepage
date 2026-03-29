import React from "react";
import InfoFrame from "@/components/ui/Frame/InfoFrame";
import { Button } from "../aria/Button";
import { LucideFile } from "lucide-react";
export default function SponsorSection() {
    return(
        <InfoFrame>
            <div className="flex items-center flex-col gap-y-3l">
                <div className="flex items-center flex-col gap-y-s">
                    <div className="flex items-center flex-col">
                        <div className="border-b border-white">
                            <div className=" text-center text-title w-fit font-kaisotai text-shadow-[1px_2px_2px_rgba(8,18,94,1.0)]">
                                企業協賛大募集！
                            </div>
                        </div>
                    </div>
                    <div className="px-ss">
                        技大祭実行委員会では、企業の皆さまからのご協賛を募集しております。
                        <br/>ご関心をお持ちの方は、以下の資料をご覧いただき、メールにてご連絡ください。
                    </div>
                    <div className="shadow-[1px_2px_2px_rgba(8,18,94,1.0)]">
                        <Button className="bg-white text-base-dark forced-colors:none rounded-1 py-s px-[28px] h-fit rounded-sm hover:bg-main">
                            <LucideFile className="base-dark" size={24}/>
                            <div className="text-title-small text-base-dark">資料を見る</div>
                        </Button>
                    </div>
                </div>
                <div className=" flex flex-col items-center gap-y-ss px-ss">
                    協賛のお問い合わせは、以下のメールアドレスからご連絡ください。
                    <div>nutfes_kyosan@googlegroups.com</div>
                </div>
            </div>
        </InfoFrame>
    );
}