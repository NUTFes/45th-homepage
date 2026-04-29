import { Mail, MessageCircleMore } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-secondary px-m py-m text-black">
      {/* スマホレイアウト */}
      <div className="lg:hidden mx-auto flex w-full max-w-98.25 flex-col items-center gap-ll">
        <section aria-label="SNS" className="flex flex-col items-center gap-xs">
          <h2 className="font-kaisotai text-title leading-none">FOLLOW US</h2>
          <Image
            alt="Instagram"
            className="size-10"
            height={40}
            src="/icon/Instagram.png"
            width={40}
          />
        </section>

        <section className="flex w-full max-w-68 flex-col gap-xs text-text">
          <div className="flex flex-col gap-xs">
            <p>アンケート</p>
            <p>大学ホームページ</p>
          </div>

          <div className="flex flex-col gap-ss">
            <h3 className="text-text">お問い合わせ</h3>
            <address className="pl-xs text-[14px] leading-4.25 not-italic">
              <p>〒940-2188</p>
              <p>新潟県長岡市上富岡町1603-1</p>
              <p>長岡技術科学大学</p>
            </address>
            <div className="flex flex-col gap-1 pl-xs text-[14px] leading-4.25">
              <p className="flex items-center gap-1.5">
                <MessageCircleMore
                  className="size-4"
                  fill="var(--color-base-dark)"
                  stroke="#ffffff"
                  strokeWidth={2.2}
                />
                <span>インスタDM</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Mail className="size-4 text-base-dark" strokeWidth={2.2} />
                <span className="underline">nutfes.shikobu@gmail.com</span>
              </p>
            </div>
          </div>
        </section>

        <p className="text-center text-text">技大祭実行委員会</p>
      </div>
        {/* PCレイアウト */}
          <div className="hidden lg:flex items-center justify-between px-2l py-3l">
            <div className="flex gap-x-4l items-center">
              <div className="flex flex-col gap-x-ss">
              <div className="flex gap-x-s items-center">
                <Link href="/">
                  <Image src="/icon/45th-logo-top.svg" alt="45thNUTFES ロゴ" width={48} height={48} />
                </Link>
                <div className="font-kaisotai text-title text-base-dark">45th NUTFES</div>
              </div>
              <p className="text-[14px] ">長岡技術科学大学　技大祭実行委員会</p>
              
              </div>
              <div className="flex gap-ll text-button">
                <p>アンケート</p>
                <p>大学ホームページ</p>
                <p>お問い合わせ</p>
              </div>
              <div className="flex gap-x-l py-xs items-top">
                <Image
                  alt="Instagram"
                  className="size-10"
                  height={40}
                  src="/icon/Instagram.png"
                  width={40}
                />
                <div className="flex flex-col gap-1 pl-xs text-[14px] leading-4.25 gap-y-ss">
                  <p className="flex items-center gap-1.5">
                    <MessageCircleMore
                      className="size-4"
                      fill="var(--color-base-dark)"
                      stroke="#ffffff"
                      strokeWidth={2.2}
                    />
                    <span>インスタDM</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Mail className="size-4 text-base-dark" strokeWidth={2.2} />
                    <span className="underline">nutfes.shikobu@gmail.com</span>
                  </p>
                  <address className="text-[14px] leading-4.25 not-italic">
                    <p>〒940-2188</p>
                    <p>新潟県長岡市上富岡町1603-1
                    長岡技術科学大学</p>
                  </address>
              </div>
            </div>

            </div>
      </div>
    </footer>
  );
}
