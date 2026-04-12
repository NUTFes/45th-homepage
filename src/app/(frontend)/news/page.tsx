import type { Metadata } from "next";
import NewsPageView from "@/modules/news/NewsPageView";

export const metadata: Metadata = {
  title: "お知らせ | 第45回技大祭",
  description: "第45回技大祭のお知らせ一覧です。最新情報をお届けします。",
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default function NewsPage({ searchParams }: Props) {
  return <NewsPageView searchParams={searchParams} />;
}
