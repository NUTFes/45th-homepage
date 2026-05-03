import "./(frontend)/styles.css";
import React from "react";

export const metadata = {
  description: "45th NUTFES website",
  title: "45th NUTFES",
};

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <html lang="ja">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
