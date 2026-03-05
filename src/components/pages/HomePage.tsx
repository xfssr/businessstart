"use client";

import { useMemo } from "react";

import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { CardModule } from "@/components/CardModule";
import { Container } from "@/components/Container";
import { Divider } from "@/components/Divider";
import { type ExamplesGalleryItem, ExamplesGallery } from "@/components/ExamplesGallery";
import { Grid } from "@/components/Grid";
import { LeadForm } from "@/components/LeadForm";
import { Section } from "@/components/Section";
import { HeroBackdrop } from "@/components/visual/HeroBackdrop";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { useLocale } from "@/components/LocaleProvider";
import { DEFAULT_SITE_URL } from "@/lib/constants";

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

type GlobalContact = {
  email?: string;
  instagram?: string;
  phone?: string;
  whatsappNumber?: string;
};

type SolutionCard = {
  outcome: string;
  problem: string;
  slug: string;
  title: string;
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

function normalizeInstagram(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  return `https://instagram.com/${trimmed.replace(/^@/, "")}`;
}

function sanitizeHeroCtaLabel(label: string, fallback: string) {
  const trimmed = label.trim();
  if (!trimmed) return fallback;
  if (/whats\s*app|whatsapp|וואטסאפ|ווטסאפ|ואטסאפ/i.test(trimmed)) return fallback;
  return trimmed;
}

export function HomePage() {
  const { get, locale, t } = useLocale();

  const whatWeDoPillars = (get<ListItem[]>("whatWeDo.pillars") || []).slice(0, 3);
  const processSteps = (get<Step[]>("process.steps") || []).slice(0, 3);
  const faqItems = get<FaqItem[]>("faq.items");
  const contactChannels = get<ContactChannel[]>("contact.channels") || [];
  const contactForm = get<ContactFormLabels>("contact.form");
  const solutions = get<SolutionCard[]>("solutionsPage.cards") || [];
  const globalContact = get<GlobalContact>("global") || {};
  const examplesGallery = get<ExamplesGallerySection>("examplesGallery");
  const mediaCategories = get<Record<string, string>>("mediaCategories") || {};
  const heroCollageLabel = get<string>("hero.collageLabel") || "";
  const heroCollageTags = get<string[]>("hero.collageTags") || [];
  const solutionsPrompt = get<SolutionsPromptSection>("solutionsPrompt");

  const examplesGalleryItems = (examplesGallery?.items ?? [])
    .filter((item) => item.src)
    .sort((left, right) => (left.order ?? 100) - (right.order ?? 100));
  const heroCollageFallbackItems: ExamplesGalleryItem[] = [
    {
      title: "Social content flow",
      subtitle: "",
      category: "socialContent",
      mediaType: "image",
      src: "/portfolio/helix.svg",
      alt: "Social media content",
      order: 1,
    },
    {
      title: "Video production",
      subtitle: "",
      category: "",
      mediaType: "video",
      src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      poster: "/portfolio/nera.svg",
      alt: "Video content",
      order: 2,
    },
    {
      title: "Photo assets",
      subtitle: "",
      category: "",
      mediaType: "image",
      src: "/portfolio/axis.svg",
      alt: "Photo assets",
      order: 3,
    },
    {
      title: "Ad creatives",
      subtitle: "",
      category: "",
      mediaType: "image",
      src: "/portfolio/nera.svg",
      alt: "Ad creatives",
      order: 4,
    },
    {
      title: "Campaign launch",
      subtitle: "",
      category: "",
      mediaType: "image",
      src: "/portfolio/helix.svg",
      alt: "Campaign launch visuals",
      order: 5,
    },
  ];
  const heroCollageItems = [...examplesGalleryItems, ...heroCollageFallbackItems].slice(0, 5);
  const heroCollageEntryOffset = locale === "he" ? "-34px" : "34px";
  const heroCopyEntryOffset = locale === "he" ? "34px" : "-34px";
  const isHebrew = locale === "he";
  const heroTextClass = locale === "he" ? "text-right" : "text-left";
  const heroButtonsClass = "justify-start";
  const heroCopyWidthClass = isHebrew ? "max-w-[22rem] sm:max-w-2xl" : "max-w-[22rem] sm:max-w-2xl";
  const heroHeadlineMobileClass = isHebrew ? "text-[1.55rem] leading-[1.22]" : "text-[1.6rem] leading-[1.22]";
  const heroBodyMobileClass = isHebrew ? "text-[0.88rem]" : "text-[0.9rem]";
  const heroButtonsTopClass = isHebrew ? "mt-4" : "mt-4";
  const heroPrimaryLabel = sanitizeHeroCtaLabel(t("hero.primaryCta"), isHebrew ? "לפתרונות" : "View Solutions");
  const heroSecondaryLabel = sanitizeHeroCtaLabel(
    t("hero.secondaryCta"),
    isHebrew ? "דוגמאות ומחירים" : "Examples & Pricing",
  );

  const promptCards = (solutionsPrompt?.cards?.length ? solutionsPrompt.cards : solutions)
    .filter((item) => item.slug)
    .slice(0, 3);

  const faqSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: (faqItems ?? []).map((item) => ({
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

      <section id="home" className="relative overflow-x-clip overflow-y-visible">
        <HeroBackdrop className="hero-viewport-block">
          <Container className="hero-safe-padding relative z-10 flex items-start max-w-none !px-0 sm:!px-0 lg:h-full lg:max-w-[1160px] lg:!px-8">
            <div className="grid w-full gap-4 sm:gap-7 lg:h-full lg:grid-cols-[1.06fr_0.94fr] lg:items-start lg:gap-8">
              <div
                className={`hero-copy-enter ${heroCopyWidthClass} ${heroTextClass} flex w-full min-w-0 flex-col px-5 sm:px-8 lg:h-full lg:block lg:px-0`}
                dir={locale === "he" ? "rtl" : "ltr"}
                style={{ ["--hero-copy-enter-x" as string]: heroCopyEntryOffset }}
              >
                <Badge>{t("hero.eyebrow")}</Badge>
                <h1
                  className={`mt-3 break-words [overflow-wrap:anywhere] font-display ${heroHeadlineMobileClass} text-text-primary sm:mt-5 sm:text-6xl sm:leading-tight`}
                >
                  {t("hero.title")}
                </h1>
                <p
                  className={`mt-3 max-w-xl break-words [overflow-wrap:anywhere] ${heroBodyMobileClass} leading-relaxed text-text-secondary sm:mt-5 sm:text-xl`}
                >
                  {t("hero.description")}
                </p>
                <div
                  className={`${heroButtonsTopClass} sm:mt-8 lg:mt-20 flex flex-wrap items-center gap-2.5 sm:gap-3 ${heroButtonsClass}`}
                >
                  <Button
                    href={`/${locale}/solutions`}
                    className="min-h-11 shrink-0 px-4 text-[13px] leading-tight min-[420px]:px-4.5 sm:min-w-52 sm:min-h-12 sm:px-6 sm:text-sm"
                  >
                    {heroPrimaryLabel}
                  </Button>
                  <Button
                    href={`/${locale}/pricing`}
                    variant="secondary"
                    className="min-h-11 shrink-0 px-4 text-[13px] leading-tight min-[420px]:px-4.5 sm:min-w-44 sm:min-h-12 sm:px-6 sm:text-sm"
                  >
                    {heroSecondaryLabel}
                  </Button>
                </div>
                {heroCollageItems.length ? (
                  <div className="-mx-5 mt-3 sm:-mx-8 sm:mt-6 lg:hidden">
                    {heroCollageLabel ? (
                      <p className="mb-2 px-5 text-[11px] tracking-[0.14em] text-text-label uppercase sm:px-8">{heroCollageLabel}</p>
                    ) : null}
                    <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 sm:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {heroCollageItems.map((item, index) => {
                        const isVideo = item.mediaType === "video" || item.src.toLowerCase().includes(".mp4");
                        const tagLabel =
                          heroCollageTags[index] ||
                          (item.category ? mediaCategories[item.category] || item.category : "") ||
                          (isVideo ? "Video" : "Photo");
                        const tileWidthClass =
                          index === 0
                            ? "w-[calc(100vw-3rem)] max-w-[26rem] h-[54vw] max-h-[15rem]"
                            : "w-[calc(100vw-5rem)] max-w-[22rem] h-[47vw] max-h-[13rem]";

                        return (
                          <figure
                            key={`mobile-${item.title}-${index}`}
                            data-testid="hero-mobile-example-item"
                            className={`hero-collage-item relative shrink-0 snap-start overflow-hidden rounded-2xl border border-white/14 bg-black/20 ${tileWidthClass}`}
                            style={{
                              ["--hero-collage-delay" as string]: `${index * 0.16}s`,
                              ["--hero-collage-enter-x" as string]: heroCollageEntryOffset,
                            }}
                          >
                            {isVideo ? (
                              <video
                                src={item.src}
                                poster={item.poster}
                                className="h-full w-full object-cover"
                                autoPlay
                                muted
                                loop
                                playsInline
                              />
                            ) : (
                              // Using native img keeps support for admin-provided image URLs without remote loader config.
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={item.src} alt={item.alt} className="h-full w-full object-cover" loading="lazy" />
                            )}
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/72 via-black/18 to-transparent" />
                            {tagLabel ? (
                              <span className="absolute top-2 start-2 rounded-full border border-white/18 bg-black/40 px-2 py-0.5 text-[10px] font-semibold tracking-[0.12em] text-white/90 uppercase">
                                {tagLabel}
                              </span>
                            ) : null}
                          </figure>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </div>

              {heroCollageItems.length ? (
                <div className="mt-8 hidden lg:block xl:mt-10">
                  <div className="ms-auto max-w-[430px]">
                    {heroCollageLabel ? (
                      <p className="mb-3 text-[11px] tracking-[0.14em] text-text-label uppercase">{heroCollageLabel}</p>
                    ) : null}
                    <div className="grid grid-cols-2 gap-2.5">
                      {heroCollageItems.map((item, index) => {
                        const isVideo = item.mediaType === "video" || item.src.toLowerCase().includes(".mp4");
                        const tagLabel =
                          heroCollageTags[index] ||
                          (item.category ? mediaCategories[item.category] || item.category : "") ||
                          (isVideo ? "Video" : "Photo");
                        const tileClass =
                          index === 0
                            ? "col-span-2 h-40"
                            : index === 1
                              ? "h-36"
                              : "h-28";

                        return (
                          <figure
                            key={`${item.title}-${index}`}
                            data-testid="hero-collage-item"
                            className={`hero-collage-item group relative overflow-hidden rounded-[18px] border border-white/14 bg-black/20 ${tileClass}`}
                            style={{
                              ["--hero-collage-delay" as string]: `${index * 0.26}s`,
                              ["--hero-collage-enter-x" as string]: heroCollageEntryOffset,
                            }}
                          >
                            {isVideo ? (
                              <video
                                src={item.src}
                                poster={item.poster}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                autoPlay
                                muted
                                loop
                                playsInline
                              />
                            ) : (
                              // Using native img keeps support for admin-provided image URLs without remote loader config.
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={item.src}
                                alt={item.alt}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                loading="lazy"
                              />
                            )}
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                            {tagLabel ? (
                              <span className="absolute top-2 start-2 rounded-full border border-white/18 bg-black/40 px-2 py-0.5 text-[10px] font-semibold tracking-[0.12em] text-white/90 uppercase">
                                {tagLabel}
                              </span>
                            ) : null}
                          </figure>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </Container>
        </HeroBackdrop>
      </section>

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
        <Grid cols={3}>
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
        id="contact"
        eyebrow={t("contact.eyebrow")}
        title={t("contact.title")}
        description={t("contact.description")}
      >
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <CardModule className="space-y-5">
            <div className="flex flex-wrap gap-3">
              <WhatsAppLink label={t("contact.primaryCta")} message={t("whatsapp.prefill")} className="min-w-52" />
            </div>
            <LeadForm labels={contactForm} />
          </CardModule>
          {contactChannels.length ? (
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
          ) : null}
        </div>
      </Section>
    </>
  );
}
