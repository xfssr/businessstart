import type { Metadata } from "next";

import { DEFAULT_SITE_URL, SUPPORTED_LOCALES, type Locale } from "@/lib/constants";

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL;
}

export function absoluteUrl(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl()}${normalized}`;
}

export function localeFromParams(param: string): Locale | null {
  return (SUPPORTED_LOCALES as readonly string[]).includes(param)
    ? (param as Locale)
    : null;
}

export function buildSeoMetadata({
  locale,
  path,
  title,
  description,
  ogImage,
  noindex,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  ogImage?: string;
  noindex?: boolean;
}): Metadata {
  const cleanedPath = path === "/" ? "" : path;
  const localizedPath = `/${locale}${cleanedPath}`;
  const hePath = `/he${cleanedPath}`;
  const enPath = `/en${cleanedPath}`;
  const canonical = absoluteUrl(localizedPath);
  const image = ogImage ? [ogImage] : undefined;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        he: absoluteUrl(hePath),
        en: absoluteUrl(enPath),
        "x-default": absoluteUrl("/he"),
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      locale: locale === "he" ? "he_IL" : "en_US",
      images: image,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image,
    },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}

export function pageMetadata({
  locale,
  title,
  description,
  path,
}: {
  locale: Locale;
  title: string;
  description: string;
  path: string;
}) {
  return buildSeoMetadata({
    locale,
    path,
    title,
    description,
  });
}
