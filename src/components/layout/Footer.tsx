import { Mail, MessageCircleMore } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const CONTACT_EMAIL_PARTS = ["nutfes.shikobu", "gmail.com"] as const;
const SNS_LINKS = [
  {
    label: "X",
    href: "https://x.com/nut_fes",
    icon: "/icon/X.svg",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/nutfes?igsh=eTJ4cGh0MDVvYmky",
    icon: "/icon/Instagram.png",
  },
  {
    label: "YouTube",
    href: "https://youtube.com/channel/UCxpfPMcf4LCWSL1dR8ha5uQ?si=DGby9RdPrTj4b4c3",
    icon: "/icon/YouTube.svg",
  },
  {
    label: "TikTok",
    href: "http://www.tiktok.com/@nutfes_sns",
    icon: "/icon/TikTok.svg",
  },
] as const;

function ContactEmailText() {
  return (
    <>
      <span>{CONTACT_EMAIL_PARTS[0]}</span>
      <span>@</span>
      <span>{CONTACT_EMAIL_PARTS[1]}</span>
    </>
  );
}

function SnsIconLinks({ className }: { className?: string }) {
  return (
    <ul className={`flex items-center gap-l ${className ?? ""}`}>
      {SNS_LINKS.map((sns) => (
        <li key={sns.label} className="flex">
          <Link
            href={sns.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${sns.label}で技大祭実行委員会をフォローする`}
            className="flex size-10 shrink-0 items-center justify-center transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-main"
          >
            <Image
              alt=""
              className="size-10 shrink-0 object-contain"
              height={40}
              src={sns.icon}
              width={40}
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Footer() {
  return (
    <footer className="bg-secondary px-m py-m text-black lg:px-5l lg:py-3l">
      {/* スマホレイアウト */}
      <div className="mx-auto flex w-full max-w-98.25 flex-col items-center gap-ll lg:hidden">
        <section aria-label="SNS" className="flex flex-col items-center gap-s">
          <h2 className="font-kaisotai text-title leading-none">FOLLOW US</h2>
          <SnsIconLinks />
        </section>

        <section className="flex w-full max-w-68 flex-col gap-xs text-textb">
          <div className="flex flex-col gap-xs">
            <p className="text-black">アンケート</p>
            <a
              href="https://www.nagaokaut.ac.jp/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              大学ホームページ
            </a>
          </div>

          <div className="flex flex-col gap-ss">
            <h3 className="text-black">お問い合わせ</h3>
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
                <a
                  href="https://www.instagram.com/nutfes?igsh=eTJ4cGh0MDVvYmky"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  インスタDM
                </a>
              </p>
              <p className="flex items-center gap-1.5">
                <Mail className="size-4 text-base-dark" strokeWidth={2.2} />
                <span className="underline">
                  <ContactEmailText />
                </span>
              </p>
            </div>
          </div>
        </section>

        <p className="text-center text-textb">技大祭実行委員会</p>
      </div>
      {/* PCレイアウト */}
      <div className="w-full">
        <div className="hidden items-center justify-between lg:flex">
          <div className="items-top flex w-full justify-between gap-x-4l">
            <div className="flex gap-x-ss">
              <div className="flex flex-col gap-y-ss">
                <div className="flex min-w-62.5 items-center gap-x-s">
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
              <div className="flex h-13.5 w-full min-w-105 items-center gap-ll pt-1 text-Pbutton">
                <div className="text-black">アンケート</div>
                <a
                  href="https://www.nagaokaut.ac.jp/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  大学ホームページ
                </a>
                <div className="text-black">お問い合わせ</div>
              </div>
            </div>
            <div className="items-top flex">
              <div className="flex flex-col pl-xs text-textb leading-4.25">
                <p className="flex items-center gap-1.5">
                  <MessageCircleMore
                    className="size-4"
                    stroke="var(--color-base-dark)"
                    strokeWidth={2.2}
                  />
                  <a
                    href="https://www.instagram.com/nutfes?igsh=eTJ4cGh0MDVvYmky"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    インスタDM
                  </a>
                </p>
                <p className="flex items-center gap-1.5 pt-1">
                  <Mail className="size-4 text-base-dark" strokeWidth={2.2} />
                  <span className="underline">
                    <ContactEmailText />
                  </span>
                </p>
                <address className="pt-ss text-[14px] leading-4.25 not-italic">
                  <p>〒940-2188</p>
                  <p>新潟県長岡市上富岡町1603-1 長岡技術科学大学</p>
                </address>
                <SnsIconLinks className="mt-m" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
