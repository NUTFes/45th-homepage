import "./(frontend)/styles.css";
import type { Metadata } from "next";
import React from "react";

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

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <html lang="ja">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
