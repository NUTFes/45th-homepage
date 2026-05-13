import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNavigation from "@/components/layout/BottomNav";

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <BottomNavigation />
    </>
  );
}
