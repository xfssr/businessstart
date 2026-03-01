import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LocaleProvider } from "@/components/LocaleProvider";
import { SiteShell } from "@/components/SiteShell";
import { DEFAULT_SITE_URL, type Locale, SUPPORTED_LOCALES } from "@/lib/constants";
import { getDirection, isLocale } from "@/lib/i18n";
import { getLocaleMessages } from "@/lib/site-content";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    return {};
  }

  const locale = localeParam as Locale;
  const messages = await getLocaleMessages(locale);
  const altLocale = locale === "he" ? "en" : "he";
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL;

  return {
    title: messages.meta.title,
    description: messages.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        he: `${baseUrl}/he`,
        en: `${baseUrl}/en`,
        "x-default": `${baseUrl}/he`,
      },
    },
    openGraph: {
      title: messages.meta.title,
      description: messages.meta.description,
      locale: locale === "he" ? "he_IL" : "en_US",
      alternateLocale: altLocale === "he" ? "he_IL" : "en_US",
      type: "website",
      url: `${baseUrl}/${locale}`,
    },
    twitter: {
      card: "summary_large_image",
      title: messages.meta.title,
      description: messages.meta.description,
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale = localeParam as Locale;
  const dir = getDirection(locale);
  const messages = await getLocaleMessages(locale);

  return (
    <LocaleProvider initialLocale={locale} initialMessages={messages}>
      <div lang={locale} dir={dir}>
        <SiteShell>{children}</SiteShell>
      </div>
    </LocaleProvider>
  );
}
