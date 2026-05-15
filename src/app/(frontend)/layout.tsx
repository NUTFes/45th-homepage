import React from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./styles.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNavigation from "@/components/layout/BottomNav";

const kaisotai = localFont({
  src: "../../../public/font/Kaisotai-Next-UP-B.subset.woff2",
  variable: "--font-kaisotai-next",
  display: "optional",
});

export const metadata: Metadata = {
  title: "45th NUTFES",
  description:
    "2026年9月19・20日に開催する、長岡技術科学大学の大学祭「技大祭」の公式HPです!\n情報は随時更新予定なので、お楽しみに!",
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

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <html lang="ja" className={kaisotai.variable}>
      <body className="pb-(--bottom-nav-offset) md:pb-0">
        <Header />
        <main>{children}</main>
        <Footer />
        <BottomNavigation />
      </body>
    </html>
  );
}
