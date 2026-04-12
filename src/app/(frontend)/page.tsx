import type { Metadata } from "next";
import TopPageView from "@/modules/top/TopPageView";

export const metadata: Metadata = {
  title: "第45回技大祭",
  description: "第45回技大祭の公式ホームページです。最新情報やイベント情報をお届けします。",
};

export default function Page() {
  return <TopPageView />;
}
