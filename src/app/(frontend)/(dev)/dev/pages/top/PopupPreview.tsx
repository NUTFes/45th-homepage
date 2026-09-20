"use client";

import { useState } from "react";

import Popup from "@/modules/top/ui/Popup";
import { SURVEY_HREF } from "@/modules/top/ui/TopPopup";

export function PopupPreview() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="mx-auto w-full max-w-110 px-m">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          className="rounded-lg bg-base px-l py-xs text-button text-font-main transition-colors hover:bg-base-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-main"
        >
          プレビューを開く
        </button>
      </div>
      <Popup isOpen={isOpen} onOpenChange={setIsOpen} surveyHref={SURVEY_HREF} />
    </>
  );
}
