import type { Metadata } from "next";

import {
  DEFAULT_SITE_URL,
  SUPPORTED_LOCALES,
  type Locale,
} from "@/lib/constants";
import { getMessages } from "@/lib/i18n";

function toAbsolute(path: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL;
  const normalized = path.startsWith("/") ? path : `/${path}`;

  return `${base}${normalized}`;
}

export function localizedAlternates(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;

  return {
    canonical: normalized,
    languages: {
      he: toAbsolute(`/he${normalized}`.replace("/he/", "/he/")),
      en: toAbsolute(`/en${normalized}`.replace("/en/", "/en/")),
      "x-default": toAbsolute("/he"),
    },
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
}): Metadata {
  const normalizedPath = path === "/" ? `/${locale}` : `/${locale}${path}`;
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL;

  return {
    title,
    description,
    alternates: {
      canonical: normalizedPath,
      languages: {
        he: `${base}/he${path === "/" ? "" : path}`,
        en: `${base}/en${path === "/" ? "" : path}`,
        "x-default": `${base}/he`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${base}${normalizedPath}`,
      type: "website",
      locale: locale === "he" ? "he_IL" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function localeFromParams(param: string): Locale | null {
  return (SUPPORTED_LOCALES as readonly string[]).includes(param)
    ? (param as Locale)
    : null;
}

export function getPageMetaContent(locale: Locale, key: string) {
  const messages = getMessages(locale);
  const value = key.split(".").reduce<unknown>((acc, segment) => {
    if (!acc || typeof acc !== "object") {
      return undefined;
    }

    return (acc as Record<string, unknown>)[segment];
  }, messages);

  return value as { title: string; description: string };
}
