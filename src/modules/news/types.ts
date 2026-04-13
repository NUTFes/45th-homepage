import type { News } from "@/payload-types";

export type NewsItem = {
  id: News["id"];
  date: string;
  dateTime: News["date"];
  title: News["title"];
  body: News["body"];
};

export type NewsPageData = {
  items: NewsItem[];
  page: number;
  totalPages: number;
  totalDocs: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
};
