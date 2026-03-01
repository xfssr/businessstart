import "server-only";

import { cache } from "react";

import { groq } from "next-sanity";

import { DEFAULT_LOCALE, type Locale } from "@/lib/constants";
import { messageCatalog, type Messages } from "@/lib/i18n";
import { isSanityConfigured, sanityClient } from "@/sanity/lib/client";

type LocalizedValue =
  | string
  | null
  | undefined
  | {
      he?: string | null;
      en?: string | null;
    };

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
  category?: string;
  cardType?: "standard" | "solution";
  deliverables?: LocalizedValue[];
  deliveryTime?: LocalizedValue;
  priceFrom?: string;
  seo?: {
    title?: LocalizedValue;
    description?: LocalizedValue;
    canonical?: LocalizedValue;
    noindex?: boolean;
    ogImage?: { asset?: { url?: string } };
  };
  order?: number;
  isFeatured?: boolean;
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
    canonical?: LocalizedValue;
    noindex?: boolean;
    ogImage?: { asset?: { url?: string } };
  };
  order?: number;
  isFeatured?: boolean;
};

type CmsSnapshot = {
  global?: {
    whatsappNumber?: string;
    phone?: string;
    email?: string;
    socialLinks?: Array<{ platform?: string; url?: string }>;
  };
  navigation?: {
    items?: Array<{
      label?: LocalizedValue;
      href?: LocalizedValue;
      order?: number;
    }>;
    primaryCtaLabel?: LocalizedValue;
    primaryCtaHref?: LocalizedValue;
    secondaryCtaLabel?: LocalizedValue;
    secondaryCtaHref?: LocalizedValue;
  };
  home?: {
    heroEyebrow?: LocalizedValue;
    heroTitle?: LocalizedValue;
    heroDescription?: LocalizedValue;
    heroTrust?: LocalizedValue;
    heroPrimaryCta?: LocalizedValue;
    heroSecondaryCta?: LocalizedValue;
    whoTitle?: LocalizedValue;
    whoDescription?: LocalizedValue;
    howTitle?: LocalizedValue;
    howDescription?: LocalizedValue;
    benefitsTitle?: LocalizedValue;
    benefitsDescription?: LocalizedValue;
    ctaTitle?: LocalizedValue;
    ctaDescription?: LocalizedValue;
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
  title: string;
  description: string;
  bullets: string[];
  price: string;
  slug: string;
  alternateSlug: string;
  type: "service" | "solution";
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
      title: "צילום אוכל לעסקים שמוכרים חוויה",
      description: "צילום מנות, מוצרים ונראות עסקית למסעדות, קפה וקייטרינג.",
      bullets: ["צילום מנות מקצועי", "עריכת תמונה לרשת", "קבצים לאתר ורשתות"],
      price: "החל מ-1,800 ₪",
      seoTitle: "צילום אוכל לעסקים | Business Start Studio",
      seoDescription: "שירות צילום אוכל ומוצר למסעדות ובתי קפה עם מיקוד תוצאה עסקית.",
    },
    {
      id: "svc-reels",
      type: "service",
      slug: "reels-content",
      alternateSlug: "reels-content",
      title: "תוכן Reels שמביא תשומת לב ופניות",
      description: "הפקת וידאו קצר לעסקים שרוצים חשיפה ותנועה לפנייה.",
      bullets: ["צילום יום מרוכז", "עריכת וידאו קצר", "גרסאות לרשתות"],
      price: "החל מ-1,500 ₪",
      seoTitle: "תוכן רילס לעסקים | Business Start Studio",
      seoDescription: "חבילת וידאו קצר לרשתות חברתיות עם מיקוד בפניות ראשונות.",
    },
    {
      id: "svc-mini-site",
      type: "service",
      slug: "mini-site-for-business",
      alternateSlug: "mini-site-for-business",
      title: "מיני-אתר עסקי שמסביר וממיר",
      description: "דף שירות מהיר עם מסר ברור וכפתור WhatsApp לפניות.",
      bullets: ["עמוד מותאם לנייד", "ניסוח מסר שירות", "קריאה לפעולה ברורה"],
      price: "החל מ-2,200 ₪",
      seoTitle: "מיני-אתר לעסק | Business Start Studio",
      seoDescription: "בניית דף שירות/מיני-אתר לעסקים שרוצים פניות ברורות יותר.",
    },
    {
      id: "sol-qr",
      type: "solution",
      slug: "qr-menu",
      alternateSlug: "qr-menu",
      title: "פתרון QR Menu למסעדות",
      description: "תפריט QR + דף שירות + WhatsApp להזמנות ופניות.",
      bullets: ["קישור תפריט מהיר", "דף מותאם מובייל", "מסלול ברור להזמנה"],
      price: "החל מ-2,500 ₪",
      seoTitle: "QR Menu + Mini Site | Business Start Studio",
      seoDescription: "פתרון QR ותפריט דיגיטלי למסעדות עם פוקוס על הזמנה ופנייה.",
    },
    {
      id: "sol-beauty",
      type: "solution",
      slug: "beauty-booking",
      alternateSlug: "beauty-booking",
      title: "מערכת הזמנות לעסקי ביוטי",
      description: "תוכן, עמוד הזמנה ונכסי פרסום לקליניקות וביוטי.",
      bullets: ["תוכן לפני/אחרי", "עמוד הזמנה", "קריאייטיב פרסומי"],
      price: "החל מ-2,800 ₪",
      seoTitle: "Beauty Booking Setup | Business Start Studio",
      seoDescription: "פתרון הזמנות ופרסום לעסקי ביוטי עם מיקוד בפניות רלוונטיות.",
    },
  ],
  en: [
    {
      id: "svc-food",
      type: "service",
      slug: "food-photography",
      alternateSlug: "food-photography",
      title: "Food photography built for conversion",
      description: "Professional food and product visuals for restaurants and hospitality.",
      bullets: ["Menu-focused photo set", "Social-ready edits", "Web-ready exports"],
      price: "From 1,800 ILS",
      seoTitle: "Food Photography Services | Business Start Studio",
      seoDescription: "Food and product photography for businesses that need stronger trust and response.",
    },
    {
      id: "svc-reels",
      type: "service",
      slug: "reels-content",
      alternateSlug: "reels-content",
      title: "Reels content for visibility and inquiries",
      description: "Short-form videos designed for social reach and commercial intent.",
      bullets: ["Focused content day", "Short edits", "Platform-ready versions"],
      price: "From 1,500 ILS",
      seoTitle: "Reels Content Services | Business Start Studio",
      seoDescription: "Short-form content package for first inquiries and faster launch.",
    },
    {
      id: "svc-mini-site",
      type: "service",
      slug: "mini-site-for-business",
      alternateSlug: "mini-site-for-business",
      title: "Mini site for booking or WhatsApp",
      description: "A clear service page that explains your offer and gets action.",
      bullets: ["Mobile-first service page", "Commercial message structure", "Clear CTA flow"],
      price: "From 2,200 ILS",
      seoTitle: "Mini Site for Business | Business Start Studio",
      seoDescription: "Mini website setup for businesses that need a clear lead funnel.",
    },
    {
      id: "sol-qr",
      type: "solution",
      slug: "qr-menu",
      alternateSlug: "qr-menu",
      title: "QR menu and mini-site setup",
      description: "QR route, service page, and WhatsApp action for hospitality businesses.",
      bullets: ["Fast scan-to-action flow", "Mobile mini-page", "Direct inquiry path"],
      price: "From 2,500 ILS",
      seoTitle: "QR Menu Solution | Business Start Studio",
      seoDescription: "QR menu and mini-site solution for restaurants and cafes.",
    },
    {
      id: "sol-beauty",
      type: "solution",
      slug: "beauty-booking",
      alternateSlug: "beauty-booking",
      title: "Beauty booking launch package",
      description: "Content + booking page + campaign assets for beauty brands.",
      bullets: ["Before/after content", "Booking page", "Ad-ready creatives"],
      price: "From 2,800 ILS",
      seoTitle: "Beauty Booking Flow | Business Start Studio",
      seoDescription: "Booking-focused solution for clinics and beauty services.",
    },
  ],
};

function pickLocalized(value: LocalizedValue, locale: Locale): string {
  if (typeof value === "string") {
    return value;
  }

  if (!value || typeof value !== "object") {
    return "";
  }

  const localized = value[locale];
  if (localized && typeof localized === "string") {
    return localized;
  }

  return (value.en as string) || (value.he as string) || "";
}

function pickLocalizedArray(values: LocalizedValue[] | undefined, locale: Locale): string[] {
  return (values ?? [])
    .map((item) => pickLocalized(item, locale))
    .filter((item): item is string => Boolean(item));
}

function pickSlug(slug: LocalizedSlug | undefined, locale: Locale): string {
  const localized = slug?.[locale]?.current;
  if (localized) {
    return localized;
  }

  const fallbackLocale = locale === "he" ? "en" : "he";
  return slug?.[fallbackLocale]?.current ?? "";
}

function pickAlternateSlug(slug: LocalizedSlug | undefined, locale: Locale): string {
  const alternateLocale = locale === "he" ? "en" : "he";
  const alternate = slug?.[alternateLocale]?.current;
  if (alternate) {
    return alternate;
  }

  return pickSlug(slug, locale);
}

function findPage(snapshot: CmsSnapshot | null, pageKey: string) {
  return snapshot?.pages?.find((page) => page.pageKey === pageKey);
}

const getCmsSnapshot = cache(async (): Promise<CmsSnapshot | null> => {
  if (!isSanityConfigured()) {
    return null;
  }

  try {
    const data = await sanityClient.fetch<CmsSnapshot>(CMS_QUERY, {}, { next: { revalidate: 120 } });
    return data ?? null;
  } catch {
    return null;
  }
});

export const getLocaleMessages = cache(async (locale: Locale): Promise<Messages> => {
  const content = structuredClone(messageCatalog[locale]) as Messages & Record<string, unknown>;
  const snapshot = await getCmsSnapshot();

  if (!snapshot) {
    return content;
  }

  const pageServices = findPage(snapshot, "services");
  const pageSolutions = findPage(snapshot, "solutions");
  const pagePricing = findPage(snapshot, "pricing");
  const pagePortfolio = findPage(snapshot, "portfolio");
  const pageAbout = findPage(snapshot, "about");
  const pageContact = findPage(snapshot, "contact");

  if (snapshot.navigation?.items?.length) {
    content.nav.links = [...snapshot.navigation.items]
      .sort((a, b) => (a.order ?? 100) - (b.order ?? 100))
      .map((item) => ({
        label: pickLocalized(item.label, locale),
        path: pickLocalized(item.href, locale) || "/",
      }));
  }

  content.nav.primaryCta = pickLocalized(snapshot.navigation?.primaryCtaLabel, locale) || "WhatsApp";
  content.nav.primaryCtaHref = pickLocalized(snapshot.navigation?.primaryCtaHref, locale) || "";
  content.nav.secondaryCta =
    pickLocalized(snapshot.navigation?.secondaryCtaLabel, locale) ||
    (locale === "he" ? "בקשת הצעה" : "Get a quote");
  content.nav.secondaryCtaHref = pickLocalized(snapshot.navigation?.secondaryCtaHref, locale) || "/contact";

  if (snapshot.home) {
    content.hero.eyebrow = pickLocalized(snapshot.home.heroEyebrow, locale) || content.hero.eyebrow;
    content.hero.title = pickLocalized(snapshot.home.heroTitle, locale) || content.hero.title;
    content.hero.description = pickLocalized(snapshot.home.heroDescription, locale) || content.hero.description;
    content.hero.trust = pickLocalized(snapshot.home.heroTrust, locale) || content.hero.trust;
    content.hero.primaryCta = pickLocalized(snapshot.home.heroPrimaryCta, locale) || content.hero.primaryCta;
    content.hero.secondaryCta = pickLocalized(snapshot.home.heroSecondaryCta, locale) || content.hero.secondaryCta;
    content.whatWeDo.title = pickLocalized(snapshot.home.whoTitle, locale) || content.whatWeDo.title;
    content.whatWeDo.description =
      pickLocalized(snapshot.home.whoDescription, locale) || content.whatWeDo.description;
    content.process.title = pickLocalized(snapshot.home.howTitle, locale) || content.process.title;
    content.process.description = pickLocalized(snapshot.home.howDescription, locale) || content.process.description;
    content.outcomes.title = pickLocalized(snapshot.home.benefitsTitle, locale) || content.outcomes.title;
    content.outcomes.description =
      pickLocalized(snapshot.home.benefitsDescription, locale) || content.outcomes.description;
    content.cta.title = pickLocalized(snapshot.home.ctaTitle, locale) || content.cta.title;
    content.cta.description = pickLocalized(snapshot.home.ctaDescription, locale) || content.cta.description;
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
    content.servicesPage.solutionCards = services
      .filter((service) => service.cardType === "solution")
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

  const portfolioFallback = ["/portfolio/helix.svg", "/portfolio/nera.svg", "/portfolio/axis.svg"];
  const portfolio = [...(snapshot.portfolio ?? [])]
    .sort((a, b) => (a.displayOrder ?? 100) - (b.displayOrder ?? 100))
    .map((item, index) => ({
      title: pickLocalized(item.title, locale),
      subtitle: pickLocalized(item.shortDescription, locale) || pickLocalized(item.clientType, locale),
      metric: item.category || "Case",
      alt: pickLocalized(item.title, locale),
      visual: item.media?.[0]?.asset?.url || portfolioFallback[index % portfolioFallback.length],
    }));
  if (portfolio.length) {
    content.portfolio.items = portfolio;
  }

  const faq = [...(snapshot.faq ?? [])]
    .sort((a, b) => (a.displayOrder ?? 100) - (b.displayOrder ?? 100))
    .map((item) => ({
      question: pickLocalized(item.question, locale),
      answer: pickLocalized(item.answer, locale),
    }))
    .filter((item) => item.question && item.answer);
  if (faq.length) {
    content.faq.items = faq;
  }

  content.contact.channels = [
    { label: "WhatsApp", value: snapshot.global?.whatsappNumber || content.contact.channels[0]?.value },
    { label: locale === "he" ? "טלפון" : "Phone", value: snapshot.global?.phone || "" },
    { label: "Email", value: snapshot.global?.email || "" },
  ].filter((channel) => channel.value);
  content.global = { whatsappNumber: snapshot.global?.whatsappNumber };

  if (pageServices) {
    content.servicesPage.metaTitle =
      pickLocalized(pageServices.seo?.title, locale) || content.servicesPage.metaTitle;
    content.servicesPage.metaDescription =
      pickLocalized(pageServices.seo?.description, locale) || content.servicesPage.metaDescription;
    content.servicesPage.eyebrow = pickLocalized(pageServices.eyebrow, locale) || content.servicesPage.eyebrow;
    content.servicesPage.title = pickLocalized(pageServices.title, locale) || content.servicesPage.title;
    content.servicesPage.description =
      pickLocalized(pageServices.description, locale) || content.servicesPage.description;
  }

  if (pageSolutions) {
    content.solutionsPage.metaTitle =
      pickLocalized(pageSolutions.seo?.title, locale) || content.solutionsPage.metaTitle;
    content.solutionsPage.metaDescription =
      pickLocalized(pageSolutions.seo?.description, locale) || content.solutionsPage.metaDescription;
    content.solutionsPage.eyebrow = pickLocalized(pageSolutions.eyebrow, locale) || content.solutionsPage.eyebrow;
    content.solutionsPage.title = pickLocalized(pageSolutions.title, locale) || content.solutionsPage.title;
    content.solutionsPage.description =
      pickLocalized(pageSolutions.description, locale) || content.solutionsPage.description;
  }

  if (pagePricing) {
    content.pricingPage.metaTitle = pickLocalized(pagePricing.seo?.title, locale) || content.pricingPage.metaTitle;
    content.pricingPage.metaDescription =
      pickLocalized(pagePricing.seo?.description, locale) || content.pricingPage.metaDescription;
    content.pricingPage.eyebrow = pickLocalized(pagePricing.eyebrow, locale) || content.pricingPage.eyebrow;
    content.pricingPage.title = pickLocalized(pagePricing.title, locale) || content.pricingPage.title;
    content.pricingPage.description =
      pickLocalized(pagePricing.description, locale) || content.pricingPage.description;
  }

  if (pagePortfolio) {
    content.portfolioPage.metaTitle =
      pickLocalized(pagePortfolio.seo?.title, locale) || content.portfolioPage.metaTitle;
    content.portfolioPage.metaDescription =
      pickLocalized(pagePortfolio.seo?.description, locale) || content.portfolioPage.metaDescription;
    content.portfolioPage.eyebrow = pickLocalized(pagePortfolio.eyebrow, locale) || content.portfolioPage.eyebrow;
    content.portfolioPage.title = pickLocalized(pagePortfolio.title, locale) || content.portfolioPage.title;
    content.portfolioPage.description =
      pickLocalized(pagePortfolio.description, locale) || content.portfolioPage.description;
  }

  if (pageAbout) {
    content.aboutPage.metaTitle = pickLocalized(pageAbout.seo?.title, locale) || content.aboutPage.metaTitle;
    content.aboutPage.metaDescription =
      pickLocalized(pageAbout.seo?.description, locale) || content.aboutPage.metaDescription;
    content.aboutPage.eyebrow = pickLocalized(pageAbout.eyebrow, locale) || content.aboutPage.eyebrow;
    content.aboutPage.title = pickLocalized(pageAbout.title, locale) || content.aboutPage.title;
    content.aboutPage.description = pickLocalized(pageAbout.description, locale) || content.aboutPage.description;
  }

  if (pageContact) {
    content.contactPage.metaTitle = pickLocalized(pageContact.seo?.title, locale) || content.contactPage.metaTitle;
    content.contactPage.metaDescription =
      pickLocalized(pageContact.seo?.description, locale) || content.contactPage.metaDescription;
    content.contactPage.eyebrow = pickLocalized(pageContact.eyebrow, locale) || content.contactPage.eyebrow;
    content.contactPage.title = pickLocalized(pageContact.title, locale) || content.contactPage.title;
    content.contactPage.description =
      pickLocalized(pageContact.description, locale) || content.contactPage.description;
  }

  return content;
});

export async function getServiceLanding(locale: Locale, slug: string): Promise<LandingPageData | null> {
  const snapshot = await getCmsSnapshot();
  const match = snapshot?.services?.find((service) => pickSlug(service.slug, locale) === slug);

  if (match) {
    const localizedTitle = pickLocalized(match.title, locale);
    const localizedDescription =
      pickLocalized(match.fullDescription, locale) || pickLocalized(match.shortDescription, locale);
    return {
      id: match._id,
      type: "service",
      slug: pickSlug(match.slug, locale),
      alternateSlug: pickAlternateSlug(match.slug, locale),
      title: localizedTitle,
      description: localizedDescription,
      bullets: pickLocalizedArray(match.deliverables, locale).slice(0, 6),
      price: match.priceFrom || "",
      seoTitle: pickLocalized(match.seo?.title, locale) || localizedTitle,
      seoDescription: pickLocalized(match.seo?.description, locale) || localizedDescription,
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
    const localizedTitle = pickLocalized(match.title, locale);
    const localizedDescription = pickLocalized(match.outcome, locale) || pickLocalized(match.problem, locale);
    return {
      id: match._id,
      type: "solution",
      slug: pickSlug(match.slug, locale),
      alternateSlug: pickAlternateSlug(match.slug, locale),
      title: localizedTitle,
      description: localizedDescription,
      bullets: pickLocalizedArray(match.includedItems, locale).slice(0, 6),
      price: match.priceFrom || "",
      seoTitle: pickLocalized(match.seo?.title, locale) || localizedTitle,
      seoDescription: pickLocalized(match.seo?.description, locale) || localizedDescription,
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
    .map((service) => ({
      he: pickSlug(service.slug, "he"),
      en: pickSlug(service.slug, "en"),
    }))
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
    .map((solution) => ({
      he: pickSlug(solution.slug, "he"),
      en: pickSlug(solution.slug, "en"),
    }))
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
