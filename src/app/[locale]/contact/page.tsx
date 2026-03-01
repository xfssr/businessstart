import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContactPage } from "@/components/pages/ContactPage";
import { isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { getLocaleMessages } from "@/lib/site-content";

type ContactRouteProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: ContactRouteProps): Promise<Metadata> {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    return {};
  }

  const messages = await getLocaleMessages(localeParam);

  return pageMetadata({
    locale: localeParam,
    title: messages.contactPage.metaTitle,
    description: messages.contactPage.metaDescription,
    path: "/contact",
  });
}

export default async function ContactRoute({ params }: ContactRouteProps) {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  return <ContactPage />;
}
