import "./(frontend)/styles.css";
import React from "react";

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;

  return <>{children}</>;
}
