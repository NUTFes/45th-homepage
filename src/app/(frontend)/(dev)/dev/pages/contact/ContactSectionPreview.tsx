"use client";

import { useState } from "react";
import ContactSection from "@/modules/contact/ui/ContactSection";

export default function ContactSectionPreview() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [inquiry, setInquiry] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <div className="flex flex-col gap-l rounded-lg bg-base">
      <ContactSection
        label="お名前"
        required
        placeholder="技大　太郎"
        autoComplete="name"
        value={name}
        onChange={setName}
      />

      <ContactSection
        label="お住まいの地域"
        placeholder="例）新潟県長岡市"
        autoComplete="off"
        value={address}
        onChange={setAddress}
      />

      <ContactSection
        label="お問い合わせ内容"
        required
        type="textarea"
        placeholder="ご自由にご記入ください"
        rows={8}
        value={inquiry}
        onChange={setInquiry}
      />

      <ContactSection
        label="備考"
        type="textarea"
        placeholder="任意"
        rows={4}
        value={notes}
        onChange={setNotes}
      />
    </div>
  );
}
