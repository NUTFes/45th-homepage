import ButtonMain from "@/components/ui/ButtonMain";
import ImportantFrame from "@/components/ui/ImportantFrame";
import NewsItem from "@/components/ui/NewsItem";
import SectionTitle from "@/components/ui/SectionTitle";
import type { NewsItem as NewsItemType } from "@/modules/news/types";

const NO_IMPORTANT_NEWS_MESSAGE = "現在、重要なお知らせはありません。";

interface NewsTopProps {
  items: NewsItemType[];
  importantBody?: string | null;
}

export default function NewsTop({ items, importantBody }: NewsTopProps) {
  const resolvedImportantBody = importantBody ?? NO_IMPORTANT_NEWS_MESSAGE;

  return (
    <div className="flex w-full flex-col items-center gap-l">
      <div className="w-full max-w-105 md:max-w-none">
        <ImportantFrame title="重要なお知らせ">
          <p className="whitespace-pre-wrap">{resolvedImportantBody}</p>
        </ImportantFrame>
      </div>
      <section className="w-full md:bg-base-dark md:px-3l md:py-3l">
        <div className="mx-auto flex w-full max-w-105 flex-col items-center gap-m md:max-w-250 md:flex-row md:items-start md:justify-start md:gap-4l">
          <div className="w-full md:w-auto md:shrink-0">
            <SectionTitle title="お知らせ" />
          </div>
          <div className="flex w-full flex-col items-end gap-m md:max-w-189">
            <div className="w-full bg-base-dark px-ll py-m md:bg-transparent md:px-ss md:py-0">
              {items.length > 0 ? (
                <ul className="flex flex-col gap-m md:gap-l">
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
            <div className="flex w-full justify-center pb-ss md:justify-end">
              <ButtonMain href="/news" title="お知らせ一覧を見る ＞" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
