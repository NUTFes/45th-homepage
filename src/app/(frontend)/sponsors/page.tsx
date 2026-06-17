import type { Metadata } from "next";

import SponsorPageView from "@/modules/sponsors/SponsorPageView";

export const metadata: Metadata = {
  title: "協賛企業一覧 | 第45回技大祭",
  description: "第45回技大祭にご協賛いただいた企業様の一覧です。",
};

export default function Page() {
  return <SponsorPageView />;
}
