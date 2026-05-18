import type { Metadata } from "next";
import { preload } from "react-dom";
import TopPageView from "@/modules/top/TopPageView";

export const metadata: Metadata = {
  title: "第45回技大祭",
  description:
    "2026年9月19・20日に開催する、長岡技術科学大学の大学祭「技大祭」の公式HPです!情報は随時更新予定なので、お楽しみに!",
};

export default function Page() {
  preload("/image/top/HeroAll-750.avif", {
    as: "image",
    fetchPriority: "high",
    imageSizes: "100vw",
    imageSrcSet: "/image/top/HeroAll-430.avif 430w, /image/top/HeroAll-750.avif 750w",
    type: "image/avif",
  });

  return <TopPageView />;
}
