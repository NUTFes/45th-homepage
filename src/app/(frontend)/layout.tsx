import React from "react";
import type { Metadata } from "next";
import { Zen_Kaku_Gothic_New } from "next/font/google";
import localFont from "next/font/local";

import "./styles.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNavigation from "@/components/layout/BottomNav";

const kaisotai = localFont({
  src: "../../../public/font/Kaisotai-Next-UP-B.subset.woff2",
  variable: "--font-kaisotai-next",
  display: "optional",
  preload: false,
});

const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-zen-kaku-gothic-new",
  display: "optional",
  preload: false,
  adjustFontFallback: false,
  fallback: [
    "Hiragino Sans",
    "Hiragino Kaku Gothic ProN",
    "BIZ UDPGothic",
    "Yu Gothic",
    "Meiryo",
    "system-ui",
    "sans-serif",
  ],
});

const siteName = "45th NUTFES";
const siteDescription =
  "2026年9月19日・20日に開催する、長岡技術科学大学の大学祭「技大祭」の公式サイトです。情報は随時更新予定なので、お楽しみに!";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.nutfes.net/";

if (process.env.NODE_ENV === "production" && !siteUrl) {
  throw new Error("NEXT_PUBLIC_SITE_URL is required in production");
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteName,
    description: siteDescription,
    url: "/",
    siteName,
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
  },
  icons: [
    {
      rel: "icon",
      url: "/favicon/45th-LogoBlue.svg",
      media: "(prefers-color-scheme: light)",
    },
    {
      rel: "icon",
      url: "/favicon/45th-LogoLightBlue.svg",
      media: "(prefers-color-scheme: dark)",
    },
  ],
};

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <html lang="ja" className={`${zenKakuGothicNew.variable} ${kaisotai.variable}`}>
      <body className="pb-(--bottom-nav-offset) md:pb-0">
        <Header />
        <main>{children}</main>
        <Footer />
        <BottomNavigation />
        <script
          dangerouslySetInnerHTML={{
            __html: `"use strict";(function(){var d=5e3;function l(){var s=document.createElement("script");s.src="/analytics/script.js";s.defer=true;s.dataset.siteId="156a8f7e9cfd";document.body.appendChild(s)}if(typeof requestIdleCallback==="function"){setTimeout(function(){requestIdleCallback(l)},d)}else{setTimeout(l,d)}})();`,
          }}
        />
      </body>
    </html>
  );
}
