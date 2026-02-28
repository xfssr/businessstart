"use client";

import { useMemo } from "react";

import { Accordion } from "@/components/Accordion";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { CardModule } from "@/components/CardModule";
import { Divider } from "@/components/Divider";
import { Grid } from "@/components/Grid";
import { PortfolioGallery } from "@/components/PortfolioGallery";
import { Section } from "@/components/Section";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { useLocale } from "@/components/LocaleProvider";

type Metric = {
  label: string;
  value: string;
};

type Step = {
  description: string;
  marker: string;
  title: string;
};

type ListItem = {
  description: string;
  title: string;
};

type ContactChannel = {
  label: string;
  value: string;
};

type PortfolioItem = {
  alt: string;
  metric: string;
  subtitle: string;
  title: string;
  visual: string;
};

type FaqItem = {
  answer: string;
  question: string;
};

type ContactFormLabels = {
  businessLabel: string;
  messageLabel: string;
  nameLabel: string;
  phoneLabel: string;
  submit: string;
  title: string;
};

export function HomePage() {
  const { get, locale, t } = useLocale();

  const metrics = get<Metric[]>("hero.metrics");
  const whatWeDoPillars = get<ListItem[]>("whatWeDo.pillars");
  const processSteps = get<Step[]>("process.steps");
  const audienceCategories = get<string[]>("audience.categories");
  const differencePoints = get<string[]>("difference.points");
  const services = get<ListItem[]>("services.items");
  const outcomes = get<string[]>("outcomes.items");
  const portfolioItems = get<PortfolioItem[]>("portfolio.items");
  const faqItems = get<FaqItem[]>("faq.items");
  const contactChannels = get<ContactChannel[]>("contact.channels");
  const contactForm = get<ContactFormLabels>("contact.form");
  const faqSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    }),
    [faqItems],
  );

  const businessSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: t("brand.name"),
      description: t("meta.description"),
      areaServed: locale === "he" ? "Israel" : "Israel, Europe",
      telephone: "+972-50-000-0000",
      email: "hello@businessstart.example",
      url: `https://businessstart.vercel.app/${locale}`,
    }),
    [locale, t],
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Section id="home" className="pt-14 sm:pt-20">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <Badge>{t("hero.eyebrow")}</Badge>
            <h1 className="mt-5 font-display text-4xl leading-tight text-text-primary sm:text-6xl">
              {t("hero.title")}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-xl">
              {t("hero.description")}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <WhatsAppLink
                label={t("hero.primaryCta")}
                message={t("whatsapp.prefill")}
                className="min-w-52"
              />
              <Button href={`/${locale}/services`} variant="secondary" className="min-w-44">
                {t("hero.secondaryCta")}
              </Button>
            </div>
            <p className="mt-4 border-s-2 border-accent ps-3 text-sm text-text-muted">{t("hero.trust")}</p>
          </div>

          <CardModule className="relative overflow-hidden border-border-strong bg-surface-overlay p-7">
            <p className="text-xs font-semibold tracking-[0.2em] text-text-muted uppercase">
              STUDIO LAB PANEL
            </p>
            <div className="mt-5 space-y-4">
              {whatWeDoPillars.slice(0, 3).map((pillar, index) => (
                <div key={pillar.title} className="border-b border-border-subtle pb-3 last:border-none">
                  <p className="text-xs font-semibold tracking-[0.16em] text-accent">{`0${index + 1}`}</p>
                  <p className="mt-1 text-sm font-semibold text-text-primary">{pillar.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-text-secondary">{pillar.description}</p>
                </div>
              ))}
            </div>
          </CardModule>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {metrics.map((metric) => (
            <CardModule key={metric.label} className="border-border-subtle bg-surface-elevated/70 p-5">
              <p className="text-xs tracking-[0.16em] text-text-muted uppercase">{metric.label}</p>
              <p dir="ltr" className="mt-3 font-display text-3xl text-text-primary">
                {metric.value}
              </p>
            </CardModule>
          ))}
        </div>
      </Section>

      <Divider />

      <Section
        id="what-we-do"
        eyebrow={t("whatWeDo.eyebrow")}
        title={t("whatWeDo.title")}
        description={t("whatWeDo.description")}
      >
        <Grid cols={3}>
          {whatWeDoPillars.map((pillar) => (
            <CardModule key={pillar.title}>
              <h3 className="font-display text-2xl text-text-primary">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{pillar.description}</p>
            </CardModule>
          ))}
        </Grid>
      </Section>

      <Divider />

      <Section
        id="process"
        eyebrow={t("process.eyebrow")}
        title={t("process.title")}
        description={t("process.description")}
      >
        <Grid cols={4}>
          {processSteps.map((step) => (
            <CardModule key={step.marker}>
              <p className="text-xs font-semibold tracking-[0.2em] text-accent">{step.marker}</p>
              <h3 className="mt-3 font-display text-2xl text-text-primary">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{step.description}</p>
            </CardModule>
          ))}
        </Grid>
      </Section>

      <Divider />

      <Section
        id="audience"
        eyebrow={t("audience.eyebrow")}
        title={t("audience.title")}
        description={t("audience.description")}
      >
        <Grid cols={4}>
          {audienceCategories.map((category) => (
            <CardModule key={category} className="py-5">
              <p className="text-sm font-semibold tracking-[0.12em] text-text-primary uppercase">{category}</p>
            </CardModule>
          ))}
        </Grid>
      </Section>

      <Divider />

      <Section
        id="difference"
        eyebrow={t("difference.eyebrow")}
        title={t("difference.title")}
        description={t("difference.description")}
      >
        <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
          <CardModule>
            <ul className="space-y-3">
              {differencePoints.map((point) => (
                <li key={point} className="flex items-start gap-2 text-sm leading-relaxed text-text-secondary">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </CardModule>
          <CardModule className="flex items-center">
            <p className="font-display text-3xl leading-tight text-text-primary">{t("difference.callout")}</p>
          </CardModule>
        </div>
      </Section>

      <Divider />

      <Section
        id="solutions"
        eyebrow={t("services.eyebrow")}
        title={t("services.title")}
        description={t("services.description")}
      >
        <Grid cols={4}>
          {services.map((service) => (
            <CardModule key={service.title} className="flex h-full flex-col">
              <h3 className="font-display text-2xl text-text-primary">{service.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{service.description}</p>
            </CardModule>
          ))}
        </Grid>
      </Section>

      <Divider />

      <Section
        id="outcomes"
        eyebrow={t("outcomes.eyebrow")}
        title={t("outcomes.title")}
        description={t("outcomes.description")}
      >
        <Grid cols={2}>
          {outcomes.map((outcome) => (
            <CardModule key={outcome} className="py-5">
              <p className="text-sm leading-relaxed text-text-primary">{outcome}</p>
            </CardModule>
          ))}
        </Grid>
      </Section>

      <Divider />

      <Section
        id="work"
        eyebrow={t("portfolio.eyebrow")}
        title={t("portfolio.title")}
        description={t("portfolio.description")}
      >
        <PortfolioGallery items={portfolioItems} />
      </Section>

      <Divider />

      <Section
        id="faq"
        eyebrow={t("faq.eyebrow")}
        title={t("faq.title")}
        description={t("faq.description")}
      >
        <Accordion items={faqItems} />
      </Section>

      <Divider />

      <Section
        id="start"
        eyebrow={t("cta.eyebrow")}
        title={t("cta.title")}
        description={t("cta.description")}
      >
        <CardModule className="border-border-strong bg-surface-overlay">
          <div className="flex flex-wrap items-center gap-3">
            <WhatsAppLink
              label={t("cta.primaryCta")}
              message={t("whatsapp.prefill")}
              className="min-w-52"
            />
            <Button href={`/${locale}/contact`} variant="secondary" className="min-w-44">
              {t("cta.secondaryCta")}
            </Button>
          </div>
        </CardModule>
      </Section>

      <Divider />

      <Section
        id="contact"
        eyebrow={t("contact.eyebrow")}
        title={t("contact.title")}
        description={t("contact.description")}
      >
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <CardModule className="space-y-6">
            <div className="flex flex-wrap gap-3">
              <WhatsAppLink
                label={t("contact.primaryCta")}
                message={t("whatsapp.prefill")}
                className="min-w-52"
              />
              <Button href={`/${locale}/services`} variant="secondary" className="min-w-44">
                {t("contact.secondaryCta")}
              </Button>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-text-secondary">
              {t("contact.description")}
            </p>
            <div className="space-y-4 rounded-xl border border-border-subtle bg-surface-base/55 p-4">
              <p className="text-xs font-semibold tracking-[0.18em] text-text-muted uppercase">
                {contactForm.title}
              </p>
              <form className="grid gap-3 sm:grid-cols-2" onSubmit={(event) => event.preventDefault()}>
                <label className="text-sm text-text-secondary">
                  <span className="mb-1 block">{contactForm.nameLabel}</span>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-border-subtle bg-surface-elevated px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-accent"
                  />
                </label>
                <label className="text-sm text-text-secondary">
                  <span className="mb-1 block">{contactForm.phoneLabel}</span>
                  <input
                    type="tel"
                    className="w-full rounded-lg border border-border-subtle bg-surface-elevated px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-accent"
                  />
                </label>
                <label className="text-sm text-text-secondary sm:col-span-2">
                  <span className="mb-1 block">{contactForm.businessLabel}</span>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-border-subtle bg-surface-elevated px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-accent"
                  />
                </label>
                <label className="text-sm text-text-secondary sm:col-span-2">
                  <span className="mb-1 block">{contactForm.messageLabel}</span>
                  <textarea
                    rows={4}
                    className="w-full rounded-lg border border-border-subtle bg-surface-elevated px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-accent"
                  />
                </label>
                <Button className="sm:col-span-2">{contactForm.submit}</Button>
              </form>
            </div>
          </CardModule>
          <CardModule>
            <ul className="space-y-4">
              {contactChannels.map((channel) => (
                <li
                  key={channel.label}
                  className="border-b border-border-subtle pb-3 last:border-none last:pb-0"
                >
                  <p className="text-xs tracking-[0.16em] text-text-muted uppercase">{channel.label}</p>
                  <p className="mt-1 text-sm font-semibold text-text-primary">{channel.value}</p>
                </li>
              ))}
            </ul>
          </CardModule>
        </div>
      </Section>
    </>
  );
}
