import "server-only";

import { cache } from "react";
import { groq } from "next-sanity";

import { DEFAULT_LOCALE, type Locale } from "@/lib/constants";
import { messageCatalog, type Messages } from "@/lib/i18n";
import { getStartStudioContent } from "@/lib/startstudio";
import { isSanityConfigured, sanityClient } from "@/sanity/lib/client";

type LocalizedValue = string | null | undefined | { he?: string | null; en?: string | null };
type LocalizedSlug = {
  he?: { current?: string | null } | null;
  en?: { current?: string | null } | null;
} | null;

type CmsService = {
  _id: string;
  title?: LocalizedValue;
  slug?: LocalizedSlug;
  subtitle?: LocalizedValue;
  shortValue?: LocalizedValue;
  shortDescription?: LocalizedValue;
  fullDescription?: LocalizedValue;
  cardType?: "standard" | "solution";
  deliverables?: LocalizedValue[];
  deliveryTime?: LocalizedValue;
  priceFrom?: string;
  seo?: {
    title?: LocalizedValue;
    description?: LocalizedValue;
    noindex?: boolean;
    ogImage?: { asset?: { url?: string } };
  };
  order?: number;
};

type CmsSolution = {
  _id: string;
  title?: LocalizedValue;
  slug?: LocalizedSlug;
  problem?: LocalizedValue;
  outcome?: LocalizedValue;
  includedItems?: LocalizedValue[];
  deliveryTime?: LocalizedValue;
  priceFrom?: string;
  seo?: {
    title?: LocalizedValue;
    description?: LocalizedValue;
    noindex?: boolean;
    ogImage?: { asset?: { url?: string } };
  };
  order?: number;
};

type CmsSnapshot = {
  global?: {
    whatsappNumber?: string;
    phone?: string;
    email?: string;
  };
  navigation?: {
    items?: Array<{
      label?: LocalizedValue;
      href?: LocalizedValue;
      order?: number;
    }>;
    primaryCtaLabel?: LocalizedValue;
    secondaryCtaLabel?: LocalizedValue;
    secondaryCtaHref?: LocalizedValue;
  };
  home?: {
    heroTitle?: LocalizedValue;
    heroDescription?: LocalizedValue;
    heroPrimaryCta?: LocalizedValue;
    heroSecondaryCta?: LocalizedValue;
  };
  pages?: Array<{
    pageKey?: string;
    eyebrow?: LocalizedValue;
    title?: LocalizedValue;
    description?: LocalizedValue;
    seo?: {
      title?: LocalizedValue;
      description?: LocalizedValue;
    };
  }>;
  services?: CmsService[];
  solutions?: CmsSolution[];
  packages?: Array<{
    name?: LocalizedValue;
    summary?: LocalizedValue;
    whoFor?: LocalizedValue;
    features?: LocalizedValue[];
    price?: string;
    active?: boolean;
    displayOrder?: number;
  }>;
  portfolio?: Array<{
    title?: LocalizedValue;
    category?: string;
    clientType?: LocalizedValue;
    shortDescription?: LocalizedValue;
    media?: Array<{ asset?: { url?: string } }>;
    displayOrder?: number;
  }>;
  faq?: Array<{
    question?: LocalizedValue;
    answer?: LocalizedValue;
    displayOrder?: number;
  }>;
};

export type LandingPageData = {
  id: string;
  type: "service" | "solution";
  slug: string;
  alternateSlug: string;
  title: string;
  description: string;
  bullets: string[];
  price: string;
  seoTitle: string;
  seoDescription: string;
  noindex?: boolean;
  ogImage?: string;
};

const CMS_QUERY = groq`{
  "global": *[_type == "globalSettings"][0],
  "navigation": *[_type == "navigation"][0],
  "home": *[_type == "homePage"][0],
  "pages": *[_type == "pageContent"],
  "services": *[_type == "service"] | order(order asc, _createdAt asc),
  "solutions": *[_type == "solution"] | order(order asc, _createdAt asc),
  "packages": *[_type == "package"] | order(displayOrder asc, _createdAt asc),
  "portfolio": *[_type == "portfolioProject"] | order(displayOrder asc, _createdAt asc),
  "faq": *[_type == "faqItem"] | order(displayOrder asc, _createdAt asc)
}`;

const fallbackLandingPages: Record<Locale, LandingPageData[]> = {
  he: [
    {
      id: "svc-food",
      type: "service",
      slug: "food-photography",
      alternateSlug: "food-photography",
      title: "צילום אוכל לעסק",
      description: "צילום מנות ומוצרים למסעדות ועסקי אוכל.",
      bullets: ["צילום מקצועי", "עריכה לרשת", "קבצים לאתר ורשתות"],
      price: "החל מ-1,800 ₪",
      seoTitle: "צילום אוכל לעסקים | Business Start Studio",
      seoDescription: "שירות צילום אוכל ומוצר לעסקים שרוצים נראות מקצועית.",
    },
    {
      id: "svc-reels",
      type: "service",
      slug: "reels-content",
      alternateSlug: "reels-content",
      title: "תוכן רילס לעסקים",
      description: "וידאו קצר לחשיפה ולפניות ראשונות.",
      bullets: ["יום צילום", "עריכה", "גרסאות לפלטפורמות"],
      price: "החל מ-1,500 ₪",
      seoTitle: "תוכן רילס לעסקים | Business Start Studio",
      seoDescription: "חבילת תוכן רילס לעסקים עם מיקוד בתוצאות.",
    },
    {
      id: "svc-mini",
      type: "service",
      slug: "mini-site-for-business",
      alternateSlug: "mini-site-for-business",
      title: "מיני-אתר לעסק",
      description: "עמוד שירות ברור עם WhatsApp לפניות.",
      bullets: ["עמוד מותאם מובייל", "מסר שירות", "CTA ברור"],
      price: "החל מ-2,200 ₪",
      seoTitle: "מיני-אתר לעסקים | Business Start Studio",
      seoDescription: "בניית מיני-אתר/עמוד שירות לעסקים מקומיים.",
    },
    {
      id: "sol-qr",
      type: "solution",
      slug: "qr-menu",
      alternateSlug: "qr-menu",
      title: "QR Menu + Mini Site",
      description: "פתרון למסעדות עם תפריט QR ועמוד פעולה.",
      bullets: ["קישור QR", "עמוד שירות", "WhatsApp"],
      price: "החל מ-2,500 ₪",
      seoTitle: "QR Menu פתרון למסעדות | Business Start Studio",
      seoDescription: "מערכת QR ותפריט דיגיטלי למסעדות וקפה.",
    },
    {
      id: "sol-beauty",
      type: "solution",
      slug: "beauty-booking",
      alternateSlug: "beauty-booking",
      title: "Beauty Booking Setup",
      description: "פתרון תוכן והזמנות לעסקי ביוטי.",
      bullets: ["תוכן לפני/אחרי", "עמוד הזמנה", "קידום"],
      price: "החל מ-2,800 ₪",
      seoTitle: "Beauty Booking לעסקי ביוטי | Business Start Studio",
      seoDescription: "פתרון הזמנות וקידום לעסקים בתחום הביוטי.",
    },
  ],
  en: [
    {
      id: "svc-food",
      type: "service",
      slug: "food-photography",
      alternateSlug: "food-photography",
      title: "Food photography for business",
      description: "Food and product visuals for hospitality businesses.",
      bullets: ["Professional shoot", "Social edits", "Web-ready files"],
      price: "From 1,800 ILS",
      seoTitle: "Food Photography Services | Business Start Studio",
      seoDescription: "Food and product photography for businesses.",
    },
    {
      id: "svc-reels",
      type: "service",
      slug: "reels-content",
      alternateSlug: "reels-content",
      title: "Reels content for businesses",
      description: "Short-form video for visibility and inquiry flow.",
      bullets: ["Content day", "Editing", "Platform formats"],
      price: "From 1,500 ILS",
      seoTitle: "Reels Content Services | Business Start Studio",
      seoDescription: "Short-form social content built for outcomes.",
    },
    {
      id: "svc-mini",
      type: "service",
      slug: "mini-site-for-business",
      alternateSlug: "mini-site-for-business",
      title: "Mini site for business",
      description: "Clear service page with WhatsApp CTA.",
      bullets: ["Mobile-first page", "Offer messaging", "Clear CTA"],
      price: "From 2,200 ILS",
      seoTitle: "Mini Site for Business | Business Start Studio",
      seoDescription: "Mini site setup for local businesses.",
    },
    {
      id: "sol-qr",
      type: "solution",
      slug: "qr-menu",
      alternateSlug: "qr-menu",
      title: "QR Menu + Mini Site",
      description: "Hospitality setup with QR menu and action page.",
      bullets: ["QR routing", "Service page", "WhatsApp action"],
      price: "From 2,500 ILS",
      seoTitle: "QR Menu Solution | Business Start Studio",
      seoDescription: "QR menu and mini-site setup for restaurants.",
    },
    {
      id: "sol-beauty",
      type: "solution",
      slug: "beauty-booking",
      alternateSlug: "beauty-booking",
      title: "Beauty booking setup",
      description: "Content and booking flow for beauty services.",
      bullets: ["Before/after visuals", "Booking page", "Ad assets"],
      price: "From 2,800 ILS",
      seoTitle: "Beauty Booking Flow | Business Start Studio",
      seoDescription: "Booking solution for clinics and beauty providers.",
    },
  ],
};

function pickLocalized(value: LocalizedValue, locale: Locale): string {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return "";
  return (value[locale] as string) || (value.en as string) || (value.he as string) || "";
}

function pickLocalizedArray(values: LocalizedValue[] | undefined, locale: Locale): string[] {
  return (values ?? []).map((item) => pickLocalized(item, locale)).filter(Boolean);
}

function pickSlug(slug: LocalizedSlug | undefined, locale: Locale): string {
  return (
    slug?.[locale]?.current ??
    slug?.[locale === "he" ? "en" : "he"]?.current ??
    ""
  );
}

function pickAlternateSlug(slug: LocalizedSlug | undefined, locale: Locale): string {
  return (
    slug?.[locale === "he" ? "en" : "he"]?.current ??
    pickSlug(slug, locale)
  );
}

function findPage(snapshot: CmsSnapshot, pageKey: string) {
  return snapshot.pages?.find((page) => page.pageKey === pageKey);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function mergeDeep(target: Record<string, unknown>, patch: Record<string, unknown>) {
  const output: Record<string, unknown> = { ...target };

  for (const [key, value] of Object.entries(patch)) {
    if (Array.isArray(value)) {
      output[key] = value;
      continue;
    }

    if (isRecord(value)) {
      const current = isRecord(output[key]) ? (output[key] as Record<string, unknown>) : {};
      output[key] = mergeDeep(current, value);
      continue;
    }

    output[key] = value;
  }

  return output;
}

const getCmsSnapshot = cache(async (): Promise<CmsSnapshot | null> => {
  if (!isSanityConfigured()) return null;
  try {
    return await sanityClient.fetch<CmsSnapshot>(CMS_QUERY, {}, { next: { revalidate: 120 } });
  } catch {
    return null;
  }
});

export const getLocaleMessages = cache(async (locale: Locale): Promise<Messages> => {
  const content = structuredClone(messageCatalog[locale]) as Messages & Record<string, unknown>;
  const [snapshot, startStudio] = await Promise.all([getCmsSnapshot(), getStartStudioContent()]);

  if (snapshot) {
    if (snapshot.navigation?.items?.length) {
      content.nav.links = [...snapshot.navigation.items]
        .sort((a, b) => (a.order ?? 100) - (b.order ?? 100))
        .map((item) => ({
          label: pickLocalized(item.label, locale),
          path: pickLocalized(item.href, locale) || "/",
        }));
    }

    const nav = content.nav as typeof content.nav & Record<string, string>;
    nav.primaryCta = pickLocalized(snapshot.navigation?.primaryCtaLabel, locale) || "WhatsApp";
    nav.secondaryCta =
      pickLocalized(snapshot.navigation?.secondaryCtaLabel, locale) ||
      (locale === "he" ? "בקשת הצעה" : "Get a quote");
    nav.secondaryCtaHref = pickLocalized(snapshot.navigation?.secondaryCtaHref, locale) || "/contact";

    if (snapshot.home) {
      content.hero.title = pickLocalized(snapshot.home.heroTitle, locale) || content.hero.title;
      content.hero.description = pickLocalized(snapshot.home.heroDescription, locale) || content.hero.description;
      content.hero.primaryCta = pickLocalized(snapshot.home.heroPrimaryCta, locale) || content.hero.primaryCta;
      content.hero.secondaryCta =
        pickLocalized(snapshot.home.heroSecondaryCta, locale) || content.hero.secondaryCta;
    }

    const services = (snapshot.services ?? []).map((service) => ({
      title: pickLocalized(service.title, locale),
      audience: pickLocalized(service.subtitle, locale),
      description:
        pickLocalized(service.shortValue, locale) || pickLocalized(service.shortDescription, locale),
      features: pickLocalizedArray(service.deliverables, locale),
      timeline: pickLocalized(service.deliveryTime, locale),
      price: service.priceFrom || "",
      slug: pickSlug(service.slug, locale),
      cardType: service.cardType ?? "standard",
    }));

    if (services.length) {
      content.services.items = services.slice(0, 8).map((service) => ({
        title: service.title,
        description: service.description,
      }));
      content.servicesPage.standardCards = services
        .filter((service) => service.cardType !== "solution")
        .map((service) => ({
          title: service.title,
          audience: service.audience,
          features: service.features.slice(0, 5),
          timeline: service.timeline,
          price: service.price,
          slug: service.slug,
        }));
    }

    const solutions = (snapshot.solutions ?? []).map((solution) => ({
      title: pickLocalized(solution.title, locale),
      fit: pickLocalized(solution.problem, locale),
      include: pickLocalizedArray(solution.includedItems, locale),
      price: solution.priceFrom || "",
      slug: pickSlug(solution.slug, locale),
    }));
    if (solutions.length) {
      content.solutionsPage.cards = solutions;
    }

    const packages = (snapshot.packages ?? [])
      .filter((item) => item.active !== false)
      .sort((a, b) => (a.displayOrder ?? 100) - (b.displayOrder ?? 100))
      .map((item) => ({
        title: pickLocalized(item.name, locale),
        audience: pickLocalized(item.whoFor, locale) || pickLocalized(item.summary, locale),
        features: pickLocalizedArray(item.features, locale),
        price: item.price || "",
      }));
    if (packages.length) {
      content.pricingPage.tiers = packages;
    }

    const fallbackVisuals = ["/portfolio/helix.svg", "/portfolio/nera.svg", "/portfolio/axis.svg"];
    const portfolioItems = [...(snapshot.portfolio ?? [])]
      .sort((a, b) => (a.displayOrder ?? 100) - (b.displayOrder ?? 100))
      .map((item, index) => {
        const visual = item.media?.[0]?.asset?.url || fallbackVisuals[index % fallbackVisuals.length];
        return {
          title: pickLocalized(item.title, locale),
          subtitle: pickLocalized(item.shortDescription, locale) || pickLocalized(item.clientType, locale),
          metric: item.category || "Case",
          alt: pickLocalized(item.title, locale),
          visual,
          mediaType: visual.toLowerCase().includes(".mp4") ? "video" : "image",
        };
      });
    if (portfolioItems.length) {
      content.portfolio.items = portfolioItems;
    }

    const faqItems = [...(snapshot.faq ?? [])]
      .sort((a, b) => (a.displayOrder ?? 100) - (b.displayOrder ?? 100))
      .map((item) => ({
        question: pickLocalized(item.question, locale),
        answer: pickLocalized(item.answer, locale),
      }))
      .filter((item) => item.question && item.answer);
    if (faqItems.length) {
      content.faq.items = faqItems;
    }

    content.contact.channels = [
      { label: "WhatsApp", value: snapshot.global?.whatsappNumber || content.contact.channels[0]?.value },
      { label: locale === "he" ? "טלפון" : "Phone", value: snapshot.global?.phone || "" },
      { label: "Email", value: snapshot.global?.email || "" },
    ].filter((channel) => channel.value);

    const pagesMap = {
      services: "servicesPage",
      solutions: "solutionsPage",
      pricing: "pricingPage",
      portfolio: "portfolioPage",
      about: "aboutPage",
      contact: "contactPage",
    } as const;

    for (const [key, messageKey] of Object.entries(pagesMap)) {
      const page = findPage(snapshot, key);
      if (!page) continue;
      const section = content[messageKey] as Record<string, unknown>;
      section.metaTitle = pickLocalized(page.seo?.title, locale) || (section.metaTitle as string);
      section.metaDescription = pickLocalized(page.seo?.description, locale) || (section.metaDescription as string);
      section.eyebrow = pickLocalized(page.eyebrow, locale) || (section.eyebrow as string);
      section.title = pickLocalized(page.title, locale) || (section.title as string);
      section.description = pickLocalized(page.description, locale) || (section.description as string);
    }

    const withGlobal = content as Messages & { global?: { whatsappNumber?: string } };
    withGlobal.global = { whatsappNumber: snapshot.global?.whatsappNumber };
  }

  const startStudioPatch = startStudio?.locales?.[locale]?.messages;
  if (isRecord(startStudioPatch)) {
    Object.assign(content, mergeDeep(content as Record<string, unknown>, startStudioPatch));
  }

  if (startStudio?.global?.whatsappNumber) {
    const withGlobal = content as Messages & { global?: { whatsappNumber?: string } };
    withGlobal.global = {
      ...(withGlobal.global ?? {}),
      whatsappNumber: startStudio.global.whatsappNumber,
    };
  }

  return content;
});

export async function getServiceLanding(locale: Locale, slug: string): Promise<LandingPageData | null> {
  const snapshot = await getCmsSnapshot();
  const match = snapshot?.services?.find((service) => pickSlug(service.slug, locale) === slug);

  if (match) {
    const title = pickLocalized(match.title, locale);
    const description = pickLocalized(match.fullDescription, locale) || pickLocalized(match.shortDescription, locale);
    return {
      id: match._id,
      type: "service",
      slug: pickSlug(match.slug, locale),
      alternateSlug: pickAlternateSlug(match.slug, locale),
      title,
      description,
      bullets: pickLocalizedArray(match.deliverables, locale).slice(0, 6),
      price: match.priceFrom || "",
      seoTitle: pickLocalized(match.seo?.title, locale) || title,
      seoDescription: pickLocalized(match.seo?.description, locale) || description,
      noindex: match.seo?.noindex,
      ogImage: match.seo?.ogImage?.asset?.url,
    };
  }

  return fallbackLandingPages[locale].find((item) => item.type === "service" && item.slug === slug) ?? null;
}

export async function getSolutionLanding(locale: Locale, slug: string): Promise<LandingPageData | null> {
  const snapshot = await getCmsSnapshot();
  const match = snapshot?.solutions?.find((solution) => pickSlug(solution.slug, locale) === slug);

  if (match) {
    const title = pickLocalized(match.title, locale);
    const description = pickLocalized(match.outcome, locale) || pickLocalized(match.problem, locale);
    return {
      id: match._id,
      type: "solution",
      slug: pickSlug(match.slug, locale),
      alternateSlug: pickAlternateSlug(match.slug, locale),
      title,
      description,
      bullets: pickLocalizedArray(match.includedItems, locale).slice(0, 6),
      price: match.priceFrom || "",
      seoTitle: pickLocalized(match.seo?.title, locale) || title,
      seoDescription: pickLocalized(match.seo?.description, locale) || description,
      noindex: match.seo?.noindex,
      ogImage: match.seo?.ogImage?.asset?.url,
    };
  }

  return fallbackLandingPages[locale].find((item) => item.type === "solution" && item.slug === slug) ?? null;
}

export async function getServiceLandingParams() {
  const snapshot = await getCmsSnapshot();
  if (!snapshot?.services?.length) {
    return fallbackLandingPages.he
      .filter((item) => item.type === "service")
      .flatMap((item) => [
        { locale: "he" as const, slug: item.slug },
        { locale: "en" as const, slug: item.alternateSlug },
      ]);
  }

  return snapshot.services
    .map((service) => ({ he: pickSlug(service.slug, "he"), en: pickSlug(service.slug, "en") }))
    .filter((item) => item.he && item.en)
    .flatMap((item) => [
      { locale: "he" as const, slug: item.he },
      { locale: "en" as const, slug: item.en },
    ]);
}

export async function getSolutionLandingParams() {
  const snapshot = await getCmsSnapshot();
  if (!snapshot?.solutions?.length) {
    return fallbackLandingPages.he
      .filter((item) => item.type === "solution")
      .flatMap((item) => [
        { locale: "he" as const, slug: item.slug },
        { locale: "en" as const, slug: item.alternateSlug },
      ]);
  }

  return snapshot.solutions
    .map((solution) => ({ he: pickSlug(solution.slug, "he"), en: pickSlug(solution.slug, "en") }))
    .filter((item) => item.he && item.en)
    .flatMap((item) => [
      { locale: "he" as const, slug: item.he },
      { locale: "en" as const, slug: item.en },
    ]);
}

export async function getLocaleDynamicPaths(locale: Locale) {
  const [serviceParams, solutionParams] = await Promise.all([
    getServiceLandingParams(),
    getSolutionLandingParams(),
  ]);

  return [
    ...serviceParams.filter((item) => item.locale === locale).map((item) => `/services/${item.slug}`),
    ...solutionParams.filter((item) => item.locale === locale).map((item) => `/solutions/${item.slug}`),
  ];
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === "he" ? "en" : DEFAULT_LOCALE;
}
