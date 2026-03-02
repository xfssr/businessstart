"use client";

import { useMemo, useState } from "react";

import { Accordion } from "@/components/Accordion";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { CardModule } from "@/components/CardModule";
import { CatalogDetailsModal } from "@/components/CatalogDetailsModal";
import { Divider } from "@/components/Divider";
import { type ExamplesGalleryItem, ExamplesGallery } from "@/components/ExamplesGallery";
import { Grid } from "@/components/Grid";
import { LeadForm } from "@/components/LeadForm";
import { PortfolioGallery } from "@/components/PortfolioGallery";
import { Section } from "@/components/Section";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { useLocale } from "@/components/LocaleProvider";
import { DEFAULT_SITE_URL } from "@/lib/constants";

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
  mediaType?: "image" | "video";
};

type FaqItem = {
  answer: string;
  question: string;
};

type ServiceCard = {
  audience: string;
  features: string[];
  price: string;
  slug: string;
  timeline: string;
  title: string;
};

type SolutionCard = {
  outcome: string;
  price: string;
  problem: string;
  slug: string;
  timeline: string;
  title: string;
  whatWeDo: string;
};

type TestimonialItem = {
  business: string;
  name: string;
  quote: string;
  rating: number;
};

type ContactFormLabels = {
  businessLabel: string;
  messageLabel: string;
  nameLabel: string;
  phoneLabel: string;
  submit: string;
  title: string;
};

type GlobalContact = {
  email?: string;
  instagram?: string;
  phone?: string;
  whatsappNumber?: string;
};

type SolutionsPromptCard = {
  outcome: string;
  problem: string;
  slug: string;
  title: string;
};

type SolutionsPromptSection = {
  cards?: SolutionsPromptCard[];
  cta?: string;
  description?: string;
  eyebrow?: string;
  title?: string;
};

type ExamplesGallerySection = {
  description?: string;
  eyebrow?: string;
  items?: ExamplesGalleryItem[];
  title?: string;
};

function interpolateTemplate(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] || "");
}

function normalizeInstagram(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  return `https://instagram.com/${trimmed.replace(/^@/, "")}`;
}

type ModalState =
  | { type: "service"; card: ServiceCard }
  | { type: "solution"; card: SolutionCard }
  | null;

export function HomePage() {
  const { get, locale, t } = useLocale();
  const [modalState, setModalState] = useState<ModalState>(null);

  const metrics = get<Metric[]>("hero.metrics");
  const whatWeDoPillars = get<ListItem[]>("whatWeDo.pillars");
  const processSteps = get<Step[]>("process.steps");
  const audienceCategories = get<string[]>("audience.categories");
  const differencePoints = get<string[]>("difference.points");
  const outcomes = get<string[]>("outcomes.items");
  const portfolioItems = get<PortfolioItem[]>("portfolio.items");
  const faqItems = get<FaqItem[]>("faq.items");
  const contactChannels = get<ContactChannel[]>("contact.channels");
  const contactForm = get<ContactFormLabels>("contact.form");
  const services = get<ServiceCard[]>("servicesPage.standardCards").slice(0, 6);
  const solutions = get<SolutionCard[]>("solutionsPage.cards").slice(0, 5);
  const testimonials = (get<TestimonialItem[]>("testimonials.items") || []).filter((item) => item.quote);
  const globalContact = get<GlobalContact>("global");
  const examplesGallery = get<ExamplesGallerySection>("examplesGallery");
  const mediaCategories = get<Record<string, string>>("mediaCategories") || {};
  const solutionsPrompt = get<SolutionsPromptSection>("solutionsPrompt");

  const examplesGalleryItems = (examplesGallery?.items ?? [])
    .filter((item) => item.src)
    .sort((left, right) => (left.order ?? 100) - (right.order ?? 100));

  const serviceTemplate = get<string>("whatsapp.serviceCardTemplate") || t("whatsapp.prefill");
  const solutionTemplate = get<string>("whatsapp.solutionCardTemplate") || t("whatsapp.prefill");
  const promptCards = (solutionsPrompt?.cards ?? solutions)
    .filter((item) => item.slug)
    .slice(0, 5);

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

  const businessSchema = useMemo(() => {
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, "");
    const telephone = globalContact.phone || globalContact.whatsappNumber || "";
    const email = globalContact.email || "";
    const instagram = normalizeInstagram(globalContact.instagram || "");

    return {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: t("brand.name"),
      description: t("meta.description"),
      areaServed: locale === "he" ? "Israel" : "Israel, Europe",
      telephone,
      email,
      url: `${siteUrl}/${locale}`,
      sameAs: instagram ? [instagram] : undefined,
    };
  }, [globalContact.email, globalContact.instagram, globalContact.phone, globalContact.whatsappNumber, locale, t]);

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
              {t("hero.panelLabel")}
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

      {examplesGalleryItems.length ? (
        <>
          <Section
            id="examples-gallery"
            eyebrow={examplesGallery?.eyebrow || t("examplesGallery.eyebrow")}
            title={examplesGallery?.title || t("examplesGallery.title")}
            description={examplesGallery?.description || t("examplesGallery.description")}
          >
            <ExamplesGallery items={examplesGalleryItems} categoryLabels={mediaCategories} />
          </Section>
          <Divider />
        </>
      ) : null}

      {promptCards.length ? (
        <>
          <Section
            id="solutions-prompt"
            eyebrow={solutionsPrompt?.eyebrow || t("solutionsPrompt.eyebrow")}
            title={solutionsPrompt?.title || t("solutionsPrompt.title")}
            description={solutionsPrompt?.description || t("solutionsPrompt.description")}
          >
            <Grid cols={3}>
              {promptCards.map((card) => (
                <CardModule key={card.slug}>
                  <h3 className="font-display text-2xl text-text-primary">{card.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary">{card.problem}</p>
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary">{card.outcome}</p>
                </CardModule>
              ))}
            </Grid>
            <div className="mt-6">
              <Button href={`/${locale}/solutions`} className="min-w-48">
                {solutionsPrompt?.cta || t("solutionsPrompt.cta")}
              </Button>
            </div>
          </Section>
          <Divider />
        </>
      ) : null}

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
        id="services"
        eyebrow={t("services.eyebrow")}
        title={t("services.title")}
        description={t("services.description")}
      >
        <Grid cols={3}>
          {services.map((service) => {
            const message = interpolateTemplate(serviceTemplate, {
              title: service.title,
              audience: service.audience,
              timeline: service.timeline,
              price: service.price,
            });
            return (
              <CardModule key={service.slug} className="flex h-full flex-col">
                <h3 className="font-display text-2xl text-text-primary">{service.title}</h3>
                <p className="mt-2 text-sm text-text-secondary">{service.audience}</p>
                <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                  {service.features.slice(0, 4).map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 border-t border-border-subtle pt-4">
                  <p className="text-xs tracking-[0.16em] text-text-muted uppercase">{service.timeline}</p>
                  <p className="mt-2 text-lg font-semibold text-text-primary">{service.price}</p>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => setModalState({ type: "service", card: service })}
                  >
                    {t("servicesPage.cardCta")}
                  </Button>
                  <WhatsAppLink label={t("servicesPage.orderCta")} message={message} className="w-full" />
                </div>
              </CardModule>
            );
          })}
        </Grid>
      </Section>

      <Divider />

      <Section
        id="solutions"
        eyebrow={t("solutionsPage.eyebrow")}
        title={t("solutionsPage.title")}
        description={t("solutionsPage.description")}
      >
        <Grid cols={3}>
          {solutions.map((solution) => {
            const message = interpolateTemplate(solutionTemplate, {
              title: solution.title,
              problem: solution.problem,
              outcome: solution.outcome,
              timeline: solution.timeline,
              price: solution.price,
            });
            return (
              <CardModule key={solution.slug} className="flex h-full flex-col">
                <h3 className="font-display text-2xl text-text-primary">{solution.title}</h3>
                <p className="mt-2 text-sm text-text-secondary">{solution.problem}</p>
                <div className="mt-4 space-y-2 text-sm text-text-secondary">
                  <p>
                    <span className="font-semibold text-text-primary">
                      {locale === "he" ? "מה עושים:" : "What we do:"}
                    </span>{" "}
                    {solution.whatWeDo}
                  </p>
                  <p>
                    <span className="font-semibold text-text-primary">
                      {locale === "he" ? "תוצאה:" : "Outcome:"}
                    </span>{" "}
                    {solution.outcome}
                  </p>
                </div>
                <div className="mt-5 border-t border-border-subtle pt-4">
                  <p className="text-xs tracking-[0.16em] text-text-muted uppercase">{solution.timeline}</p>
                  <p className="mt-2 text-lg font-semibold text-text-primary">{solution.price}</p>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => setModalState({ type: "solution", card: solution })}
                  >
                    {t("solutionsPage.cardCta")}
                  </Button>
                  <WhatsAppLink label={t("solutionsPage.orderCta")} message={message} className="w-full" />
                </div>
              </CardModule>
            );
          })}
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

      {testimonials.length ? (
        <>
          <Divider />
          <Section
            id="testimonials"
            eyebrow={t("testimonials.eyebrow")}
            title={t("testimonials.title")}
            description={t("testimonials.description")}
          >
            <Grid cols={3}>
              {testimonials.map((item) => (
                <CardModule key={`${item.name}-${item.quote}`}>
                  <p className="text-sm leading-relaxed text-text-secondary">{item.quote}</p>
                  <p className="mt-4 text-sm font-semibold text-text-primary">{item.name}</p>
                  <p className="text-xs tracking-[0.14em] text-text-muted uppercase">{item.business}</p>
                </CardModule>
              ))}
            </Grid>
          </Section>
        </>
      ) : null}

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
            <WhatsAppLink label={t("cta.primaryCta")} message={t("whatsapp.prefill")} className="min-w-52" />
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
              <WhatsAppLink label={t("contact.primaryCta")} message={t("whatsapp.prefill")} className="min-w-52" />
              <Button href={`/${locale}/services`} variant="secondary" className="min-w-44">
                {t("contact.secondaryCta")}
              </Button>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-text-secondary">{t("contact.description")}</p>
            <LeadForm labels={contactForm} />
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

      <CatalogDetailsModal
        open={Boolean(modalState)}
        onClose={() => setModalState(null)}
        title={modalState?.card.title || ""}
        closeLabel={t("ui.close")}
      >
        {modalState?.type === "service" ? (
          <div className="space-y-4 text-sm leading-relaxed text-text-secondary">
            <p>{modalState.card.audience}</p>
            <ul className="space-y-2">
              {modalState.card.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-border-subtle pt-4">
              <p className="text-xs tracking-[0.16em] text-text-muted uppercase">{modalState.card.timeline}</p>
              <p className="mt-2 text-base font-semibold text-text-primary">{modalState.card.price}</p>
            </div>
          </div>
        ) : null}
        {modalState?.type === "solution" ? (
          <div className="space-y-4 text-sm leading-relaxed text-text-secondary">
            <p>{modalState.card.problem}</p>
            <p>
              <span className="font-semibold text-text-primary">
                {locale === "he" ? "מה עושים:" : "What we do:"}
              </span>{" "}
              {modalState.card.whatWeDo}
            </p>
            <p>
              <span className="font-semibold text-text-primary">
                {locale === "he" ? "תוצאה:" : "Outcome:"}
              </span>{" "}
              {modalState.card.outcome}
            </p>
            <div className="border-t border-border-subtle pt-4">
              <p className="text-xs tracking-[0.16em] text-text-muted uppercase">{modalState.card.timeline}</p>
              <p className="mt-2 text-base font-semibold text-text-primary">{modalState.card.price}</p>
            </div>
          </div>
        ) : null}
      </CatalogDetailsModal>
    </>
  );
}
