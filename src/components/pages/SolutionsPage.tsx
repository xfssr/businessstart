"use client";

import { CardModule } from "@/components/CardModule";
import { Grid } from "@/components/Grid";
import { Section } from "@/components/Section";
import { useLocale } from "@/components/LocaleProvider";

type SolutionCard = {
  fit: string;
  include: string[];
  price: string;
  title: string;
};

export function SolutionsPage() {
  const { get, t } = useLocale();
  const cards = get<SolutionCard[]>("solutionsPage.cards");

  return (
    <Section
      eyebrow={t("solutionsPage.eyebrow")}
      title={t("solutionsPage.title")}
      description={t("solutionsPage.description")}
    >
      <Grid cols={3}>
        {cards.map((card) => (
          <CardModule key={card.title} className="flex h-full flex-col">
            <h3 className="font-display text-2xl text-text-primary">{card.title}</h3>
            <p className="mt-2 text-sm text-text-secondary">{card.fit}</p>
            <ul className="mt-4 space-y-2 text-sm text-text-secondary">
              {card.include.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 border-t border-border-subtle pt-4 text-lg font-semibold text-text-primary">
              {card.price}
            </p>
          </CardModule>
        ))}
      </Grid>
    </Section>
  );
}
