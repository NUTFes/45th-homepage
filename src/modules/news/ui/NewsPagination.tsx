import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NewsPaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export default function NewsPagination({
  currentPage,
  totalPages,
  basePath = "/news",
}: NewsPaginationProps) {
  if (totalPages <= 1) return <div className="min-h-11" aria-hidden="true" />;

  const windowStart = Math.max(1, Math.min(currentPage - 1, totalPages - 2));
  const pages = Array.from({ length: Math.min(3, totalPages) }, (_, i) => windowStart + i);

  const showPrev = currentPage > 1;
  const showNext = currentPage < totalPages;

  return (
    <nav className="flex justify-center" aria-label="お知らせ一覧のページネーション">
      <div className="flex items-center gap-ss">
        {showPrev ? (
          <Link
            href={`${basePath}?page=${currentPage - 1}`}
            className="flex size-5 items-center justify-center hover:scale-110 active:scale-95 motion-safe:transition-transform"
            aria-label="前のページ"
          >
            <ChevronLeft className="text-main" strokeWidth={2.5} />
          </Link>
        ) : (
          <div className="invisible size-5" aria-hidden="true" />
        )}

        <div className="flex items-center gap-s">
          {pages.map((page) => (
            <Link
              key={page}
              href={`${basePath}?page=${page}`}
              className={`flex size-11 items-center justify-center text-title-small font-bold hover:scale-105 active:scale-95 motion-safe:transition-all ${
                page === currentPage
                  ? "pointer-events-none bg-main text-base-dark"
                  : "border-[1.6px] border-main text-main hover:bg-main/10"
              }`}
              aria-label={`${page}ページ目`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </Link>
          ))}
        </div>

        {showNext ? (
          <Link
            href={`${basePath}?page=${currentPage + 1}`}
            className="flex size-5 items-center justify-center hover:scale-110 active:scale-95 motion-safe:transition-transform"
            aria-label="次のページ"
          >
            <ChevronRight className="text-main" strokeWidth={2.5} />
          </Link>
        ) : (
          <div className="invisible size-5" aria-hidden="true" />
        )}
      </div>
    </nav>
  );
}
