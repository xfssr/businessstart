import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SolutionsPage } from "@/components/pages/SolutionsPage";
import { getMessages, isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

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

  const messages = getMessages(localeParam);

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
