import { Mail, MessageCircleMore } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-secondary px-m py-m text-black">
      {/* スマホレイアウト */}
      <div className="mx-auto flex w-full max-w-98.25 flex-col items-center gap-ll lg:hidden">
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
      <div className="w-full px-5l">
        <div className="px-2l hidden items-center justify-between py-3l lg:flex">
          <div className="items-top flex w-full justify-between gap-x-4l py-xs">
            <div className="flex gap-x-ss">
              <div className="flex flex-col gap-y-ss">
                <div className="flex min-w-[250px] items-center gap-x-s">
                  <Link href="/">
                    <Image
                      src="/icon/45th-logo-top.svg"
                      alt="45thNUTFES ロゴ"
                      width={48}
                      height={48}
                    />
                  </Link>
                  <div className="font-kaisotai text-title text-[40px] text-base-dark">
                    45th NUTFES
                  </div>
                </div>
                <p className="text-[14px]">長岡技術科学大学　技大祭実行委員会</p>
              </div>
              <div className="flex h-[48px] w-full min-w-[400px] items-center gap-ll pt-[4px] text-Pbutton">
                <div>アンケート</div>
                <div>大学ホームページ</div>
                <div>お問い合わせ</div>
              </div>
            </div>
            <div className="items-top flex gap-x-l py-xs">
              <Image
                alt="Instagram"
                className="size-10"
                height={40}
                src="/icon/Instagram.png"
                width={40}
              />
              <div className="flex flex-col gap-1 gap-y-ss pl-xs text-text leading-4.25">
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
                  <p>新潟県長岡市上富岡町1603-1 長岡技術科学大学</p>
                </address>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
