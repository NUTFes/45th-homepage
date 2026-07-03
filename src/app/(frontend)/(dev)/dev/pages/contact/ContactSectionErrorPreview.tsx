"use client";

import ContactSection from "@/modules/contact/ui/ContactSection";

export default function ContactSectionErrorPreview() {
  return (
    <div className="flex flex-col gap-l rounded-lg bg-base">
      <ContactSection
        label="メールアドレス"
        required
        placeholder="taro@example.ac.jp"
        type="text"
        inputMode="email"
        autoComplete="email"
        value="nutfes@"
        error="※メールアドレスの形式が正しくありません"
      />

      <ContactSection
        label="お名前"
        required
        placeholder="技大　太郎"
        autoComplete="name"
        value=""
        error="※必須項目です。入力してください"
      />

      <ContactSection
        label="お問い合わせ内容"
        required
        type="textarea"
        placeholder="ご自由にご記入ください"
        rows={8}
        value=""
        error="※必須項目です。入力してください"
      />
    </div>
  );
}
