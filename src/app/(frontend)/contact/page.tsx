import type { Metadata } from "next";
import ContactPageView from "@/modules/contact/ContactPageView";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "第45回技大祭実行委員会へのお問い合わせページです。",
  alternates: {
    canonical: "/contact",
  },
};

export default function Page() {
  return <ContactPageView />;
}
