import ProgramDetailPageView from "@/modules/event/programs/[slug]/ProgramDetailPageView";
import type { ProgramDetailPageViewProps } from "@/modules/event/programs/[slug]/ProgramDetailPageView";

export const metadata = {
  title: "Preview: ProgramDetailPageView",
  description: "ProgramDetailPageView を全画面幅で確認する開発用プレビュー",
};

// PC版のレイアウト確認用実ページ用のpage.tsxに直接追加していい場合は移行
const dummyProps: ProgramDetailPageViewProps = {
  hero: {
    title: "企画名",
    imageSrc: "/favicon/45th-LogoBlue.svg",
    imageAlt: "企画名の画像",
  },
  intro: {
    title: "魅惑の鮭かまワールドへようこそ",
    body: "説明鮭かま鮭かま鮭かま鮭かま鮭かま鮭かま鮭かま鮭かま鮭かま鮭かま鮭かま鮭かま鮭かま",
  },
  info: {
    location: "キッチンカーエリア",
    title: "キッチンカーエリア",
  },
};

export default function ProgramDetailPreviewPage() {
  return (
    <div className="bg-base">
      <ProgramDetailPageView {...dummyProps} />
    </div>
  );
}
