"use client";

import ContactAccordionSection from "@/modules/contact/ui/ContactAccordionSection";

const INQUIRY_TYPE_OPTIONS = [
  "ステージ企画について",
  "展示・体験企画について",
  "食品企画について",
  "その他",
] as const;

export default function ContactAccordionSectionErrorPreview() {
  return (
    <div className="flex flex-col gap-l rounded-lg bg-base">
      <ContactAccordionSection
        label="お問い合わせ種別"
        required
        options={INQUIRY_TYPE_OPTIONS}
        value=""
        error="※選択してください"
      />

      <ContactAccordionSection
        label="お問い合わせ種別"
        required
        options={INQUIRY_TYPE_OPTIONS}
        value="ステージ企画について"
      />
    </div>
  );
}
