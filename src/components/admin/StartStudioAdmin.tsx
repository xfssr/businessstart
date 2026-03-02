"use client";

import { useMemo, useState } from "react";

import { cn } from "@/lib/cn";
import { type Locale } from "@/lib/constants";

type ServiceCard = {
  title: string;
  audience: string;
  price: string;
  timeline: string;
  features: string[];
  slug?: string;
};

type SolutionCard = {
  problem: string;
  whatWeDo: string;
  outcome: string;
  timeline: string;
  title: string;
  price: string;
  slug?: string;
};

type PricingTier = {
  title: string;
  audience: string;
  price: string;
  features: string[];
};

type PortfolioItem = {
  title: string;
  subtitle: string;
  metric: string;
  visual: string;
  alt: string;
  mediaType?: "image" | "video";
};

type MediaItem = {
  id: string;
  title: string;
  url: string;
  locale: Locale;
  type: "image" | "video";
  createdAt: string;
};

type ApiStateResponse = {
  locale: Locale;
  messages: Record<string, unknown>;
  mediaLibrary: MediaItem[];
};

type LibraryMediaItem = {
  id: string;
  title: string;
  caption: string;
  category: string;
  locale: Locale | "all";
  mediaType: "image" | "video";
  url: string;
  imageUrl: string;
  videoUrl: string;
  posterUrl: string;
  alt: string;
  order: number;
  isFeatured: boolean;
  isHidden: boolean;
  linkUrl: string;
  linkedTo: string[];
  assignments: {
    home: boolean;
    serviceIds: string[];
    solutionIds: string[];
    portfolioIds: string[];
  };
};

type MediaLibraryTargets = {
  homePageId: string | null;
  services: Array<{ id: string; title: string; slug?: string }>;
  solutions: Array<{ id: string; title: string; slug?: string }>;
  portfolios: Array<{ id: string; title: string; slug?: string }>;
};

type MediaLibraryResponse = {
  media: LibraryMediaItem[];
  targets: MediaLibraryTargets;
};

type MediaFormState = {
  title: string;
  type: "image" | "video";
  category: string;
  locale: Locale | "all";
  caption: string;
  alt: string;
  featured: boolean;
  hidden: boolean;
  order: number;
  linkUrl: string;
  includeHome: boolean;
  serviceIdsText: string;
  solutionIdsText: string;
  portfolioIdsText: string;
};

const MEDIA_CATEGORY_OPTIONS = [
  "restaurant",
  "bar",
  "food",
  "beauty",
  "product",
  "realEstate",
  "localService",
  "branding",
  "socialContent",
  "general",
] as const;

type SeoFields = {
  servicesMetaTitle: string;
  servicesMetaDescription: string;
  solutionsMetaTitle: string;
  solutionsMetaDescription: string;
  pricingMetaTitle: string;
  pricingMetaDescription: string;
  portfolioMetaTitle: string;
  portfolioMetaDescription: string;
  aboutMetaTitle: string;
  aboutMetaDescription: string;
  contactMetaTitle: string;
  contactMetaDescription: string;
};

type AdminState = SeoFields & {
  heroTitle: string;
  heroDescription: string;
  heroTrust: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  whatsappNumber: string;
  phone: string;
  email: string;
  instagram: string;
  navStickyCta: string;
  navPrimaryCta: string;
  navSecondaryCta: string;
  navSecondaryCtaHref: string;
  navLinksText: string;
  processTitle: string;
  processDescription: string;
  processStepsText: string;
  audienceCategoriesText: string;
  differencePointsText: string;
  differenceCallout: string;
  outcomesItemsText: string;
  faqItemsText: string;
  contactChannelsText: string;
  contactDescription: string;
  contactPrimaryCta: string;
  contactSecondaryCta: string;
  footerNote: string;
  footerCopyright: string;
  pricingAddonsText: string;
  standardCards: ServiceCard[];
  solutionCards: SolutionCard[];
  pricingTiers: PricingTier[];
  portfolioItems: PortfolioItem[];
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function toLines(values: string[]) {
  return values.filter(Boolean).join("\n");
}

function parseLines(input: string) {
  return input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function toPairLines(items: Array<{ left: string; right: string }>) {
  return items.map((item) => `${item.left} | ${item.right}`).join("\n");
}

function parsePairLines(input: string) {
  return parseLines(input)
    .map((line) => {
      const [left, ...rightParts] = line.split("|");
      return { left: left?.trim() ?? "", right: rightParts.join("|").trim() };
    })
    .filter((item) => item.left && item.right);
}

function toTripleLines(items: Array<{ first: string; second: string; third: string }>) {
  return items.map((item) => `${item.first} | ${item.second} | ${item.third}`).join("\n");
}

function parseTripleLines(input: string) {
  return parseLines(input)
    .map((line) => {
      const [first, second, ...thirdParts] = line.split("|");
      return {
        first: first?.trim() ?? "",
        second: second?.trim() ?? "",
        third: thirdParts.join("|").trim(),
      };
    })
    .filter((item) => item.first && item.second);
}

function parseIdList(input: string) {
  return input
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function createInitialMediaForm(locale: Locale): MediaFormState {
  return {
    title: "",
    type: "image",
    category: "general",
    locale,
    caption: "",
    alt: "",
    featured: false,
    hidden: false,
    order: 100,
    linkUrl: "",
    includeHome: true,
    serviceIdsText: "",
    solutionIdsText: "",
    portfolioIdsText: "",
  };
}

function createInitialState(messages: Record<string, unknown>): AdminState {
  const hero = asRecord(messages.hero);
  const nav = asRecord(messages.nav);
  const process = asRecord(messages.process);
  const audience = asRecord(messages.audience);
  const difference = asRecord(messages.difference);
  const outcomes = asRecord(messages.outcomes);
  const faq = asRecord(messages.faq);
  const contact = asRecord(messages.contact);
  const footer = asRecord(messages.footer);
  const servicesPage = asRecord(messages.servicesPage);
  const solutionsPage = asRecord(messages.solutionsPage);
  const pricingPage = asRecord(messages.pricingPage);
  const portfolioPage = asRecord(messages.portfolioPage);
  const aboutPage = asRecord(messages.aboutPage);
  const contactPage = asRecord(messages.contactPage);
  const portfolio = asRecord(messages.portfolio);
  const global = asRecord(messages.global);

  const navLinks = ((nav.links as Array<{ label?: string; path?: string }>) ?? []).map((item) => ({
    left: String(item.label ?? ""),
    right: String(item.path ?? ""),
  }));

  const processSteps = ((process.steps as Array<{ marker?: string; title?: string; description?: string }>) ??
    []).map((item, index) => ({
    first: String(item.marker ?? `${String(index + 1).padStart(2, "0")}`),
    second: String(item.title ?? ""),
    third: String(item.description ?? ""),
  }));

  const faqItems = ((faq.items as Array<{ question?: string; answer?: string }>) ?? []).map((item) => ({
    left: String(item.question ?? ""),
    right: String(item.answer ?? ""),
  }));

  const contactChannels = ((contact.channels as Array<{ label?: string; value?: string }>) ?? []).map((item) => ({
    left: String(item.label ?? ""),
    right: String(item.value ?? ""),
  }));

  const addons = ((pricingPage.addons as Array<{ title?: string; price?: string }>) ?? []).map((item) => ({
    left: String(item.title ?? ""),
    right: String(item.price ?? ""),
  }));

  return {
    heroTitle: String(hero.title ?? ""),
    heroDescription: String(hero.description ?? ""),
    heroTrust: String(hero.trust ?? ""),
    heroPrimaryCta: String(hero.primaryCta ?? ""),
    heroSecondaryCta: String(hero.secondaryCta ?? ""),
    whatsappNumber: String(global.whatsappNumber ?? ""),
    phone: String(global.phone ?? ""),
    email: String(global.email ?? ""),
    instagram: String(global.instagram ?? ""),
    navStickyCta: String(nav.stickyCta ?? ""),
    navPrimaryCta: String(nav.primaryCta ?? ""),
    navSecondaryCta: String(nav.secondaryCta ?? ""),
    navSecondaryCtaHref: String(nav.secondaryCtaHref ?? "/contact"),
    navLinksText: toPairLines(navLinks),
    processTitle: String(process.title ?? ""),
    processDescription: String(process.description ?? ""),
    processStepsText: toTripleLines(processSteps),
    audienceCategoriesText: toLines((audience.categories as string[]) ?? []),
    differencePointsText: toLines((difference.points as string[]) ?? []),
    differenceCallout: String(difference.callout ?? ""),
    outcomesItemsText: toLines((outcomes.items as string[]) ?? []),
    faqItemsText: toPairLines(faqItems),
    contactChannelsText: toPairLines(contactChannels),
    contactDescription: String(contact.description ?? ""),
    contactPrimaryCta: String(contact.primaryCta ?? ""),
    contactSecondaryCta: String(contact.secondaryCta ?? ""),
    footerNote: String(footer.note ?? ""),
    footerCopyright: String(footer.copyright ?? ""),
    pricingAddonsText: toPairLines(addons),
    servicesMetaTitle: String(servicesPage.metaTitle ?? ""),
    servicesMetaDescription: String(servicesPage.metaDescription ?? ""),
    solutionsMetaTitle: String(solutionsPage.metaTitle ?? ""),
    solutionsMetaDescription: String(solutionsPage.metaDescription ?? ""),
    pricingMetaTitle: String(pricingPage.metaTitle ?? ""),
    pricingMetaDescription: String(pricingPage.metaDescription ?? ""),
    portfolioMetaTitle: String(portfolioPage.metaTitle ?? ""),
    portfolioMetaDescription: String(portfolioPage.metaDescription ?? ""),
    aboutMetaTitle: String(aboutPage.metaTitle ?? ""),
    aboutMetaDescription: String(aboutPage.metaDescription ?? ""),
    contactMetaTitle: String(contactPage.metaTitle ?? ""),
    contactMetaDescription: String(contactPage.metaDescription ?? ""),
    standardCards: ((servicesPage.standardCards as ServiceCard[]) ?? []).map((card) => ({
      ...card,
      features: card.features ?? [],
    })),
    solutionCards: ((solutionsPage.cards as SolutionCard[]) ?? []).map((card) => ({
      title: String(card.title ?? ""),
      problem: String((card as { problem?: string; fit?: string }).problem ?? (card as { fit?: string }).fit ?? ""),
      whatWeDo: String((card as { whatWeDo?: string }).whatWeDo ?? ""),
      outcome: String((card as { outcome?: string }).outcome ?? ""),
      timeline: String((card as { timeline?: string }).timeline ?? ""),
      price: String(card.price ?? ""),
      slug: card.slug,
    })),
    pricingTiers: ((pricingPage.tiers as PricingTier[]) ?? []).map((tier) => ({
      ...tier,
      features: tier.features ?? [],
    })),
    portfolioItems: ((portfolio.items as PortfolioItem[]) ?? []).map((item) => ({
      ...item,
      mediaType: item.mediaType ?? (item.visual?.toLowerCase().includes(".mp4") ? "video" : "image"),
    })),
  };
}

function mapStateToPatch(state: AdminState) {
  const navLinks = parsePairLines(state.navLinksText).map((line) => ({
    label: line.left,
    path: line.right.startsWith("/") ? line.right : `/${line.right}`,
  }));

  const processSteps = parseTripleLines(state.processStepsText).map((line, index) => ({
    marker: line.first || String(index + 1).padStart(2, "0"),
    title: line.second,
    description: line.third,
  }));

  const faqItems = parsePairLines(state.faqItemsText).map((line) => ({
    question: line.left,
    answer: line.right,
  }));

  const channels = parsePairLines(state.contactChannelsText).map((line) => ({
    label: line.left,
    value: line.right,
  }));

  const addons = parsePairLines(state.pricingAddonsText).map((line) => ({
    title: line.left,
    price: line.right,
  }));

  return {
    nav: {
      links: navLinks,
      stickyCta: state.navStickyCta,
      primaryCta: state.navPrimaryCta,
      secondaryCta: state.navSecondaryCta,
      secondaryCtaHref: state.navSecondaryCtaHref,
    },
    hero: {
      title: state.heroTitle,
      description: state.heroDescription,
      trust: state.heroTrust,
      primaryCta: state.heroPrimaryCta,
      secondaryCta: state.heroSecondaryCta,
    },
    process: {
      title: state.processTitle,
      description: state.processDescription,
      steps: processSteps,
    },
    audience: {
      categories: parseLines(state.audienceCategoriesText),
    },
    difference: {
      points: parseLines(state.differencePointsText),
      callout: state.differenceCallout,
    },
    outcomes: {
      items: parseLines(state.outcomesItemsText),
    },
    faq: {
      items: faqItems,
    },
    contact: {
      description: state.contactDescription,
      primaryCta: state.contactPrimaryCta,
      secondaryCta: state.contactSecondaryCta,
      channels,
    },
    footer: {
      note: state.footerNote,
      copyright: state.footerCopyright,
    },
    servicesPage: {
      metaTitle: state.servicesMetaTitle,
      metaDescription: state.servicesMetaDescription,
      standardCards: state.standardCards,
    },
    solutionsPage: {
      metaTitle: state.solutionsMetaTitle,
      metaDescription: state.solutionsMetaDescription,
      cards: state.solutionCards.map((card) => ({
        title: card.title,
        problem: card.problem,
        whatWeDo: card.whatWeDo,
        outcome: card.outcome,
        timeline: card.timeline,
        price: card.price,
        slug: card.slug,
      })),
    },
    pricingPage: {
      metaTitle: state.pricingMetaTitle,
      metaDescription: state.pricingMetaDescription,
      tiers: state.pricingTiers,
      addons,
    },
    portfolioPage: {
      metaTitle: state.portfolioMetaTitle,
      metaDescription: state.portfolioMetaDescription,
    },
    aboutPage: {
      metaTitle: state.aboutMetaTitle,
      metaDescription: state.aboutMetaDescription,
    },
    contactPage: {
      metaTitle: state.contactMetaTitle,
      metaDescription: state.contactMetaDescription,
    },
    portfolio: {
      items: state.portfolioItems,
    },
    global: {
      whatsappNumber: state.whatsappNumber,
      phone: state.phone,
      email: state.email,
      instagram: state.instagram,
    },
  };
}

export function StartStudioAdmin() {
  const [locale, setLocale] = useState<Locale>("he");
  const [secretKey, setSecretKey] = useState("");
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [state, setState] = useState<AdminState | null>(null);
  const [legacyMediaLibrary, setLegacyMediaLibrary] = useState<MediaItem[]>([]);
  const [mediaLibrary, setMediaLibrary] = useState<LibraryMediaItem[]>([]);
  const [mediaTargets, setMediaTargets] = useState<MediaLibraryTargets>({
    homePageId: null,
    services: [],
    solutions: [],
    portfolios: [],
  });
  const [mediaForm, setMediaForm] = useState<MediaFormState>(() => createInitialMediaForm(locale));
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPosterFile, setMediaPosterFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const localeLabel = useMemo(() => (locale === "he" ? "עברית" : "English"), [locale]);

  async function loadMediaLibrary(nextLocale: Locale, key: string) {
    setLoadingMedia(true);
    try {
      const response = await fetch(`/api/startstudio/media-library?locale=${nextLocale}`, {
        headers: {
          "x-startstudio-key": key,
        },
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || "Failed loading media library");
      }

      const data = (await response.json()) as MediaLibraryResponse;
      setMediaLibrary(data.media ?? []);
      setMediaTargets(
        data.targets ?? {
          homePageId: null,
          services: [],
          solutions: [],
          portfolios: [],
        },
      );
    } finally {
      setLoadingMedia(false);
    }
  }

  async function loadState(nextLocale: Locale, keyOverride?: string) {
    const key = keyOverride ?? secretKey;
    setLoading(true);
    setStatus("");

    try {
      const response = await fetch(`/api/startstudio/state?locale=${nextLocale}`, {
        headers: {
          "x-startstudio-key": key,
        },
      });

      if (!response.ok) {
        throw new Error("Access denied or API not configured");
      }

      const data = (await response.json()) as ApiStateResponse;
      setState(createInitialState(data.messages));
      setLegacyMediaLibrary(data.mediaLibrary ?? []);
      await loadMediaLibrary(nextLocale, key);
      setMediaForm(createInitialMediaForm(nextLocale));
      setMediaFile(null);
      setMediaPosterFile(null);
      setConnected(true);
      setStatus("Loaded from Sanity");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load";
      setStatus(message);
      setConnected(false);
    } finally {
      setLoading(false);
    }
  }

  async function saveState() {
    if (!state) return;

    setSaving(true);
    setStatus("");

    try {
      const response = await fetch("/api/startstudio/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-startstudio-key": secretKey,
        },
        body: JSON.stringify({
          locale,
          messages: mapStateToPatch(state),
          whatsappNumber: state.whatsappNumber,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || "Save failed");
      }

      setStatus("Saved to Sanity (legacy Blob fallback synced if available)");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Save failed";
      setStatus(message);
    } finally {
      setSaving(false);
    }
  }

  async function migrateLegacyContent() {
    setMigrating(true);
    setStatus("");
    try {
      const response = await fetch("/api/startstudio/migrate", {
        method: "POST",
        headers: {
          "x-startstudio-key": secretKey,
        },
      });
      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean; migratedLocales?: number; error?: string }
        | null;

      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.error || "Migration failed");
      }

      setStatus(`Legacy blob content imported. Locales migrated: ${payload.migratedLocales ?? 0}`);
      await loadState(locale);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Migration failed";
      setStatus(message);
    } finally {
      setMigrating(false);
    }
  }

  async function createMediaAsset() {
    if (!mediaFile) {
      setStatus("Select a media file first");
      return;
    }

    setUploadingMedia(true);
    setStatus("");

    try {
      const serviceIds = parseIdList(mediaForm.serviceIdsText);
      const solutionIds = parseIdList(mediaForm.solutionIdsText);
      const portfolioIds = parseIdList(mediaForm.portfolioIdsText);

      const linkedTo = new Set<string>();
      if (mediaForm.includeHome) linkedTo.add("home");
      if (serviceIds.length) linkedTo.add("service");
      if (solutionIds.length) linkedTo.add("solution");
      if (portfolioIds.length) linkedTo.add("portfolio");
      if (!linkedTo.size) linkedTo.add("general");

      const formData = new FormData();
      formData.append("title", mediaForm.title || mediaFile.name);
      formData.append("mediaType", mediaForm.type);
      formData.append("category", mediaForm.category);
      formData.append("locale", mediaForm.locale);
      formData.append("caption", mediaForm.caption);
      formData.append("alt", mediaForm.alt);
      formData.append("order", String(mediaForm.order));
      formData.append("isFeatured", String(mediaForm.featured));
      formData.append("isHidden", String(mediaForm.hidden));
      formData.append("linkUrl", mediaForm.linkUrl);
      formData.append("linkedTo", JSON.stringify(Array.from(linkedTo)));
      formData.append("includeHome", String(mediaForm.includeHome));
      formData.append("serviceIds", serviceIds.join(","));
      formData.append("solutionIds", solutionIds.join(","));
      formData.append("portfolioIds", portfolioIds.join(","));
      formData.append("file", mediaFile);
      if (mediaPosterFile) {
        formData.append("posterFile", mediaPosterFile);
      }

      const response = await fetch("/api/startstudio/media-library", {
        method: "POST",
        headers: {
          "x-startstudio-key": secretKey,
        },
        body: formData,
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || "Media upload failed");
      }

      await loadMediaLibrary(locale, secretKey);
      setMediaForm(createInitialMediaForm(locale));
      setMediaFile(null);
      setMediaPosterFile(null);
      setStatus("Media asset created");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Media upload failed";
      setStatus(message);
    } finally {
      setUploadingMedia(false);
    }
  }

  async function patchMediaAsset(
    id: string,
    patch: {
      title?: string;
      caption?: string;
      category?: string;
      locale?: string;
      alt?: string;
      order?: number;
      isFeatured?: boolean;
      isHidden?: boolean;
      linkUrl?: string;
      linkedTo?: string[];
      placement?: {
        includeHome?: boolean;
        serviceIds?: string[];
        solutionIds?: string[];
        portfolioIds?: string[];
      };
    },
  ) {
    setStatus("");
    try {
      const response = await fetch("/api/startstudio/media-library", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-startstudio-key": secretKey,
        },
        body: JSON.stringify({
          id,
          ...patch,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || "Media update failed");
      }

      await loadMediaLibrary(locale, secretKey);
      setStatus("Media library updated");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Media update failed";
      setStatus(message);
    }
  }

  function updateServiceCard(index: number, key: keyof ServiceCard, value: string) {
    if (!state) return;
    const updated = [...state.standardCards];
    if (key === "features") return;
    updated[index] = { ...updated[index], [key]: value };
    setState({ ...state, standardCards: updated });
  }

  function updateSolutionCard(index: number, key: keyof SolutionCard, value: string) {
    if (!state) return;
    const updated = [...state.solutionCards];
    updated[index] = { ...updated[index], [key]: value };
    setState({ ...state, solutionCards: updated });
  }

  function updatePricingTier(index: number, key: keyof PricingTier, value: string) {
    if (!state) return;
    const updated = [...state.pricingTiers];
    if (key === "features") return;
    updated[index] = { ...updated[index], [key]: value };
    setState({ ...state, pricingTiers: updated });
  }

  function updatePortfolioItem(index: number, key: keyof PortfolioItem, value: string) {
    if (!state) return;
    const updated = [...state.portfolioItems];
    updated[index] = { ...updated[index], [key]: value };
    setState({ ...state, portfolioItems: updated });
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-5 py-10 text-text-primary sm:px-8">
      <h1 className="font-display text-4xl">StartStudio Admin v2</h1>
      <p className="text-sm text-text-secondary">
        Sanity-first editor for copy, product cards, pricing, SEO snippets, and media library assets.
      </p>

      <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto_auto_auto]">
          <input
            value={secretKey}
            onChange={(event) => setSecretKey(event.target.value)}
            type="password"
            placeholder="StartStudio admin key"
            className="rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={() => loadState(locale, secretKey)}
            className="rounded-lg border border-accent bg-accent px-4 py-2 text-sm font-semibold text-white"
          >
            {loading ? "Loading..." : "Connect"}
          </button>
          <button
            type="button"
            onClick={() => {
              const next = locale === "he" ? "en" : "he";
              setLocale(next);
              if (connected) void loadState(next);
            }}
            className="rounded-lg border border-border-strong bg-surface-base px-4 py-2 text-sm font-semibold"
          >
            Locale: {localeLabel}
          </button>
          <button
            type="button"
            onClick={migrateLegacyContent}
            disabled={!connected || migrating}
            className="rounded-lg border border-border-strong bg-surface-base px-4 py-2 text-sm font-semibold"
          >
            {migrating ? "Migrating..." : "Import Legacy Blob"}
          </button>
          <button
            type="button"
            onClick={saveState}
            disabled={!connected || saving || !state}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-semibold",
              connected ? "border border-accent bg-accent text-white" : "border border-border-subtle bg-surface-base",
            )}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
        <p className="mt-2 text-xs text-text-muted">{status}</p>
      </div>

      {state ? (
        <>
          <section className="space-y-3 rounded-xl border border-border-subtle bg-surface-elevated p-4">
            <h2 className="font-display text-2xl">Navigation / Hero</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={state.navStickyCta}
                onChange={(event) => setState({ ...state, navStickyCta: event.target.value })}
                className="rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-sm"
                placeholder="Sticky WhatsApp CTA"
              />
              <input
                value={state.navPrimaryCta}
                onChange={(event) => setState({ ...state, navPrimaryCta: event.target.value })}
                className="rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-sm"
                placeholder="Primary CTA label"
              />
              <input
                value={state.navSecondaryCta}
                onChange={(event) => setState({ ...state, navSecondaryCta: event.target.value })}
                className="rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-sm"
                placeholder="Secondary CTA label"
              />
              <input
                value={state.navSecondaryCtaHref}
                onChange={(event) => setState({ ...state, navSecondaryCtaHref: event.target.value })}
                className="rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-sm"
                placeholder="Secondary CTA href"
              />
            </div>
            <textarea
              value={state.navLinksText}
              onChange={(event) => setState({ ...state, navLinksText: event.target.value })}
              rows={5}
              className="w-full rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-sm"
              placeholder="Nav links: Label | /path"
            />
            <input
              value={state.heroTitle}
              onChange={(event) => setState({ ...state, heroTitle: event.target.value })}
              className="w-full rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-sm"
              placeholder="Hero title"
            />
            <textarea
              value={state.heroDescription}
              onChange={(event) => setState({ ...state, heroDescription: event.target.value })}
              rows={3}
              className="w-full rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-sm"
              placeholder="Hero description"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={state.heroPrimaryCta}
                onChange={(event) => setState({ ...state, heroPrimaryCta: event.target.value })}
                className="rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-sm"
                placeholder="Hero primary CTA"
              />
              <input
                value={state.heroSecondaryCta}
                onChange={(event) => setState({ ...state, heroSecondaryCta: event.target.value })}
                className="rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-sm"
                placeholder="Hero secondary CTA"
              />
            </div>
            <input
              value={state.whatsappNumber}
              onChange={(event) => setState({ ...state, whatsappNumber: event.target.value })}
              className="w-full rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-sm"
              placeholder="WhatsApp number (972...)"
            />
            <div className="grid gap-3 sm:grid-cols-3">
              <input
                value={state.phone}
                onChange={(event) => setState({ ...state, phone: event.target.value })}
                className="rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-sm"
                placeholder="Phone"
              />
              <input
                value={state.email}
                onChange={(event) => setState({ ...state, email: event.target.value })}
                className="rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-sm"
                placeholder="Email"
              />
              <input
                value={state.instagram}
                onChange={(event) => setState({ ...state, instagram: event.target.value })}
                className="rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-sm"
                placeholder="Instagram username or URL"
              />
            </div>
          </section>

          <section className="space-y-3 rounded-xl border border-border-subtle bg-surface-elevated p-4">
            <h2 className="font-display text-2xl">Business Flow Blocks</h2>
            <textarea
              value={state.processStepsText}
              onChange={(event) => setState({ ...state, processStepsText: event.target.value })}
              rows={7}
              className="w-full rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-sm"
              placeholder="Process: 01 | Title | Description"
            />
            <textarea
              value={state.audienceCategoriesText}
              onChange={(event) => setState({ ...state, audienceCategoriesText: event.target.value })}
              rows={4}
              className="w-full rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-sm"
              placeholder="Audience categories (one per line)"
            />
            <textarea
              value={state.differencePointsText}
              onChange={(event) => setState({ ...state, differencePointsText: event.target.value })}
              rows={4}
              className="w-full rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-sm"
              placeholder="Difference points (one per line)"
            />
            <textarea
              value={state.outcomesItemsText}
              onChange={(event) => setState({ ...state, outcomesItemsText: event.target.value })}
              rows={4}
              className="w-full rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-sm"
              placeholder="Outcome items (one per line)"
            />
          </section>

          <section className="space-y-3 rounded-xl border border-border-subtle bg-surface-elevated p-4">
            <h2 className="font-display text-2xl">SEO Snippets</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <input value={state.servicesMetaTitle} onChange={(event) => setState({ ...state, servicesMetaTitle: event.target.value })} className="rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-sm" placeholder="Services meta title" />
              <input value={state.servicesMetaDescription} onChange={(event) => setState({ ...state, servicesMetaDescription: event.target.value })} className="rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-sm" placeholder="Services meta description" />
              <input value={state.solutionsMetaTitle} onChange={(event) => setState({ ...state, solutionsMetaTitle: event.target.value })} className="rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-sm" placeholder="Solutions meta title" />
              <input value={state.solutionsMetaDescription} onChange={(event) => setState({ ...state, solutionsMetaDescription: event.target.value })} className="rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-sm" placeholder="Solutions meta description" />
              <input value={state.pricingMetaTitle} onChange={(event) => setState({ ...state, pricingMetaTitle: event.target.value })} className="rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-sm" placeholder="Pricing meta title" />
              <input value={state.pricingMetaDescription} onChange={(event) => setState({ ...state, pricingMetaDescription: event.target.value })} className="rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-sm" placeholder="Pricing meta description" />
              <input value={state.portfolioMetaTitle} onChange={(event) => setState({ ...state, portfolioMetaTitle: event.target.value })} className="rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-sm" placeholder="Portfolio meta title" />
              <input value={state.portfolioMetaDescription} onChange={(event) => setState({ ...state, portfolioMetaDescription: event.target.value })} className="rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-sm" placeholder="Portfolio meta description" />
              <input value={state.aboutMetaTitle} onChange={(event) => setState({ ...state, aboutMetaTitle: event.target.value })} className="rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-sm" placeholder="About meta title" />
              <input value={state.aboutMetaDescription} onChange={(event) => setState({ ...state, aboutMetaDescription: event.target.value })} className="rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-sm" placeholder="About meta description" />
              <input value={state.contactMetaTitle} onChange={(event) => setState({ ...state, contactMetaTitle: event.target.value })} className="rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-sm" placeholder="Contact meta title" />
              <input value={state.contactMetaDescription} onChange={(event) => setState({ ...state, contactMetaDescription: event.target.value })} className="rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-sm" placeholder="Contact meta description" />
            </div>
          </section>

          <section className="space-y-3 rounded-xl border border-border-subtle bg-surface-elevated p-4">
            <h2 className="font-display text-2xl">Cards & Pricing</h2>
            {state.standardCards.map((card, index) => (
              <div key={`${card.title}-${index}`} className="grid gap-2 rounded-lg border border-border-subtle p-3">
                <input value={card.title} onChange={(event) => updateServiceCard(index, "title", event.target.value)} className="rounded border border-border-subtle bg-surface-base px-2 py-1 text-sm" placeholder="Service title" />
                <input value={card.audience} onChange={(event) => updateServiceCard(index, "audience", event.target.value)} className="rounded border border-border-subtle bg-surface-base px-2 py-1 text-sm" placeholder="Audience" />
                <input value={card.timeline} onChange={(event) => updateServiceCard(index, "timeline", event.target.value)} className="rounded border border-border-subtle bg-surface-base px-2 py-1 text-sm" placeholder="Timeline" />
                <input value={card.price} onChange={(event) => updateServiceCard(index, "price", event.target.value)} className="rounded border border-border-subtle bg-surface-base px-2 py-1 text-sm" placeholder="Price" />
                <input value={card.slug ?? ""} onChange={(event) => updateServiceCard(index, "slug", event.target.value)} className="rounded border border-border-subtle bg-surface-base px-2 py-1 text-sm" placeholder="Slug" />
              </div>
            ))}
            {state.solutionCards.map((card, index) => (
              <div key={`${card.title}-${index}`} className="grid gap-2 rounded-lg border border-border-subtle p-3">
                <input value={card.title} onChange={(event) => updateSolutionCard(index, "title", event.target.value)} className="rounded border border-border-subtle bg-surface-base px-2 py-1 text-sm" placeholder="Solution title" />
                <input value={card.problem} onChange={(event) => updateSolutionCard(index, "problem", event.target.value)} className="rounded border border-border-subtle bg-surface-base px-2 py-1 text-sm" placeholder="Problem" />
                <input value={card.whatWeDo} onChange={(event) => updateSolutionCard(index, "whatWeDo", event.target.value)} className="rounded border border-border-subtle bg-surface-base px-2 py-1 text-sm" placeholder="What we do" />
                <input value={card.outcome} onChange={(event) => updateSolutionCard(index, "outcome", event.target.value)} className="rounded border border-border-subtle bg-surface-base px-2 py-1 text-sm" placeholder="Outcome" />
                <input value={card.timeline} onChange={(event) => updateSolutionCard(index, "timeline", event.target.value)} className="rounded border border-border-subtle bg-surface-base px-2 py-1 text-sm" placeholder="Timeline" />
                <input value={card.price} onChange={(event) => updateSolutionCard(index, "price", event.target.value)} className="rounded border border-border-subtle bg-surface-base px-2 py-1 text-sm" placeholder="Price" />
                <input value={card.slug ?? ""} onChange={(event) => updateSolutionCard(index, "slug", event.target.value)} className="rounded border border-border-subtle bg-surface-base px-2 py-1 text-sm" placeholder="Slug" />
              </div>
            ))}
            {state.pricingTiers.map((tier, index) => (
              <div key={`${tier.title}-${index}`} className="grid gap-2 rounded-lg border border-border-subtle p-3">
                <input value={tier.title} onChange={(event) => updatePricingTier(index, "title", event.target.value)} className="rounded border border-border-subtle bg-surface-base px-2 py-1 text-sm" placeholder="Tier title" />
                <input value={tier.audience} onChange={(event) => updatePricingTier(index, "audience", event.target.value)} className="rounded border border-border-subtle bg-surface-base px-2 py-1 text-sm" placeholder="Audience" />
                <input value={tier.price} onChange={(event) => updatePricingTier(index, "price", event.target.value)} className="rounded border border-border-subtle bg-surface-base px-2 py-1 text-sm" placeholder="Price" />
              </div>
            ))}
            <textarea
              value={state.pricingAddonsText}
              onChange={(event) => setState({ ...state, pricingAddonsText: event.target.value })}
              rows={5}
              className="w-full rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-sm"
              placeholder="Add-ons: title | price"
            />
          </section>

          <section className="space-y-3 rounded-xl border border-border-subtle bg-surface-elevated p-4">
            <h2 className="font-display text-2xl">FAQ / Contact / Footer</h2>
            <textarea value={state.faqItemsText} onChange={(event) => setState({ ...state, faqItemsText: event.target.value })} rows={6} className="w-full rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-sm" placeholder="FAQ: question | answer" />
            <textarea value={state.contactChannelsText} onChange={(event) => setState({ ...state, contactChannelsText: event.target.value })} rows={5} className="w-full rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-sm" placeholder="Contact channels: label | value" />
            <input value={state.footerNote} onChange={(event) => setState({ ...state, footerNote: event.target.value })} className="w-full rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-sm" placeholder="Footer note" />
            <input value={state.footerCopyright} onChange={(event) => setState({ ...state, footerCopyright: event.target.value })} className="w-full rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-sm" placeholder="Footer copyright" />
          </section>

          <section className="space-y-3 rounded-xl border border-border-subtle bg-surface-elevated p-4">
            <h2 className="font-display text-2xl">Portfolio</h2>
            {state.portfolioItems.map((item, index) => (
              <div key={`${item.title}-${index}`} className="grid gap-2 rounded-lg border border-border-subtle p-3">
                <input value={item.title} onChange={(event) => updatePortfolioItem(index, "title", event.target.value)} className="rounded border border-border-subtle bg-surface-base px-2 py-1 text-sm" placeholder="Title" />
                <input value={item.visual} onChange={(event) => updatePortfolioItem(index, "visual", event.target.value)} className="rounded border border-border-subtle bg-surface-base px-2 py-1 text-sm" placeholder="Media URL" />
              </div>
            ))}
          </section>

          <section className="space-y-4 rounded-xl border border-border-subtle bg-surface-elevated p-4">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-2xl">Media Library</h2>
              <button
                type="button"
                onClick={() => loadMediaLibrary(locale, secretKey)}
                disabled={!connected || loadingMedia}
                className="rounded border border-border-subtle px-3 py-1 text-xs font-semibold"
              >
                {loadingMedia ? "Refreshing..." : "Refresh"}
              </button>
            </div>
            <p className="text-sm text-text-secondary">
              Sanity-first media management with locale/category metadata and placement assignments.
            </p>

            <div className="grid gap-3 rounded-lg border border-border-subtle bg-surface-base p-3 sm:grid-cols-2">
              <input
                value={mediaForm.title}
                onChange={(event) => setMediaForm({ ...mediaForm, title: event.target.value })}
                className="rounded border border-border-subtle bg-surface-elevated px-2 py-1 text-sm"
                placeholder="Title"
              />
              <select
                value={mediaForm.type}
                onChange={(event) =>
                  setMediaForm({ ...mediaForm, type: event.target.value as "image" | "video" })
                }
                className="rounded border border-border-subtle bg-surface-elevated px-2 py-1 text-sm"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
              <select
                value={mediaForm.category}
                onChange={(event) => setMediaForm({ ...mediaForm, category: event.target.value })}
                className="rounded border border-border-subtle bg-surface-elevated px-2 py-1 text-sm"
              >
                {MEDIA_CATEGORY_OPTIONS.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <select
                value={mediaForm.locale}
                onChange={(event) => setMediaForm({ ...mediaForm, locale: event.target.value as Locale | "all" })}
                className="rounded border border-border-subtle bg-surface-elevated px-2 py-1 text-sm"
              >
                <option value="all">all</option>
                <option value="he">he</option>
                <option value="en">en</option>
              </select>
              <input
                value={mediaForm.caption}
                onChange={(event) => setMediaForm({ ...mediaForm, caption: event.target.value })}
                className="rounded border border-border-subtle bg-surface-elevated px-2 py-1 text-sm"
                placeholder="Caption"
              />
              <input
                value={mediaForm.alt}
                onChange={(event) => setMediaForm({ ...mediaForm, alt: event.target.value })}
                className="rounded border border-border-subtle bg-surface-elevated px-2 py-1 text-sm"
                placeholder="Alt text"
              />
              <input
                value={mediaForm.linkUrl}
                onChange={(event) => setMediaForm({ ...mediaForm, linkUrl: event.target.value })}
                className="rounded border border-border-subtle bg-surface-elevated px-2 py-1 text-sm"
                placeholder="Optional link URL"
              />
              <input
                value={mediaForm.order}
                onChange={(event) => setMediaForm({ ...mediaForm, order: Number(event.target.value) || 100 })}
                type="number"
                className="rounded border border-border-subtle bg-surface-elevated px-2 py-1 text-sm"
                placeholder="Order"
              />
              <label className="flex items-center gap-2 text-sm text-text-secondary">
                <input
                  type="checkbox"
                  checked={mediaForm.featured}
                  onChange={(event) => setMediaForm({ ...mediaForm, featured: event.target.checked })}
                />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm text-text-secondary">
                <input
                  type="checkbox"
                  checked={mediaForm.hidden}
                  onChange={(event) => setMediaForm({ ...mediaForm, hidden: event.target.checked })}
                />
                Hidden
              </label>
              <label className="flex items-center gap-2 text-sm text-text-secondary">
                <input
                  type="checkbox"
                  checked={mediaForm.includeHome}
                  onChange={(event) => setMediaForm({ ...mediaForm, includeHome: event.target.checked })}
                />
                Place in Home gallery
              </label>
              <div />
              <input
                value={mediaForm.serviceIdsText}
                onChange={(event) => setMediaForm({ ...mediaForm, serviceIdsText: event.target.value })}
                className="rounded border border-border-subtle bg-surface-elevated px-2 py-1 text-sm"
                placeholder="Service IDs (comma-separated)"
              />
              <input
                value={mediaForm.solutionIdsText}
                onChange={(event) => setMediaForm({ ...mediaForm, solutionIdsText: event.target.value })}
                className="rounded border border-border-subtle bg-surface-elevated px-2 py-1 text-sm"
                placeholder="Solution IDs (comma-separated)"
              />
              <input
                value={mediaForm.portfolioIdsText}
                onChange={(event) => setMediaForm({ ...mediaForm, portfolioIdsText: event.target.value })}
                className="rounded border border-border-subtle bg-surface-elevated px-2 py-1 text-sm"
                placeholder="Portfolio IDs (comma-separated)"
              />
              <div />
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(event) => setMediaFile(event.target.files?.[0] ?? null)}
                className="block w-full text-sm text-text-secondary"
              />
              {mediaForm.type === "video" ? (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setMediaPosterFile(event.target.files?.[0] ?? null)}
                  className="block w-full text-sm text-text-secondary"
                />
              ) : (
                <div />
              )}
              <button
                type="button"
                onClick={createMediaAsset}
                disabled={!connected || uploadingMedia}
                className="rounded border border-accent bg-accent px-4 py-2 text-sm font-semibold text-white"
              >
                {uploadingMedia ? "Uploading..." : "Create media asset"}
              </button>
            </div>

            <details className="rounded border border-border-subtle bg-surface-base p-3 text-xs text-text-muted">
              <summary className="cursor-pointer font-semibold">Available target IDs</summary>
              <div className="mt-2 space-y-1">
                <p>Services: {mediaTargets.services.map((item) => `${item.id} (${item.slug || "no-slug"})`).join(", ") || "-"}</p>
                <p>Solutions: {mediaTargets.solutions.map((item) => `${item.id} (${item.slug || "no-slug"})`).join(", ") || "-"}</p>
                <p>Portfolio: {mediaTargets.portfolios.map((item) => item.id).join(", ") || "-"}</p>
              </div>
            </details>

            <div className="grid gap-2">
              {mediaLibrary.map((asset) => (
                <div key={asset.id} className="grid gap-2 rounded border border-border-subtle bg-surface-base p-3 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center">
                  <div>
                    <p className="truncate text-sm font-semibold text-text-primary">{asset.title || asset.id}</p>
                    <p className="text-xs text-text-muted">
                      {asset.mediaType} | {asset.category} | {asset.locale} | order {asset.order}
                    </p>
                    <p className="truncate text-xs text-text-muted">
                      linked: {asset.linkedTo.join(", ") || "general"}
                    </p>
                  </div>
                  <input
                    type="number"
                    defaultValue={asset.order}
                    className="w-20 rounded border border-border-subtle bg-surface-elevated px-2 py-1 text-xs"
                    onBlur={(event) => {
                      const nextOrder = Number(event.target.value);
                      if (Number.isFinite(nextOrder) && nextOrder !== asset.order) {
                        void patchMediaAsset(asset.id, { order: nextOrder });
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => patchMediaAsset(asset.id, { isFeatured: !asset.isFeatured })}
                    className="rounded border border-border-subtle px-2 py-1 text-xs"
                  >
                    {asset.isFeatured ? "Unfeature" : "Feature"}
                  </button>
                  <button
                    type="button"
                    onClick={() => patchMediaAsset(asset.id, { isHidden: !asset.isHidden })}
                    className="rounded border border-border-subtle px-2 py-1 text-xs"
                  >
                    {asset.isHidden ? "Unhide" : "Hide"}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText(asset.url || asset.imageUrl || asset.videoUrl)}
                    className="rounded border border-border-subtle px-2 py-1 text-xs sm:col-span-4 sm:justify-self-start"
                    disabled={uploadingMedia}
                  >
                    Copy URL
                  </button>
                </div>
              ))}
            </div>

            {legacyMediaLibrary.length ? (
              <details className="rounded border border-border-subtle bg-surface-base p-3 text-xs text-text-muted">
                <summary className="cursor-pointer font-semibold">Legacy Blob media (read-only)</summary>
                <div className="mt-2 grid gap-1">
                  {legacyMediaLibrary.map((asset) => (
                    <p key={asset.id}>
                      {asset.type} | {asset.title} | {asset.url}
                    </p>
                  ))}
                </div>
              </details>
            ) : null}
          </section>
        </>
      ) : null}
    </div>
  );
}
