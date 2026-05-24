import { Ban, CigaretteOff, Beer, Bus } from "lucide-react";
import Image from "next/image";
import InfoBlock from "@/components/ui/InfoBlock";
import InfoFrame from "@/components/ui/InfoFrame";
import SectionTitle from "@/components/ui/SectionTitle";
import ButtonMain from "@/components/ui/ButtonMain";

export default function AttentionPageView() {
  return (
    <div className="relative flex min-h-screen flex-col items-center bg-base">
      <Image
        src="/image/PageBack2.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 z-0 hidden md:block"
        width={200}
        height={200}
      />
      <div className="relative z-20 flex w-full flex-col">
        <div className="relative mx-auto flex w-full flex-col gap-4l py-4l md:pt-5l">
          <Image
            src="/image/PageBack1.svg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute top-0 right-0 z-0 hidden md:block"
            width={200}
            height={200}
          />

          <div className="relative z-10 flex flex-col gap-s md:gap-4l md:px-pl">
            <SectionTitle title="技大祭を楽しむために" />

            <div className="mx-auto w-full max-w-200 px-ll">
              <InfoFrame className="w-full">
                <div className="flex flex-col gap-l">
                  <InfoBlock title="屋内での食事禁止" icon={Ban}>
                    <span className="text-textb text-accent">
                      講義棟内など大学構内の屋内では食事禁止です。
                    </span>
                    水分補給に制限はありませんのでご自由にお取りください。屋外では飲食に関する制限はございません。
                    <br />
                    設営されている休憩所をご活用ください。
                  </InfoBlock>

                  <InfoBlock title="大学構内は全面禁煙" icon={CigaretteOff}>
                    <span className="text-textb text-accent">大学構内は全面禁煙です。</span>
                    ご協力をお願いいたします。
                  </InfoBlock>

                  <InfoBlock title="アルコールについて" icon={Beer}>
                    <span className="text-textb text-accent">
                      飲酒を希望される方はリストバンドの着用が必要です。
                    </span>
                    リストバンドは案内所にて年齢確認および運転者でないことを確認した後にお渡しします。
                    <br />
                    また、アルコールをお飲みになる際は、歩き飲みを避け、必ず休憩所をご利用ください。20歳未満の方の飲酒は「未成年者飲酒禁止法」により禁止されています。
                  </InfoBlock>

                  <InfoBlock title="公共交通機関の利用" icon={Bus}>
                    <span className="text-textb">駐車場の台数には限りがございます。</span>
                    当日は大変混雑が予想されますので、可能な限り公共交通機関をご利用ください。
                    <br />
                    また近隣住民の皆様にご迷惑をおかけするおそれがありますので、
                    <span className="text-textb text-accent">路上駐車はご遠慮ください。</span>
                    <br />
                    ご協力をお願いいたします。
                  </InfoBlock>
                </div>
              </InfoFrame>
            </div>
          </div>

          <div className="relative z-10 flex flex-col gap-s md:gap-4l md:px-pl">
            <SectionTitle title="お困りの際は" />
            <div className="mx-auto w-full max-w-200 px-ll">
              <div className="flex flex-col gap-m text-text text-white">
                <p>
                  体調不良や落とし物など、お困りの際は案内所へお立ち寄りいただくか、技大祭Tシャツを着用したスタッフまでお声がけください。
                </p>
                <p>
                  また、
                  <span className="text-textb">
                    技大祭のパンフレットを案内所にて配布しております。
                  </span>
                  一部イベントではパンフレットが必要となりますので、忘れずにお受け取りください。
                </p>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center">
            <ButtonMain href="/help" title="案内所・ヘルプページはこちら ＞" />
          </div>
        </div>
      </div>
    </div>
  );
}
