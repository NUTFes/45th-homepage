import { RichText } from "@payloadcms/richtext-lexical/react";
import { twMerge } from "tailwind-merge";

import type { News } from "@/payload-types";

type NewsRichTextProps = {
  data: News["body"];
  className?: string;
};

export default function NewsRichText({ data, className }: NewsRichTextProps) {
  return (
    <RichText
      className={twMerge(
        "[overflow-wrap:anywhere] [&_a]:rounded-xs [&_a]:font-medium [&_a]:text-main [&_a]:underline [&_a]:underline-offset-4 [&_a]:transition-opacity [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-2 [&_a:focus-visible]:outline-main [&_a:hover]:opacity-80",
        className,
      )}
      data={data}
    />
  );
}
