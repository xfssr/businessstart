import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SeoServicePage } from "@/components/pages/SeoServicePage";
import { SUPPORTED_LOCALES } from "@/lib/constants";
import { getMessages, isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

const seoSlugs = [
  "restaurant-content",
  "bar-content",
  "beauty-content",
  "qr-menu-mini-site",
  "chef-personal-brand",
  "small-business-quick-start",
] as const;

type SeoRouteProps = {
  params: Promise<{ locale: string; serviceSlug: string }>;
};

export function generateStaticParams() {
  return SUPPORTED_LOCALES.flatMap((locale) =>
    seoSlugs.map((serviceSlug) => ({
      locale,
      serviceSlug,
    })),
  );
}

export async function generateMetadata({
  params,
}: SeoRouteProps): Promise<Metadata> {
  const { locale: localeParam, serviceSlug } = await params;

  if (!isLocale(localeParam) || !seoSlugs.includes(serviceSlug as (typeof seoSlugs)[number])) {
    return {};
  }

  const messages = getMessages(localeParam);
  const pageData = (messages.seoPages as Record<string, { metaTitle: string; metaDescription: string }>)[
    serviceSlug
  ];

  if (!pageData) {
    return {};
  }

  return pageMetadata({
    locale: localeParam,
    title: pageData.metaTitle,
    description: pageData.metaDescription,
    path: `/${serviceSlug}`,
  });
}

export default async function SeoServiceRoute({ params }: SeoRouteProps) {
  const { locale: localeParam, serviceSlug } = await params;

  if (!isLocale(localeParam) || !seoSlugs.includes(serviceSlug as (typeof seoSlugs)[number])) {
    notFound();
  }

  return <SeoServicePage slug={serviceSlug} />;
}
