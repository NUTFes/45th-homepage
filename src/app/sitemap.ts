import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { getPayload } from "payload";

import { PROGRAM_CATEGORIES } from "@/lib/events/constants";
import { SITE_URL } from "@/lib/siteUrl";
import config from "@/payload.config";

const STATIC_PATHS = [
  "/",
  "/access",
  "/attention",
  "/contact",
  "/event",
  "/event/guest",
  "/greeting",
  "/info",
  "/map",
  "/news",
  "/schedule",
  "/sponsors",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();

  const payload = await getPayload({ config });
  const programs = await payload.find({
    collection: "programs",
    depth: 0,
    pagination: false,
    overrideAccess: false,
    select: {
      id: true,
      updatedAt: true,
    },
    where: {
      _status: {
        equals: "published",
      },
    },
  });

  const staticPages: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: new URL(path, SITE_URL).href,
  }));

  const categoryPages: MetadataRoute.Sitemap = PROGRAM_CATEGORIES.map(({ value }) => ({
    url: new URL(`/event/programs/category/${value}`, SITE_URL).href,
  }));

  const programPages: MetadataRoute.Sitemap = programs.docs.map(({ id, updatedAt }) => ({
    url: new URL(`/event/programs/${id}`, SITE_URL).href,
    lastModified: updatedAt,
  }));

  return [...staticPages, ...categoryPages, ...programPages];
}
