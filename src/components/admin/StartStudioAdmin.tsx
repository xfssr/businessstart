"use client";

import { useMemo, useState } from "react";

import { type Locale } from "@/lib/constants";
import { cn } from "@/lib/cn";

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

type AdminState = {
  heroTitle: string;
  heroDescription: string;
  whatsappNumber: string;
  standardCards: ServiceCard[];
  solutionCards: SolutionCard[];
  pricingTiers: PricingTier[];
  portfolioItems: PortfolioItem[];
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

function createInitialState(messages: Record<string, unknown>): AdminState {
  const hero = (messages.hero as Record<string, unknown>) ?? {};
  const servicesPage = (messages.servicesPage as Record<string, unknown>) ?? {};
  const solutionsPage = (messages.solutionsPage as Record<string, unknown>) ?? {};
  const pricingPage = (messages.pricingPage as Record<string, unknown>) ?? {};
  const portfolio = (messages.portfolio as Record<string, unknown>) ?? {};
  const global = (messages.global as Record<string, unknown>) ?? {};

  return {
    heroTitle: String(hero.title ?? ""),
    heroDescription: String(hero.description ?? ""),
    whatsappNumber: String(global.whatsappNumber ?? ""),
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

export function StartStudioAdmin() {
  const [locale, setLocale] = useState<Locale>("he");
  const [secretKey, setSecretKey] = useState("");
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
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
      setStatus("Loaded");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load";
      setStatus(message);
      setConnected(false);
    } finally {
      setLoading(false);
    }
  }

  async function saveState() {
    if (!state) {
      return;
    }

    setSaving(true);
    setStatus("");

    const patch = {
      hero: {
        title: state.heroTitle,
        description: state.heroDescription,
      },
      servicesPage: {
        standardCards: state.standardCards,
      },
      solutionsPage: {
        cards: state.solutionCards,
      },
      pricingPage: {
        tiers: state.pricingTiers,
      },
      portfolio: {
        items: state.portfolioItems,
      },
      global: {
        whatsappNumber: state.whatsappNumber,
      },
    };

    try {
      const response = await fetch("/api/startstudio/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-startstudio-key": secretKey,
        },
        body: JSON.stringify({
          locale,
          messages: patch,
          whatsappNumber: state.whatsappNumber,
        }),
      });

      if (!response.ok) {
        throw new Error("Save failed");
      }

      setStatus("Saved to Vercel Blob");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Save failed";
      setStatus(message);
    } finally {
      setSaving(false);
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
        throw new Error("Upload failed");
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
      <h1 className="font-display text-4xl">StartStudio Admin</h1>
      <p className="text-sm text-text-secondary">
        Edit descriptions, prices, and media URLs. Upload photo/video to Vercel Blob and paste URL into cards.
      </p>

      <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
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
            <h2 className="font-display text-2xl">Hero</h2>
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
            <input
              value={state.whatsappNumber}
              onChange={(event) => setState({ ...state, whatsappNumber: event.target.value })}
              className="w-full rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-sm"
              placeholder="WhatsApp number (e.g. 972500000000)"
            />
          </section>

          <section className="space-y-3 rounded-xl border border-border-subtle bg-surface-elevated p-4">
            <h2 className="font-display text-2xl">Services (Standard Cards)</h2>
            {state.standardCards.map((card, index) => (
              <div key={`${card.title}-${index}`} className="grid gap-2 rounded-lg border border-border-subtle p-3">
                <input value={card.title} onChange={(e) => updateServiceCard(index, "title", e.target.value)} className="rounded border border-border-subtle bg-surface-base px-2 py-1 text-sm" placeholder="Title" />
                <input value={card.audience} onChange={(e) => updateServiceCard(index, "audience", e.target.value)} className="rounded border border-border-subtle bg-surface-base px-2 py-1 text-sm" placeholder="Audience / subtitle" />
                <input value={card.price} onChange={(e) => updateServiceCard(index, "price", e.target.value)} className="rounded border border-border-subtle bg-surface-base px-2 py-1 text-sm" placeholder="Price" />
              </div>
            ))}
          </section>

          <section className="space-y-3 rounded-xl border border-border-subtle bg-surface-elevated p-4">
            <h2 className="font-display text-2xl">Solutions</h2>
            {state.solutionCards.map((card, index) => (
              <div key={`${card.title}-${index}`} className="grid gap-2 rounded-lg border border-border-subtle p-3">
                <input value={card.title} onChange={(e) => updateSolutionCard(index, "title", e.target.value)} className="rounded border border-border-subtle bg-surface-base px-2 py-1 text-sm" placeholder="Title" />
                <input value={card.fit} onChange={(e) => updateSolutionCard(index, "fit", e.target.value)} className="rounded border border-border-subtle bg-surface-base px-2 py-1 text-sm" placeholder="Business problem / fit" />
                <input value={card.price} onChange={(e) => updateSolutionCard(index, "price", e.target.value)} className="rounded border border-border-subtle bg-surface-base px-2 py-1 text-sm" placeholder="Price" />
              </div>
            ))}
          </section>

          <section className="space-y-3 rounded-xl border border-border-subtle bg-surface-elevated p-4">
            <h2 className="font-display text-2xl">Pricing Tiers</h2>
            {state.pricingTiers.map((tier, index) => (
              <div key={`${tier.title}-${index}`} className="grid gap-2 rounded-lg border border-border-subtle p-3">
                <input value={tier.title} onChange={(e) => updatePricingTier(index, "title", e.target.value)} className="rounded border border-border-subtle bg-surface-base px-2 py-1 text-sm" placeholder="Tier name" />
                <input value={tier.audience} onChange={(e) => updatePricingTier(index, "audience", e.target.value)} className="rounded border border-border-subtle bg-surface-base px-2 py-1 text-sm" placeholder="Who it's for" />
                <input value={tier.price} onChange={(e) => updatePricingTier(index, "price", e.target.value)} className="rounded border border-border-subtle bg-surface-base px-2 py-1 text-sm" placeholder="Price" />
              </div>
            ))}
          </section>

          <section className="space-y-3 rounded-xl border border-border-subtle bg-surface-elevated p-4">
            <h2 className="font-display text-2xl">Portfolio Media</h2>
            {state.portfolioItems.map((item, index) => (
              <div key={`${item.title}-${index}`} className="grid gap-2 rounded-lg border border-border-subtle p-3">
                <input value={item.title} onChange={(e) => updatePortfolioItem(index, "title", e.target.value)} className="rounded border border-border-subtle bg-surface-base px-2 py-1 text-sm" placeholder="Title" />
                <input value={item.subtitle} onChange={(e) => updatePortfolioItem(index, "subtitle", e.target.value)} className="rounded border border-border-subtle bg-surface-base px-2 py-1 text-sm" placeholder="Subtitle" />
                <input value={item.metric} onChange={(e) => updatePortfolioItem(index, "metric", e.target.value)} className="rounded border border-border-subtle bg-surface-base px-2 py-1 text-sm" placeholder="Metric" />
                <input value={item.visual} onChange={(e) => updatePortfolioItem(index, "visual", e.target.value)} className="rounded border border-border-subtle bg-surface-base px-2 py-1 text-sm" placeholder="Media URL (image or mp4)" />
                <select value={item.mediaType ?? "image"} onChange={(e) => updatePortfolioItem(index, "mediaType", e.target.value)} className="rounded border border-border-subtle bg-surface-base px-2 py-1 text-sm">
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>
            ))}
          </section>

          <section className="space-y-3 rounded-xl border border-border-subtle bg-surface-elevated p-4">
            <h2 className="font-display text-2xl">Vercel Blob Upload</h2>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  void uploadMedia(file);
                }
              }}
              className="block w-full text-sm text-text-secondary"
            />
            <p className="text-xs text-text-muted">
              Upload photo/video. After upload, copy URL and paste into portfolio/service fields.
            </p>
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
