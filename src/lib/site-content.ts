import "server-only";

import { cache } from "react";

import { DEFAULT_LOCALE, type Locale } from "@/lib/constants";
import { messageCatalog, type Messages } from "@/lib/i18n";
import { getStartStudioContent } from "@/lib/startstudio";

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
  galleryItems?: Array<{ _ref?: string }>;
  gallery?: Array<{ asset?: { url?: string } }>;
  isHidden?: boolean;
  isFeatured?: boolean;
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
  galleryItems?: Array<{ _ref?: string }>;
  visuals?: Array<{ asset?: { url?: string } }>;
  whatWeDo?: LocalizedValue;
  isHidden?: boolean;
  isFeatured?: boolean;
  fit?: LocalizedValue;
  include?: LocalizedValue[];
  seo?: {
    title?: LocalizedValue;
    description?: LocalizedValue;
    noindex?: boolean;
    ogImage?: { asset?: { url?: string } };
  };
  order?: number;
};

type CmsTestimonial = {
  name?: string;
  business?: string;
  quote?: LocalizedValue;
  rating?: number;
  visible?: boolean;
  isHidden?: boolean;
  displayOrder?: number;
  order?: number;
};

type CmsSnapshot = {
  global?: {
    whatsappNumber?: string;
    phone?: string;
    email?: string;
    instagram?: string;
    socialLinks?: Array<{ platform?: string; url?: string }>;
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
    examplesGalleryEyebrow?: LocalizedValue;
    examplesGalleryTitle?: LocalizedValue;
    examplesGalleryDescription?: LocalizedValue;
    examplesGalleryItems?: Array<{ _ref?: string }>;
    solutionsPromptEyebrow?: LocalizedValue;
    solutionsPromptTitle?: LocalizedValue;
    solutionsPromptDescription?: LocalizedValue;
    solutionsPromptCta?: LocalizedValue;
    solutionsPromptItems?: Array<{ _ref?: string }>;
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
    isHidden?: boolean;
    isFeatured?: boolean;
    displayOrder?: number;
    order?: number;
  }>;
  portfolio?: Array<{
    title?: LocalizedValue;
    category?: string;
    clientType?: LocalizedValue;
    shortDescription?: LocalizedValue;
    galleryItems?: Array<{ _ref?: string }>;
    media?: Array<{ asset?: { url?: string } }>;
    displayOrder?: number;
    order?: number;
    isHidden?: boolean;
    isFeatured?: boolean;
  }>;
  faq?: Array<{
    question?: LocalizedValue;
    answer?: LocalizedValue;
    displayOrder?: number;
    order?: number;
    isHidden?: boolean;
    visible?: boolean;
  }>;
  testimonials?: CmsTestimonial[];
  mediaAssets?: Array<{
    _id: string;
    title?: string;
    caption?: string;
    category?: string;
    locale?: string;
    mediaType?: "image" | "video";
    alt?: string;
    order?: number;
    isFeatured?: boolean;
    isHidden?: boolean;
    linkUrl?: string;
    imageFile?: { asset?: { url?: string } };
    videoFile?: { asset?: { url?: string } };
    videoPoster?: { asset?: { url?: string } };
  }>;
  startStudioLocales?: Array<{
    locale?: string;
    messagesJson?: string;
    updatedAt?: string;
  }>;
};

type TestimonialMessageItem = {
  name: string;
  business: string;
  quote: string;
  rating: number;
};

type MutableMessages = Omit<Messages, "examplesGallery" | "solutionsPrompt" | "testimonials" | "mediaCategories"> &
  Record<string, unknown> & {
    mediaCategories?: Record<string, string>;
    examplesGallery?: {
      eyebrow?: string;
      title?: string;
      description?: string;
      items?: HomeExamplesGalleryItem[];
    };
    solutionsPrompt?: {
      eyebrow?: string;
      title?: string;
      description?: string;
      cta?: string;
      cards?: SolutionsPromptCard[];
    };
    testimonials?: {
      eyebrow?: string;
      title?: string;
      description?: string;
      items?: TestimonialMessageItem[];
    };
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
  galleryItems?: HomeExamplesGalleryItem[];
};

export type HomeExamplesGalleryItem = {
  title: string;
  subtitle: string;
  category: string;
  mediaType: "image" | "video";
  src: string;
  poster?: string;
  alt: string;
  order?: number;
  link?: string;
};

export type SolutionsPromptCard = {
  title: string;
  problem: string;
  outcome: string;
  slug: string;
};

type MessageServiceCard = {
  title?: string;
  audience?: string;
  features?: string[];
  timeline?: string;
  price?: string;
  slug?: string;
};

type MessageSolutionCard = {
  title?: string;
  problem?: string;
  whatWeDo?: string;
  outcome?: string;
  timeline?: string;
  price?: string;
  slug?: string;
};

function buildFallbackLandingPages(): Record<Locale, LandingPageData[]> {
  const heMessages = messageCatalog.he;
  const enMessages = messageCatalog.en;

  const heServices = (heMessages.servicesPage.standardCards ?? []) as MessageServiceCard[];
  const enServices = (enMessages.servicesPage.standardCards ?? []) as MessageServiceCard[];
  const heSolutions = (heMessages.solutionsPage.cards ?? []) as MessageSolutionCard[];
  const enSolutions = (enMessages.solutionsPage.cards ?? []) as MessageSolutionCard[];

  const heServiceItems = heServices
    .filter((card) => card.title && card.slug)
    .map((card, index) => {
      const alt = enServices[index] ?? card;
      const description = card.audience || card.features?.[0] || card.title || "";
      return {
        id: `svc-${card.slug}`,
        type: "service" as const,
        slug: card.slug || "",
        alternateSlug: alt.slug || card.slug || "",
        title: card.title || "",
        description,
        bullets: (card.features ?? []).slice(0, 6),
        price: card.price || "",
        seoTitle: card.title || "",
        seoDescription: description,
      };
    });

  const enServiceItems = enServices
    .filter((card) => card.title && card.slug)
    .map((card, index) => {
      const alt = heServices[index] ?? card;
      const description = card.audience || card.features?.[0] || card.title || "";
      return {
        id: `svc-${card.slug}`,
        type: "service" as const,
        slug: card.slug || "",
        alternateSlug: alt.slug || card.slug || "",
        title: card.title || "",
        description,
        bullets: (card.features ?? []).slice(0, 6),
        price: card.price || "",
        seoTitle: card.title || "",
        seoDescription: description,
      };
    });

  const heSolutionItems = heSolutions
    .filter((card) => card.title && card.slug)
    .map((card, index) => {
      const alt = enSolutions[index] ?? card;
      const description = card.outcome || card.whatWeDo || card.problem || card.title || "";
      const bullets = [card.problem, card.whatWeDo, card.outcome].filter(Boolean) as string[];
      return {
        id: `sol-${card.slug}`,
        type: "solution" as const,
        slug: card.slug || "",
        alternateSlug: alt.slug || card.slug || "",
        title: card.title || "",
        description,
        bullets,
        price: card.price || "",
        seoTitle: card.title || "",
        seoDescription: description,
      };
    });

  const enSolutionItems = enSolutions
    .filter((card) => card.title && card.slug)
    .map((card, index) => {
      const alt = heSolutions[index] ?? card;
      const description = card.outcome || card.whatWeDo || card.problem || card.title || "";
      const bullets = [card.problem, card.whatWeDo, card.outcome].filter(Boolean) as string[];
      return {
        id: `sol-${card.slug}`,
        type: "solution" as const,
        slug: card.slug || "",
        alternateSlug: alt.slug || card.slug || "",
        title: card.title || "",
        description,
        bullets,
        price: card.price || "",
        seoTitle: card.title || "",
        seoDescription: description,
      };
    });

  return {
    he: [...heServiceItems, ...heSolutionItems],
    en: [...enServiceItems, ...enSolutionItems],
  };
}

const fallbackLandingPages = buildFallbackLandingPages();

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

function parseCmsStartStudioPatch(snapshot: CmsSnapshot, locale: Locale): Record<string, unknown> | null {
  const localeDoc =
    snapshot.startStudioLocales?.find((item) => item.locale === locale) ??
    snapshot.startStudioLocales?.find((item) => item.locale === DEFAULT_LOCALE);
  const raw = localeDoc?.messagesJson;
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as unknown;
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
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

function byOrder(
  left: { order?: number; displayOrder?: number; _createdAt?: string },
  right: { order?: number; displayOrder?: number; _createdAt?: string },
) {
  const leftOrder = left.order ?? left.displayOrder ?? 100;
  const rightOrder = right.order ?? right.displayOrder ?? 100;
  if (leftOrder !== rightOrder) return leftOrder - rightOrder;
  return String(left._createdAt ?? "").localeCompare(String(right._createdAt ?? ""));
}

function pickFeatured<T extends { isFeatured?: boolean }>(items: T[], limit: number) {
  const featured = items.filter((item) => item.isFeatured);
  const source = featured.length ? featured : items;
  return source.slice(0, limit);
}

export type ResolvedMediaAsset = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  locale: string;
  mediaType: "image" | "video";
  src: string;
  poster?: string;
  alt: string;
  order: number;
  isFeatured: boolean;
  isHidden: boolean;
  link?: string;
};

function resolveMediaAsset(asset: NonNullable<CmsSnapshot["mediaAssets"]>[number]): ResolvedMediaAsset | null {
  const mediaType = asset.mediaType === "video" ? "video" : "image";
  const src = mediaType === "video" ? asset.videoFile?.asset?.url || "" : asset.imageFile?.asset?.url || "";
  if (!src) return null;

  return {
    id: asset._id,
    title: asset.title || "",
    subtitle: asset.caption || "",
    category: asset.category || "general",
    locale: asset.locale || "all",
    mediaType,
    src,
    poster: asset.videoPoster?.asset?.url || "",
    alt: asset.alt || asset.title || "",
    order: asset.order ?? 100,
    isFeatured: Boolean(asset.isFeatured),
    isHidden: Boolean(asset.isHidden),
    link: asset.linkUrl || "",
  };
}

function isMediaAllowedForLocale(locale: Locale, mediaLocale: string) {
  if (!mediaLocale || mediaLocale === "all") return true;
  return mediaLocale === locale;
}

function mapMediaRefsToGalleryItems({
  refs,
  mediaMap,
  locale,
}: {
  refs: Array<{ _ref?: string }> | undefined;
  mediaMap: Map<string, ResolvedMediaAsset>;
  locale: Locale;
}): HomeExamplesGalleryItem[] {
  return (refs ?? [])
    .map((ref) => (ref._ref ? mediaMap.get(ref._ref) : undefined))
    .filter((item): item is ResolvedMediaAsset => Boolean(item))
    .filter((item) => !item.isHidden && isMediaAllowedForLocale(locale, item.locale))
    .sort(byOrder)
    .map((item) => ({
      title: item.title,
      subtitle: item.subtitle,
      category: item.category,
      mediaType: item.mediaType,
      src: item.src,
      poster: item.poster || undefined,
      alt: item.alt,
      order: item.order,
      link: item.link || undefined,
    }));
}

function mapLegacyGalleryItems(
  urls: string[] | undefined,
  title: string,
): HomeExamplesGalleryItem[] {
  const items: HomeExamplesGalleryItem[] = [];
  for (const [index, src] of (urls ?? []).entries()) {
    const normalized = src?.trim() || "";
    if (!normalized) continue;
    items.push({
      title,
      subtitle: "",
      category: "general",
      mediaType: normalized.toLowerCase().includes(".mp4") ? "video" : "image",
      src: normalized,
      alt: title,
      order: index + 1,
    });
  }
  return items;
}

function buildResolvedMediaMap(snapshot: CmsSnapshot | null) {
  const resolvedMediaAssets = (snapshot?.mediaAssets ?? [])
    .map((asset) => resolveMediaAsset(asset))
    .filter((item): item is ResolvedMediaAsset => Boolean(item));
  return new Map(resolvedMediaAssets.map((item) => [item.id, item]));
}

const getCmsSnapshot = cache(async (): Promise<CmsSnapshot | null> => {
  return null;
});

export const getLocaleMessages = cache(async (locale: Locale): Promise<Messages> => {
  const content = structuredClone(messageCatalog[locale]) as MutableMessages;
  const [snapshot, startStudio] = await Promise.all([getCmsSnapshot(), getStartStudioContent()]);

  if (snapshot) {
    if (snapshot.navigation?.items?.length) {
      content.nav.links = [...snapshot.navigation.items]
        .sort(byOrder)
        .map((item) => ({
          label: pickLocalized(item.label, locale),
          path: pickLocalized(item.href, locale) || "/",
        }));
    }

    const nav = content.nav as typeof content.nav & Record<string, string>;
    nav.primaryCta = pickLocalized(snapshot.navigation?.primaryCtaLabel, locale) || "WhatsApp";
    nav.secondaryCta =
      pickLocalized(snapshot.navigation?.secondaryCtaLabel, locale) ||
      "Get a quote";
    nav.secondaryCtaHref = pickLocalized(snapshot.navigation?.secondaryCtaHref, locale) || "/contact";

    if (snapshot.home) {
      content.hero.title = pickLocalized(snapshot.home.heroTitle, locale) || content.hero.title;
      content.hero.description = pickLocalized(snapshot.home.heroDescription, locale) || content.hero.description;
      content.hero.primaryCta = pickLocalized(snapshot.home.heroPrimaryCta, locale) || content.hero.primaryCta;
      content.hero.secondaryCta =
        pickLocalized(snapshot.home.heroSecondaryCta, locale) || content.hero.secondaryCta;
    }

    const mediaMap = buildResolvedMediaMap(snapshot);

    const homeGalleryFromSanity = mapMediaRefsToGalleryItems({
      refs: snapshot.home?.examplesGalleryItems,
      mediaMap,
      locale,
    });
    if (homeGalleryFromSanity.length) {
      const examples = content.examplesGallery ?? {};
      content.examplesGallery = {
        ...examples,
        eyebrow: pickLocalized(snapshot.home?.examplesGalleryEyebrow, locale) || examples.eyebrow,
        title: pickLocalized(snapshot.home?.examplesGalleryTitle, locale) || examples.title,
        description: pickLocalized(snapshot.home?.examplesGalleryDescription, locale) || examples.description,
        items: homeGalleryFromSanity,
      };
    } else if (snapshot.home) {
      const examples = content.examplesGallery ?? {};
      content.examplesGallery = {
        ...examples,
        eyebrow: pickLocalized(snapshot.home.examplesGalleryEyebrow, locale) || examples.eyebrow,
        title: pickLocalized(snapshot.home.examplesGalleryTitle, locale) || examples.title,
        description: pickLocalized(snapshot.home.examplesGalleryDescription, locale) || examples.description,
      };
    }

    const services = (snapshot.services ?? [])
      .filter((service) => !service.isHidden && service.cardType !== "solution")
      .sort(byOrder)
      .map((service) => ({
        title: pickLocalized(service.title, locale),
        audience: pickLocalized(service.subtitle, locale),
        description:
          pickLocalized(service.shortValue, locale) || pickLocalized(service.shortDescription, locale),
        features: pickLocalizedArray(service.deliverables, locale),
        timeline: pickLocalized(service.deliveryTime, locale),
        price: service.priceFrom || "",
        slug: pickSlug(service.slug, locale),
        isFeatured: service.isFeatured,
      }))
      .filter((service) => service.title && service.slug);

    if (services.length) {
      const storefrontServices = pickFeatured(services, 6);
      content.services.items = storefrontServices.map((service) => ({
        title: service.title,
        description: service.description,
      }));
      content.servicesPage.standardCards = storefrontServices.map((service) => ({
        title: service.title,
        audience: service.audience,
        features: service.features.slice(0, 5),
        timeline: service.timeline,
        price: service.price,
        slug: service.slug,
      }));
    }

    const solutions = (snapshot.solutions ?? [])
      .filter((solution) => !solution.isHidden)
      .sort(byOrder)
      .map((solution) => ({
        id: solution._id,
        title: pickLocalized(solution.title, locale),
        problem: pickLocalized(solution.problem ?? solution.fit, locale),
        whatWeDo: pickLocalized(solution.whatWeDo, locale),
        outcome: pickLocalized(solution.outcome, locale),
        include: pickLocalizedArray(solution.includedItems ?? solution.include, locale),
        timeline: pickLocalized(solution.deliveryTime, locale),
        price: solution.priceFrom || "",
        slug: pickSlug(solution.slug, locale),
        isFeatured: solution.isFeatured,
      }))
      .filter((solution) => solution.title && solution.slug);

    if (solutions.length) {
      const storefrontSolutions = pickFeatured(solutions, 5).map((solution) => ({
        title: solution.title,
        problem: solution.problem,
        whatWeDo: solution.whatWeDo || solution.include.slice(0, 2).join(", "),
        outcome: solution.outcome || solution.include.slice(0, 2).join(", "),
        timeline: solution.timeline,
        price: solution.price,
        slug: solution.slug,
      }));

      content.solutionsPage.cards = storefrontSolutions;
      content.servicesPage.solutionCards = storefrontSolutions.map((solution) => ({
        title: solution.title,
        audience: solution.problem,
        features: [solution.whatWeDo, solution.outcome].filter(Boolean),
        timeline: solution.timeline,
        price: solution.price,
        slug: solution.slug,
      }));
    }

    const promptCardsFromSanity = (snapshot.home?.solutionsPromptItems ?? [])
      .map((item) => (item._ref ? solutions.find((solution) => solution.id === item._ref) : undefined))
      .filter((item): item is (typeof solutions)[number] => Boolean(item))
      .slice(0, 5)
      .map((item) => ({
        title: item.title,
        problem: item.problem,
        outcome: item.outcome,
        slug: item.slug,
      }));

    if (snapshot.home || promptCardsFromSanity.length) {
      const existingPrompt = content.solutionsPrompt ?? {};
      const fallbackPromptCards = existingPrompt.cards ?? solutions.slice(0, 5).map((item) => ({
        title: item.title,
        problem: item.problem,
        outcome: item.outcome,
        slug: item.slug,
      }));

      content.solutionsPrompt = {
        ...existingPrompt,
        eyebrow: pickLocalized(snapshot.home?.solutionsPromptEyebrow, locale) || existingPrompt.eyebrow,
        title: pickLocalized(snapshot.home?.solutionsPromptTitle, locale) || existingPrompt.title,
        description:
          pickLocalized(snapshot.home?.solutionsPromptDescription, locale) || existingPrompt.description,
        cta: pickLocalized(snapshot.home?.solutionsPromptCta, locale) || existingPrompt.cta,
        cards: promptCardsFromSanity.length ? promptCardsFromSanity : fallbackPromptCards,
      };
    }

    const packages = (snapshot.packages ?? [])
      .filter((item) => item.active !== false && !item.isHidden)
      .sort(byOrder)
      .map((item) => ({
        title: pickLocalized(item.name, locale),
        audience: pickLocalized(item.whoFor, locale) || pickLocalized(item.summary, locale),
        features: pickLocalizedArray(item.features, locale),
        price: item.price || "",
        isFeatured: item.isFeatured,
      }))
      .filter((item) => item.title);
    if (packages.length) {
      content.pricingPage.tiers = pickFeatured(packages, packages.length);
    }

    const fallbackVisuals = ["/portfolio/helix.svg", "/portfolio/nera.svg", "/portfolio/axis.svg"];
    const portfolioItems = [...(snapshot.portfolio ?? [])]
      .filter((item) => !item.isHidden)
      .sort(byOrder)
      .map((item, index) => {
        const galleryItems = mapMediaRefsToGalleryItems({
          refs: item.galleryItems,
          mediaMap,
          locale,
        });
        const visual =
          galleryItems[0]?.src ||
          item.media?.[0]?.asset?.url ||
          fallbackVisuals[index % fallbackVisuals.length];
        return {
          title: pickLocalized(item.title, locale),
          subtitle: pickLocalized(item.shortDescription, locale) || pickLocalized(item.clientType, locale),
          metric: item.category || "Case",
          alt: pickLocalized(item.title, locale),
          visual,
          mediaType:
            galleryItems[0]?.mediaType ||
            (visual.toLowerCase().includes(".mp4") ? "video" : "image"),
          isFeatured: item.isFeatured,
        };
      })
      .filter((item) => item.title);
    if (portfolioItems.length) {
      content.portfolio.items = pickFeatured(portfolioItems, portfolioItems.length);
    }

    const faqItems = [...(snapshot.faq ?? [])]
      .filter((item) => item.visible !== false && !item.isHidden)
      .sort(byOrder)
      .map((item) => ({
        question: pickLocalized(item.question, locale),
        answer: pickLocalized(item.answer, locale),
      }))
      .filter((item) => item.question && item.answer);
    if (faqItems.length) {
      content.faq.items = faqItems;
    }

    const testimonials = [...(snapshot.testimonials ?? [])]
      .filter((item) => item.visible !== false && !item.isHidden)
      .sort(byOrder)
      .map((item) => ({
        name: item.name || "",
        business: item.business || "",
        quote: pickLocalized(item.quote, locale),
        rating: item.rating ?? 5,
      }))
      .filter((item) => item.quote);
    if (testimonials.length) {
      const existingTestimonials =
        ((content as Record<string, unknown>).testimonials as Record<string, unknown> | undefined) ?? {};
      (content as Record<string, unknown>).testimonials = {
        ...existingTestimonials,
        items: testimonials,
      };
    }

    const socialInstagram =
      snapshot.global?.socialLinks?.find((item) =>
        String(item.platform || "").toLowerCase().includes("instagram"),
      )?.url ?? "";
    const instagramValue = snapshot.global?.instagram || socialInstagram;
    const fallbackGlobal = (content.global as {
      whatsappNumber?: string;
      phone?: string;
      email?: string;
      instagram?: string;
    }) ?? {};
    const whatsappValue = snapshot.global?.whatsappNumber || fallbackGlobal.whatsappNumber || "";
    const phoneValue = snapshot.global?.phone || fallbackGlobal.phone || "";
    const emailValue = snapshot.global?.email || fallbackGlobal.email || "";

    content.contact.channels = [
      { label: "WhatsApp", value: whatsappValue },
      { label: "Phone", value: phoneValue },
      {
        label: "Instagram",
        value: instagramValue || fallbackGlobal.instagram || "",
      },
      { label: "Email", value: emailValue },
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

    const withGlobal = content as Messages & {
      global?: {
        whatsappNumber?: string;
        phone?: string;
        email?: string;
        instagram?: string;
      };
    };
    withGlobal.global = {
      whatsappNumber: whatsappValue || withGlobal.global?.whatsappNumber,
      phone: phoneValue || withGlobal.global?.phone,
      email: emailValue || withGlobal.global?.email,
      instagram: instagramValue || withGlobal.global?.instagram,
    };
  }

  const cmsStartStudioPatch = snapshot ? parseCmsStartStudioPatch(snapshot, locale) : null;
  if (cmsStartStudioPatch) {
    Object.assign(content, mergeDeep(content as Record<string, unknown>, cmsStartStudioPatch));
  }

  if (!snapshot) {
    const legacyPatch = startStudio?.locales?.[locale]?.messages;
    if (isRecord(legacyPatch)) {
      Object.assign(content, mergeDeep(content as Record<string, unknown>, legacyPatch));
    }

    if (startStudio?.global?.whatsappNumber) {
      const withGlobal = content as Messages & {
        global?: {
          whatsappNumber?: string;
          phone?: string;
          email?: string;
          instagram?: string;
        };
      };
      withGlobal.global = {
        ...(withGlobal.global ?? {}),
        whatsappNumber: startStudio.global.whatsappNumber,
      };
    }
  }

  return content as Messages;
});

export async function getServiceLanding(locale: Locale, slug: string): Promise<LandingPageData | null> {
  const snapshot = await getCmsSnapshot();
  const match = snapshot?.services?.find((service) => pickSlug(service.slug, locale) === slug);

  if (match) {
    const title = pickLocalized(match.title, locale);
    const description = pickLocalized(match.fullDescription, locale) || pickLocalized(match.shortDescription, locale);
    const mediaMap = buildResolvedMediaMap(snapshot);
    const galleryItemsFromSanity = mapMediaRefsToGalleryItems({
      refs: match.galleryItems,
      mediaMap,
      locale,
    });
    const legacyUrls = (match.gallery ?? []).map((item) => item.asset?.url || "");
    const galleryItems = galleryItemsFromSanity.length
      ? galleryItemsFromSanity
      : mapLegacyGalleryItems(legacyUrls, title);

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
      galleryItems,
    };
  }

  return fallbackLandingPages[locale].find((item) => item.type === "service" && item.slug === slug) ?? null;
}

export async function getSolutionLanding(locale: Locale, slug: string): Promise<LandingPageData | null> {
  const snapshot = await getCmsSnapshot();
  const match = snapshot?.solutions?.find((solution) => pickSlug(solution.slug, locale) === slug);

  if (match) {
    const title = pickLocalized(match.title, locale);
    const description =
      pickLocalized(match.outcome, locale) ||
      pickLocalized(match.whatWeDo, locale) ||
      pickLocalized(match.problem ?? match.fit, locale);
    const bullets = pickLocalizedArray(match.includedItems ?? match.include, locale).slice(0, 6);
    const fallbackBullets = [
      pickLocalized(match.problem ?? match.fit, locale),
      pickLocalized(match.whatWeDo, locale),
      pickLocalized(match.outcome, locale),
    ].filter(Boolean);
    const mediaMap = buildResolvedMediaMap(snapshot);
    const galleryItemsFromSanity = mapMediaRefsToGalleryItems({
      refs: match.galleryItems,
      mediaMap,
      locale,
    });
    const legacyUrls = (match.visuals ?? []).map((item) => item.asset?.url || "");
    const galleryItems = galleryItemsFromSanity.length
      ? galleryItemsFromSanity
      : mapLegacyGalleryItems(legacyUrls, title);

    return {
      id: match._id,
      type: "solution",
      slug: pickSlug(match.slug, locale),
      alternateSlug: pickAlternateSlug(match.slug, locale),
      title,
      description,
      bullets: bullets.length ? bullets : fallbackBullets,
      price: match.priceFrom || "",
      seoTitle: pickLocalized(match.seo?.title, locale) || title,
      seoDescription: pickLocalized(match.seo?.description, locale) || description,
      noindex: match.seo?.noindex,
      ogImage: match.seo?.ogImage?.asset?.url,
      galleryItems,
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
    .filter((service) => !service.isHidden)
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
    .filter((solution) => !solution.isHidden)
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
