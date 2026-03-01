import type { MetadataRoute } from "next";

import { DEFAULT_SITE_URL, SUPPORTED_LOCALES } from "@/lib/constants";
import { getLocaleDynamicPaths } from "@/lib/site-content";

const commonPaths = [
  "",
  "/services",
  "/solutions",
  "/pricing",
  "/portfolio",
  "/about",
  "/contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL;
  const now = new Date();
  const dynamicPathsByLocale = Object.fromEntries(
    await Promise.all(
      SUPPORTED_LOCALES.map(async (locale) => [locale, await getLocaleDynamicPaths(locale)]),
    ),
  ) as Record<(typeof SUPPORTED_LOCALES)[number], string[]>;

  return SUPPORTED_LOCALES.flatMap((locale) =>
    [...commonPaths, ...dynamicPathsByLocale[locale]].map((path) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified: now,
      changeFrequency: path === "" ? "daily" : "weekly",
      priority: path === "" ? 1 : 0.7,
    })),
  );
}
