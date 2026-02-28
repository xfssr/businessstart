import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PricingPage } from "@/components/pages/PricingPage";
import { getMessages, isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

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

  const messages = getMessages(localeParam);

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
