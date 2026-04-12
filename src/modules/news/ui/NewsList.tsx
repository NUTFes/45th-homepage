import NewsItem from "@/components/ui/NewsItem";
import type { NewsItem as NewsItemType } from "../types";

interface Props {
  items: NewsItemType[];
}

export default function NewsList({ items }: Props) {
  if (items.length === 0) {
    return (
      <p className="px-ll py-m text-center text-text text-font-main">お知らせはまだありません</p>
    );
  }

  return (
    <ul className="flex flex-col gap-l">
      {items.map((news) => (
        <NewsItem
          key={news.id}
          date={news.date}
          dateTime={news.dateTime}
          title={news.title}
          content={news.body}
        />
      ))}
    </ul>
  );
}
