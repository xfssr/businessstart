"use client";

import { useState } from "react";

import { Button } from "@/components/Button";
import { CardModule } from "@/components/CardModule";
import { CatalogDetailsModal } from "@/components/CatalogDetailsModal";
import { Grid } from "@/components/Grid";
import { Section } from "@/components/Section";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { useLocale } from "@/components/LocaleProvider";

type ServiceCard = {
  audience: string;
  features: string[];
  price: string;
  slug: string;
  timeline: string;
  title: string;
};

function interpolateTemplate(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] || "");
}

export function ServicesPage() {
  const { get, locale, t } = useLocale();
  const [activeCard, setActiveCard] = useState<ServiceCard | null>(null);
  const cards = get<ServiceCard[]>("servicesPage.standardCards").slice(0, 6);
  const cardTemplate = get<string>("whatsapp.serviceCardTemplate") || t("whatsapp.prefill");

  return (
    <>
      <Section
        eyebrow={t("servicesPage.eyebrow")}
        title={t("servicesPage.title")}
        description={t("servicesPage.description")}
      >
        <div className="flex flex-wrap gap-3">
          <WhatsAppLink
            label={t("servicesPage.primaryCta")}
            message={t("whatsapp.prefill")}
            className="min-w-52"
          />
          <Button href={`/${locale}/solutions`} variant="secondary" className="min-w-44">
            {t("servicesPage.secondaryCta")}
          </Button>
        </div>
      </Section>

      <Section
        id="services-catalog"
        eyebrow={t("servicesPage.standardEyebrow")}
        title={t("servicesPage.standardTitle")}
        description={t("servicesPage.standardDescription")}
      >
        <Grid cols={3}>
          {cards.map((card) => {
            const message = interpolateTemplate(cardTemplate, {
              title: card.title,
              audience: card.audience,
              timeline: card.timeline,
              price: card.price,
            });
            return (
              <CardModule key={card.slug} className="flex h-full flex-col">
                <h3 className="font-display text-2xl text-text-primary">{card.title}</h3>
                <p className="mt-2 text-sm text-text-secondary">{card.audience}</p>
                <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                  {card.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 border-t border-border-subtle pt-4">
                  <p className="text-xs tracking-[0.16em] text-text-muted uppercase">{card.timeline}</p>
                  <p className="mt-2 text-lg font-semibold text-text-primary">{card.price}</p>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <Button variant="secondary" className="w-full" onClick={() => setActiveCard(card)}>
                    {t("servicesPage.cardCta")}
                  </Button>
                  <WhatsAppLink label={t("servicesPage.orderCta")} message={message} className="w-full" />
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
            <p>{activeCard.audience}</p>
            <ul className="space-y-2">
              {activeCard.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
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
