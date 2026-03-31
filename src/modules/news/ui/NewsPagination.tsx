"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface NewsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function NewsPagination({
  currentPage,
  totalPages,
  onPageChange,
}: NewsPaginationProps) {
  if (totalPages <= 1) return null;

  const windowStart = Math.max(1, Math.min(currentPage - 1, totalPages - 2));
  const pages = Array.from({ length: Math.min(3, totalPages) }, (_, i) => windowStart + i);

  const showPrev = currentPage > 1;
  const showNext = currentPage < totalPages;

  return (
    <nav className="flex justify-center" aria-label="お知らせ一覧のページネーション">
      <div className="flex items-center gap-ss">
        <button
          type="button"
          className={`flex size-[20px] items-center justify-center hover:scale-110 active:scale-95 motion-safe:transition-transform ${
            !showPrev ? "invisible" : ""
          }`}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="前のページ"
          tabIndex={showPrev ? 0 : -1}
        >
          <ChevronLeft className="text-main" strokeWidth={2.5} />
        </button>

        <div className="flex items-center gap-s">
          {pages.map((page) => (
            <button
              key={page}
              type="button"
              className={`flex size-11 items-center justify-center text-title-small font-bold hover:scale-105 active:scale-95 motion-safe:transition-all ${
                page === currentPage
                  ? "bg-main text-base-dark"
                  : "border-[1.6px] border-main text-main hover:bg-main/10"
              }`}
              onClick={() => onPageChange(page)}
              aria-label={`${page}ページ目`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          type="button"
          className={`flex size-5 items-center justify-center hover:scale-110 active:scale-95 motion-safe:transition-transform ${
            !showNext ? "invisible" : ""
          }`}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="次のページ"
          tabIndex={showNext ? 0 : -1}
        >
          <ChevronRight className="text-main" strokeWidth={2.5} />
        </button>
      </div>
    </nav>
  );
}
