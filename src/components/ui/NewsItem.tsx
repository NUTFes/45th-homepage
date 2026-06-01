type NewsItemProps = {
  date: string;
  dateTime: string;
  title: string;
  content: string;
  important?: boolean;
};

export default function NewsItem({ date, dateTime, title, content, important }: NewsItemProps) {
  return (
    <li className="flex flex-col border-b border-font-main px-ss pb-ss text-text text-font-main md:text-Ptext">
      <div className="flex items-center gap-xs">
        <time dateTime={dateTime} className="whitespace-nowrap">
          {date}
        </time>
        {important && (
          <span className="rounded-[14px] bg-accent px-s py-0.5 text-text text-base-dark">
            重要
          </span>
        )}
      </div>
      <div className="mt-1 -ml-[0.5em] text-button font-bold text-font-main before:content-['［_'] after:content-['_］'] md:text-Pbutton">
        {title}
      </div>
      <p className="mt-ss text-justify whitespace-pre-wrap">{content}</p>
    </li>
  );
}
