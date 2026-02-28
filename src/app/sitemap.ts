import type { MetadataRoute } from "next";

import { DEFAULT_SITE_URL, SUPPORTED_LOCALES } from "@/lib/constants";

const commonPaths = [
  "",
  "/services",
  "/solutions",
  "/pricing",
  "/portfolio",
  "/about",
  "/contact",
  "/restaurant-content",
  "/bar-content",
  "/beauty-content",
  "/qr-menu-mini-site",
  "/chef-personal-brand",
  "/small-business-quick-start",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL;
  const now = new Date();

  return SUPPORTED_LOCALES.flatMap((locale) =>
    commonPaths.map((path) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified: now,
      changeFrequency: path === "" ? "daily" : "weekly",
      priority: path === "" ? 1 : 0.7,
    })),
  );
}
