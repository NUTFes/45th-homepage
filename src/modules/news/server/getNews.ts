import { cacheLife, cacheTag } from "next/cache";
import { getPayload } from "payload";

import { CACHE_TAGS } from "@/lib/cacheTags";
import config from "@/payload.config";
import type { News } from "@/payload-types";

import type { NewsItem, NewsPageData } from "../types";
import { toSafePage } from "../utils";

export const NEWS_PER_PAGE = 5;

const DEFAULT_LIMIT = 10;

const newsDateFormatter = new Intl.DateTimeFormat("ja-JP", {
  day: "2-digit",
  month: "2-digit",
  timeZone: "Asia/Tokyo",
  year: "numeric",
});

const toSafeLimit = (limit?: number) => {
  if (!limit || Number.isNaN(limit)) {
    return DEFAULT_LIMIT;
  }

  return limit < 1 ? DEFAULT_LIMIT : Math.floor(limit);
};

const formatNewsDate = (isoDate: string) => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  const parts = newsDateFormatter.formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    return isoDate;
  }

  return `${year}.${month}.${day}`;
};

const toNewsItem = (doc: Pick<News, "id" | "date" | "title" | "body" | "important">): NewsItem => ({
  body: doc.body,
  date: formatNewsDate(doc.date),
  dateTime: doc.date,
  id: doc.id,
  important: doc.important === "important",
  title: doc.title,
});

export async function getNews(page = 1, limit = DEFAULT_LIMIT): Promise<NewsPageData> {
  "use cache";
  cacheTag(CACHE_TAGS.news);
  cacheLife("minutes");

  const safePage = toSafePage(page);
  const safeLimit = toSafeLimit(limit);

  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "news",
    depth: 0,
    limit: safeLimit,
    overrideAccess: true,
    page: safePage,
    select: {
      id: true,
      body: true,
      date: true,
      important: true,
      title: true,
    },
    sort: "-date",
    where: {
      _status: {
        equals: "published",
      },
    },
  });

  return {
    hasNextPage: result.hasNextPage,
    hasPrevPage: result.hasPrevPage,
    items: result.docs.map(toNewsItem),
    page: result.page ?? 1,
    totalDocs: result.totalDocs,
    totalPages: result.totalPages,
  };
}

export async function getLatestNews(limit = 3): Promise<NewsItem[]> {
  "use cache";
  cacheTag(CACHE_TAGS.news);
  cacheLife("minutes");

  const safeLimit = toSafeLimit(limit);

  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "news",
    depth: 0,
    limit: safeLimit,
    overrideAccess: true,
    select: {
      id: true,
      body: true,
      date: true,
      important: true,
      title: true,
    },
    sort: "-date",
    where: {
      _status: {
        equals: "published",
      },
    },
  });

  return result.docs.map(toNewsItem);
}

export async function getImportantNewsBody(): Promise<News["body"] | null> {
  "use cache";
  cacheTag(CACHE_TAGS.news);
  cacheLife("minutes");

  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "news",
    depth: 0,
    limit: 1,
    overrideAccess: true,
    select: {
      body: true,
    },
    sort: "-date",
    where: {
      and: [
        {
          _status: {
            equals: "published",
          },
        },
        {
          important: {
            equals: "important",
          },
        },
      ],
    },
  });

  return result.docs[0]?.body ?? null;
}
