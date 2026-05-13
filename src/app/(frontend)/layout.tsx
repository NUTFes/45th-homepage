import React from "react";
import "./styles.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNavigation from "@/components/layout/BottomNav";

export const metadata = {
  description: "A blank template using Payload in a Next.js app.",
  title: "Payload Blank Template",
};

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <html lang="ja">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <BottomNavigation />
      </body>
    </html>
  );
}
