import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ServicesPage } from "@/components/pages/ServicesPage";
import { pageMetadata } from "@/lib/seo";
import { isLocale } from "@/lib/i18n";
import { getLocaleMessages } from "@/lib/site-content";

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

  const messages = await getLocaleMessages(localeParam);

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
