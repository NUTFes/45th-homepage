import ButtonMain from "@/components/ui/ButtonMain";
import NewsItem from "@/components/ui/NewsItem";
import SectionTitle from "@/components/ui/SectionTitle";
import type { NewsItem as NewsItemType } from "@/modules/news/types";

interface NewsTopProps {
  items: NewsItemType[];
}

export default function NewsTop({ items }: NewsTopProps) {
  return (
    <section className="flex w-full max-w-105 flex-col items-center gap-m">
      <div className="flex w-full flex-col gap-s">
        <SectionTitle title="お知らせ" />
        <div className="w-full bg-base-dark px-ll py-m">
          {items.length > 0 ? (
            <ul className="flex flex-col gap-m">
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
          ) : (
            <p className="px-ll py-m text-center text-text text-font-main">
              お知らせはまだありません
            </p>
          )}
        </div>
      </div>
      <ButtonMain href="/news" title="お知らせ一覧を見る ＞" />
    </section>
  );
}
