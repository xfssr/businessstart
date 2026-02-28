"use client";

import { CardModule } from "@/components/CardModule";
import { PortfolioGallery } from "@/components/PortfolioGallery";
import { Section } from "@/components/Section";
import { useLocale } from "@/components/LocaleProvider";

type PortfolioItem = {
  alt: string;
  metric: string;
  subtitle: string;
  title: string;
  visual: string;
};

type CasePoint = {
  label: string;
  value: string;
};

export function PortfolioPage() {
  const { get, t } = useLocale();
  const items = get<PortfolioItem[]>("portfolio.items");
  const points = get<CasePoint[]>("portfolioPage.points");

  return (
    <>
      <Section
        eyebrow={t("portfolioPage.eyebrow")}
        title={t("portfolioPage.title")}
        description={t("portfolioPage.description")}
      >
        <PortfolioGallery items={items} />
      </Section>

      <Section
        eyebrow={t("portfolioPage.resultsEyebrow")}
        title={t("portfolioPage.resultsTitle")}
        description={t("portfolioPage.resultsDescription")}
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {points.map((point) => (
            <CardModule key={point.label}>
              <p className="text-xs tracking-[0.16em] text-text-muted uppercase">{point.label}</p>
              <p className="mt-3 text-lg font-semibold text-text-primary">{point.value}</p>
            </CardModule>
          ))}
        </div>
      </Section>
    </>
  );
}
