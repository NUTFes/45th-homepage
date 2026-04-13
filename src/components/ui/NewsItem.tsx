type NewsItemProps = {
  date: string;
  dateTime: string;
  title: string;
  content: string;
};

export default function NewsItem({ date, dateTime, title, content }: NewsItemProps) {
  return (
    <li className="flex flex-col gap-ss border-b border-font-main px-ss pb-ss text-text text-font-main">
      <time dateTime={dateTime}>{date}</time>
      <div className="-ml-[0.5em] text-button before:content-['［_'] after:content-['_］']">
        {title}
      </div>
      <p className="text-justify whitespace-pre-wrap">{content}</p>
    </li>
  );
}
