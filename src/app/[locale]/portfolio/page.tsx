import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PortfolioPage } from "@/components/pages/PortfolioPage";
import { getMessages, isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

type PortfolioRouteProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PortfolioRouteProps): Promise<Metadata> {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    return {};
  }

  const messages = getMessages(localeParam);

  return pageMetadata({
    locale: localeParam,
    title: messages.portfolioPage.metaTitle,
    description: messages.portfolioPage.metaDescription,
    path: "/portfolio",
  });
}

export default async function PortfolioRoute({ params }: PortfolioRouteProps) {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  return <PortfolioPage />;
}
