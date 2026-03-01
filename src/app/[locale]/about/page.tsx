import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AboutPage } from "@/components/pages/AboutPage";
import { isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { getLocaleMessages } from "@/lib/site-content";

type AboutRouteProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: AboutRouteProps): Promise<Metadata> {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    return {};
  }

  const messages = await getLocaleMessages(localeParam);

  return pageMetadata({
    locale: localeParam,
    title: messages.aboutPage.metaTitle,
    description: messages.aboutPage.metaDescription,
    path: "/about",
  });
}

export default async function AboutRoute({ params }: AboutRouteProps) {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  return <AboutPage />;
}
