import type { NewsItemProps } from "../types";

export default function NewsItem({ date, title, content }: NewsItemProps) {
  const displayDate = date.replaceAll("-", ".");
  return (
    <li className="flex flex-col gap-ss border-b border-font-main px-ss pb-ss text-text text-font-main">
      <time dateTime={date}>{displayDate}</time>
      <h2 className="-ml-[0.5em] text-button before:content-['［_'] after:content-['_］']">
        {title}
      </h2>
      <p className="text-justify whitespace-pre-wrap">{content}</p>
    </li>
  );
}
