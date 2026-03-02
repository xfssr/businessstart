import "server-only";

import { type Locale, SUPPORTED_LOCALES } from "@/lib/constants";
import type { StartStudioContent } from "@/lib/startstudio";
import { isSanityConfigured, sanityWriteClient } from "@/sanity/lib/client";

const GLOBAL_SETTINGS_FALLBACK_ID = "globalSettings";

type SaveLocaleInput = {
  locale: Locale;
  messages: Record<string, unknown>;
  whatsappNumber?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

export function isSanityWriteConfigured() {
  return isSanityConfigured() && Boolean(process.env.SANITY_API_WRITE_TOKEN);
}

export function localeDocId(locale: Locale) {
  return `startStudioLocale.${locale}`;
}

async function resolveGlobalSettingsId() {
  try {
    const existing = await sanityWriteClient.fetch<string | null>(`*[_type == "globalSettings"][0]._id`);
    return existing ?? GLOBAL_SETTINGS_FALLBACK_ID;
  } catch {
    return GLOBAL_SETTINGS_FALLBACK_ID;
  }
}

async function upsertWhatsAppNumber(whatsappNumber: string) {
  const normalized = whatsappNumber.trim();
  if (!normalized) return;

  const globalId = await resolveGlobalSettingsId();
  await sanityWriteClient
    .transaction()
    .createIfNotExists({
      _id: globalId,
      _type: "globalSettings",
    })
    .patch(globalId, (patch) => patch.set({ whatsappNumber: normalized }))
    .commit();
}

export async function saveStartStudioLocaleToSanity({
  locale,
  messages,
  whatsappNumber,
}: SaveLocaleInput) {
  if (!isSanityWriteConfigured()) {
    throw new Error("Sanity write is not configured");
  }

  const now = new Date().toISOString();
  const payload = isRecord(messages) ? messages : {};

  await sanityWriteClient.createOrReplace({
    _id: localeDocId(locale),
    _type: "startStudioLocale",
    locale,
    messagesJson: JSON.stringify(payload, null, 2),
    updatedAt: now,
  });

  if (typeof whatsappNumber === "string") {
    await upsertWhatsAppNumber(whatsappNumber);
  }

  return { updatedAt: now };
}

export async function migrateLegacyBlobContentToSanity(content: StartStudioContent) {
  if (!isSanityWriteConfigured()) {
    throw new Error("Sanity write is not configured");
  }

  const now = new Date().toISOString();
  const tx = sanityWriteClient.transaction();

  let migratedLocales = 0;
  for (const locale of SUPPORTED_LOCALES) {
    const patch = content.locales?.[locale]?.messages;
    if (!isRecord(patch)) continue;

    tx.createOrReplace({
      _id: localeDocId(locale),
      _type: "startStudioLocale",
      locale,
      messagesJson: JSON.stringify(patch, null, 2),
      updatedAt: now,
    });
    migratedLocales += 1;
  }

  if (migratedLocales > 0) {
    await tx.commit();
  }

  if (content.global?.whatsappNumber) {
    await upsertWhatsAppNumber(content.global.whatsappNumber);
  }

  return {
    migratedLocales,
    updatedAt: now,
  };
}
