"use client";

import { useState } from "react";

import { Button } from "@/components/Button";
import { CardModule } from "@/components/CardModule";
import { CatalogDetailsModal } from "@/components/CatalogDetailsModal";
import { Grid } from "@/components/Grid";
import { Section } from "@/components/Section";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { useLocale } from "@/components/LocaleProvider";

type SolutionCard = {
  outcome: string;
  price: string;
  problem: string;
  slug: string;
  timeline: string;
  title: string;
  whatWeDo: string;
};

function interpolateTemplate(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] || "");
}

export function SolutionsPage() {
  const { get, locale, t } = useLocale();
  const [activeCard, setActiveCard] = useState<SolutionCard | null>(null);
  const cards = get<SolutionCard[]>("solutionsPage.cards").slice(0, 5);
  const cardTemplate = get<string>("whatsapp.solutionCardTemplate") || t("whatsapp.prefill");

  return (
    <>
      <Section
        eyebrow={t("solutionsPage.eyebrow")}
        title={t("solutionsPage.title")}
        description={t("solutionsPage.description")}
      >
        <div className="flex flex-wrap gap-3">
          <WhatsAppLink label={t("solutionsPage.orderCta")} message={t("whatsapp.prefill")} className="min-w-52" />
          <Button href={`/${locale}/services`} variant="secondary" className="min-w-44">
            {locale === "he" ? "מעבר לשירותים" : "Go to Services"}
          </Button>
        </div>
      </Section>

      <Section id="solutions-catalog">
        <Grid cols={3}>
          {cards.map((card) => {
            const message = interpolateTemplate(cardTemplate, {
              title: card.title,
              problem: card.problem,
              outcome: card.outcome,
              timeline: card.timeline,
              price: card.price,
            });

            return (
              <CardModule key={card.slug} className="flex h-full flex-col">
                <h3 className="font-display text-2xl text-text-primary">{card.title}</h3>
                <p className="mt-2 text-sm text-text-secondary">{card.problem}</p>
                <div className="mt-4 space-y-2 text-sm text-text-secondary">
                  <p>
                    <span className="font-semibold text-text-primary">
                      {locale === "he" ? "מה עושים:" : "What we do:"}
                    </span>{" "}
                    {card.whatWeDo}
                  </p>
                  <p>
                    <span className="font-semibold text-text-primary">
                      {locale === "he" ? "תוצאה:" : "Outcome:"}
                    </span>{" "}
                    {card.outcome}
                  </p>
                </div>
                <div className="mt-5 border-t border-border-subtle pt-4">
                  <p className="text-xs tracking-[0.16em] text-text-muted uppercase">{card.timeline}</p>
                  <p className="mt-2 text-lg font-semibold text-text-primary">{card.price}</p>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <Button variant="secondary" className="w-full" onClick={() => setActiveCard(card)}>
                    {t("solutionsPage.cardCta")}
                  </Button>
                  <WhatsAppLink label={t("solutionsPage.orderCta")} message={message} className="w-full" />
                </div>
              </CardModule>
            );
          })}
        </Grid>
      </Section>

      <CatalogDetailsModal
        open={Boolean(activeCard)}
        onClose={() => setActiveCard(null)}
        title={activeCard?.title || ""}
        closeLabel={t("ui.close")}
      >
        {activeCard ? (
          <div className="space-y-4 text-sm leading-relaxed text-text-secondary">
            <p>{activeCard.problem}</p>
            <p>
              <span className="font-semibold text-text-primary">
                {locale === "he" ? "מה עושים:" : "What we do:"}
              </span>{" "}
              {activeCard.whatWeDo}
            </p>
            <p>
              <span className="font-semibold text-text-primary">
                {locale === "he" ? "תוצאה:" : "Outcome:"}
              </span>{" "}
              {activeCard.outcome}
            </p>
            <div className="border-t border-border-subtle pt-4">
              <p className="text-xs tracking-[0.16em] text-text-muted uppercase">{activeCard.timeline}</p>
              <p className="mt-2 text-base font-semibold text-text-primary">{activeCard.price}</p>
            </div>
          </div>
        ) : null}
      </CatalogDetailsModal>
    </>
  );
}
