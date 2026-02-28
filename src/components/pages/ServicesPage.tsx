"use client";

import { Button } from "@/components/Button";
import { CardModule } from "@/components/CardModule";
import { Grid } from "@/components/Grid";
import { Section } from "@/components/Section";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { useLocale } from "@/components/LocaleProvider";

type ServiceCard = {
  audience: string;
  features: string[];
  price: string;
  timeline: string;
  title: string;
};

function ServiceCardBlock({ card, cta }: { card: ServiceCard; cta: string }) {
  return (
    <CardModule className="flex h-full flex-col">
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
      <Button variant="secondary" className="mt-4 w-full">
        {cta}
      </Button>
    </CardModule>
  );
}

export function ServicesPage() {
  const { get, t } = useLocale();
  const standardCards = get<ServiceCard[]>("servicesPage.standardCards");
  const solutionCards = get<ServiceCard[]>("servicesPage.solutionCards");

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
          <Button href="#solutions-list" variant="secondary" className="min-w-44">
            {t("servicesPage.secondaryCta")}
          </Button>
        </div>
      </Section>

      <Section
        id="standard-list"
        eyebrow={t("servicesPage.standardEyebrow")}
        title={t("servicesPage.standardTitle")}
        description={t("servicesPage.standardDescription")}
      >
        <Grid cols={4}>
          {standardCards.map((card) => (
            <ServiceCardBlock key={card.title} card={card} cta={t("servicesPage.cardCta")} />
          ))}
        </Grid>
      </Section>

      <Section
        id="solutions-list"
        eyebrow={t("servicesPage.solutionEyebrow")}
        title={t("servicesPage.solutionTitle")}
        description={t("servicesPage.solutionDescription")}
      >
        <Grid cols={4}>
          {solutionCards.map((card) => (
            <ServiceCardBlock key={card.title} card={card} cta={t("servicesPage.cardCta")} />
          ))}
        </Grid>
      </Section>
    </>
  );
}
