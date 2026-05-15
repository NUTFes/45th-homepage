import type { Metadata } from "next";
import NotFoundView from "@/modules/notfound/NotFoundView";
import "./(frontend)/styles.css";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "お探しのページは見つかりませんでした",
};

export default function GlobalNotFound() {
  return (
    <html lang="ja">
      <body>
        <NotFoundView />
      </body>
    </html>
  );
}
