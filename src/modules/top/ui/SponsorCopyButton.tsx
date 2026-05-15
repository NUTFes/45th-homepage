"use client";

import { Copy } from "lucide-react";

type SponsorCopyButtonProps = {
  email: string;
  className?: string;
};

export default function SponsorCopyButton({ email, className }: SponsorCopyButtonProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      alert("企業協賛募集メールアドレスをコピーしました");
    } catch (err) {
      console.error("メールアドレスのコピーに失敗しました", err);
    }
  };

  return (
    <button
      type="button"
      onClick={() => {
        void handleCopy();
      }}
      className={className}
    >
      <div className="shrink-0">
        <Copy size={24} />
      </div>
      <div className="flex-1 text-center text-text-large md:text-Ptext-large md:whitespace-nowrap">
        <span className="whitespace-nowrap">メールアドレスを</span>
        <br className="md:hidden" />
        <span>コピー</span>
      </div>
    </button>
  );
}
