import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AboutPage } from "@/components/pages/AboutPage";
import { getMessages, isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

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

  const messages = getMessages(localeParam);

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
