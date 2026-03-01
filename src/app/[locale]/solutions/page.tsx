import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SolutionsPage } from "@/components/pages/SolutionsPage";
import { isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { getLocaleMessages } from "@/lib/site-content";

type SolutionsRouteProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: SolutionsRouteProps): Promise<Metadata> {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    return {};
  }

  const messages = await getLocaleMessages(localeParam);

  return pageMetadata({
    locale: localeParam,
    title: messages.solutionsPage.metaTitle,
    description: messages.solutionsPage.metaDescription,
    path: "/solutions",
  });
}

export default async function SolutionsRoute({ params }: SolutionsRouteProps) {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  return <SolutionsPage />;
}
