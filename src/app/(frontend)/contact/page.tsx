import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import ContactPageView from "@/modules/contact/ContactPageView";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "第45回技大祭実行委員会へのお問い合わせページです。",
  alternates: {
    canonical: "/contact",
  },
};

async function ContactPageRuntime() {
  await connection();
  return <ContactPageView siteKey={process.env.TURNSTILE_SITE_KEY} />;
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ContactPageRuntime />
    </Suspense>
  );
}
