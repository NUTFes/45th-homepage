import type { Metadata } from "next";

import GuestPageView from "@/modules/event/guest/GuestPageView";

export const metadata: Metadata = {
  title: "ゲスト",
  description:
    "第45回技大祭のゲストは、お笑いコンビのヨネダ2000です。9月20日(日)13:00~14:00に体育館で開催します。",
  alternates: {
    canonical: "/event/guest",
  },
};

export default function Page() {
  return <GuestPageView />;
}
