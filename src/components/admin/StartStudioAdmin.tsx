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
  title: string;
  fit: string;
  price: string;
  include: string[];
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
      ...card,
      include: card.include ?? [],
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
      cards: state.solutionCards,
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
    },
  };
}

export function StartStudioAdmin() {
  const [locale, setLocale] = useState<Locale>("he");
  const [secretKey, setSecretKey] = useState("");
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [state, setState] = useState<AdminState | null>(null);
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>([]);
  const [status, setStatus] = useState("");

  const localeLabel = useMemo(() => (locale === "he" ? "עברית" : "English"), [locale]);

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
      setMediaLibrary(data.mediaLibrary ?? []);
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

  async function uploadMedia(file: File) {
    setUploading(true);
    setStatus("");

    try {
      const formData = new FormData();
      formData.append("locale", locale);
      formData.append("title", file.name);
      formData.append("file", file);

      const response = await fetch("/api/startstudio/upload", {
        method: "POST",
        headers: {
          "x-startstudio-key": secretKey,
        },
        body: formData,
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || "Upload failed");
      }

      const data = (await response.json()) as { mediaItem: MediaItem };
      setMediaLibrary((prev) => [data.mediaItem, ...prev]);
      setStatus("Uploaded");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed";
      setStatus(message);
    } finally {
      setUploading(false);
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
    if (key === "include") return;
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
        Sanity-first editor for copy, product cards, pricing, SEO snippets, and Blob media.
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
                <input value={card.fit} onChange={(event) => updateSolutionCard(index, "fit", event.target.value)} className="rounded border border-border-subtle bg-surface-base px-2 py-1 text-sm" placeholder="Problem / fit" />
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
          </section>

          <section className="space-y-3 rounded-xl border border-border-subtle bg-surface-elevated p-4">
            <h2 className="font-display text-2xl">Portfolio / Media Upload</h2>
            {state.portfolioItems.map((item, index) => (
              <div key={`${item.title}-${index}`} className="grid gap-2 rounded-lg border border-border-subtle p-3">
                <input value={item.title} onChange={(event) => updatePortfolioItem(index, "title", event.target.value)} className="rounded border border-border-subtle bg-surface-base px-2 py-1 text-sm" placeholder="Title" />
                <input value={item.visual} onChange={(event) => updatePortfolioItem(index, "visual", event.target.value)} className="rounded border border-border-subtle bg-surface-base px-2 py-1 text-sm" placeholder="Media URL" />
              </div>
            ))}
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void uploadMedia(file);
              }}
              className="block w-full text-sm text-text-secondary"
            />
            <div className="grid gap-2">
              {mediaLibrary.map((asset) => (
                <div key={asset.id} className="flex items-center gap-2 rounded border border-border-subtle bg-surface-base p-2">
                  <span className="text-xs uppercase text-text-muted">{asset.type}</span>
                  <p className="truncate text-sm text-text-primary">{asset.title}</p>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText(asset.url)}
                    className="ms-auto rounded border border-border-subtle px-2 py-1 text-xs"
                    disabled={uploading}
                  >
                    Copy URL
                  </button>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}
