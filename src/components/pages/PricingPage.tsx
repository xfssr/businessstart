"use client";

import { CardModule } from "@/components/CardModule";
import { Grid } from "@/components/Grid";
import { Section } from "@/components/Section";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { useLocale } from "@/components/LocaleProvider";

type PricingTier = {
  audience: string;
  features: string[];
  price: string;
  title: string;
};

type AddOn = {
  price: string;
  title: string;
};

export function PricingPage() {
  const { get, t } = useLocale();
  const tiers = get<PricingTier[]>("pricingPage.tiers");
  const addons = get<AddOn[]>("pricingPage.addons");

  return (
    <>
      <Section
        eyebrow={t("pricingPage.eyebrow")}
        title={t("pricingPage.title")}
        description={t("pricingPage.description")}
      >
        <Grid cols={3}>
          {tiers.map((tier) => (
            <CardModule key={tier.title} className="flex h-full flex-col">
              <h3 className="font-display text-3xl text-text-primary">{tier.title}</h3>
              <p className="mt-2 text-sm text-text-secondary">{tier.audience}</p>
              <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-t border-border-subtle pt-4 text-xl font-semibold text-text-primary">
                {tier.price}
              </p>
            </CardModule>
          ))}
        </Grid>
      </Section>

      <Section
        eyebrow={t("pricingPage.addonsEyebrow")}
        title={t("pricingPage.addonsTitle")}
        description={t("pricingPage.addonsDescription")}
      >
        <Grid cols={3}>
          {addons.map((addon) => (
            <CardModule key={addon.title}>
              <p className="text-sm text-text-secondary">{addon.title}</p>
              <p className="mt-3 text-lg font-semibold text-text-primary">{addon.price}</p>
            </CardModule>
          ))}
        </Grid>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <WhatsAppLink label={t("pricingPage.primaryCta")} message={t("whatsapp.prefill")} />
          <p className="text-sm text-text-muted">{t("pricingPage.note")}</p>
        </div>
      </Section>
    </>
  );
}
