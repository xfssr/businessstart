import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PricingPage } from "@/components/pages/PricingPage";
import { isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { getLocaleMessages } from "@/lib/site-content";

type PricingRouteProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PricingRouteProps): Promise<Metadata> {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    return {};
  }

  const messages = await getLocaleMessages(localeParam);

  return pageMetadata({
    locale: localeParam,
    title: messages.pricingPage.metaTitle,
    description: messages.pricingPage.metaDescription,
    path: "/pricing",
  });
}

export default async function PricingRoute({ params }: PricingRouteProps) {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  return <PricingPage />;
}
