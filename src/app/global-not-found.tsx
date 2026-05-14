import type { Metadata } from "next";
import { Goldman, Zen_Kaku_Gothic_New } from "next/font/google";
import localFont from "next/font/local";
import NotFoundView from "@/modules/notfound/NotFoundView";
import "./(frontend)/styles.css";

const goldman = Goldman({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-goldman-src",
  display: "swap",
});

const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-sans-src",
  display: "swap",
});

const kaisotai = localFont({
  src: "../../public/font/Kaisotai-Next-UP-B.subset.woff2",
  variable: "--font-kaisotai",
  display: "swap",
});

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "お探しのページは見つかりませんでした",
};

export default function GlobalNotFound() {
  return (
    <html lang="ja">
      <body className={`${goldman.variable} ${zenKakuGothicNew.variable} ${kaisotai.variable}`}>
        <NotFoundView />
      </body>
    </html>
  );
}
