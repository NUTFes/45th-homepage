type Props = {
  date: string;
  title: string;
  content: string;
};

export default function NewsItem({ date, title, content }: Props) {
  const displayDate = date.replaceAll("-", ".");
  return (
    <article className="flex flex-col gap-ss border-b border-font-main px-ss pb-ss text-text text-font-main">
      <time dateTime={date}>{displayDate}</time>
      <h2 className="text-button -ml-[0.5em]">{`［ ${title} ］`}</h2>
      <p className="text-justify whitespace-pre-wrap">{content}</p>
    </article>
  );
}
