import type { Metadata } from "next";
import AttentionPageView from "@/modules/attention/AttentionPageView";

export const metadata: Metadata = {
  title: "注意事項 | 第45回技大祭",
  description: "第45回技大祭にご来場いただく皆様への注意事項です。",
};

export default function Page() {
  return <AttentionPageView />;
}
