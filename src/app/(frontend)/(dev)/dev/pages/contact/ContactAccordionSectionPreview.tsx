"use client";

import { useState } from "react";
import ContactAccordionSection from "@/modules/contact/ui/ContactAccordionSection";

const INQUIRY_TYPE_OPTIONS = [
  "ステージ企画について",
  "展示・体験企画について",
  "食品企画について",
  "その他",
] as const;

const GRADE_OPTIONS = ["B1", "B2", "B3", "B4", "M1", "M2"] as const;

export default function ContactAccordionSectionPreview() {
  const [inquiryType, setInquiryType] = useState("");
  const [grade, setGrade] = useState("");

  return (
    <div className="flex flex-col gap-l rounded-lg bg-base">
      <ContactAccordionSection
        label="お問い合わせ種別"
        required
        options={INQUIRY_TYPE_OPTIONS}
        value={inquiryType}
        onChange={setInquiryType}
      />

      <ContactAccordionSection
        label="学年"
        options={GRADE_OPTIONS}
        value={grade}
        onChange={setGrade}
        placeholder="学年を選択"
      />
    </div>
  );
}
