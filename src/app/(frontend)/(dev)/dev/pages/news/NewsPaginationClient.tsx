import NewsPagination from "@/modules/news/ui/NewsPagination";

type Props = {
  initialPage?: number;
};

export default function NewsPaginationClient({ initialPage = 1 }: Props) {
  return (
    <div className="space-y-ll">
      <div className="space-y-s">
        <p className="text-text text-base-dark">現在ページ: {initialPage}</p>
      </div>
      <NewsPagination currentPage={initialPage} totalPages={5} basePath="/dev/pages/news" />
    </div>
  );
}
