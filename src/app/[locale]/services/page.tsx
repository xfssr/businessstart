import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ServicesPage } from "@/components/pages/ServicesPage";
import { pageMetadata } from "@/lib/seo";
import { getMessages, isLocale } from "@/lib/i18n";

type ServicesRouteProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: ServicesRouteProps): Promise<Metadata> {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    return {};
  }

  const messages = getMessages(localeParam);

  return pageMetadata({
    locale: localeParam,
    title: messages.servicesPage.metaTitle,
    description: messages.servicesPage.metaDescription,
    path: "/services",
  });
}

export default async function ServicesRoute({ params }: ServicesRouteProps) {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  return <ServicesPage />;
}
