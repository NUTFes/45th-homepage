"use client";

import { useState } from "react";

import NewsPagination from "@/modules/news/ui/NewsPagination";

type Props = {
  initialPage?: number;
};

export default function NewsPaginationClient({ initialPage = 1 }: Props) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  return (
    <div className="space-y-ll">
      <div className="space-y-s">
        <p className="text-text text-base-dark">現在ページ: {currentPage}</p>
      </div>
      <NewsPagination currentPage={currentPage} totalPages={5} onPageChange={setCurrentPage} />
    </div>
  );
}
