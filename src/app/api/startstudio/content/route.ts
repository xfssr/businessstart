import { NextResponse } from "next/server";

import { SUPPORTED_LOCALES, type Locale } from "@/lib/constants";
import {
  isSanityWriteConfigured,
  saveStartStudioLocaleToSanity,
} from "@/lib/startstudio-sanity";
import {
  ensureStartStudioContent,
  isAdminAuthorized,
  saveStartStudioContent,
} from "@/lib/startstudio";

type SaveBody = {
  locale?: string;
  messages?: Record<string, unknown>;
  whatsappNumber?: string;
};

function isLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

export async function PUT(request: Request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: SaveBody;
  try {
    body = (await request.json()) as SaveBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const localeParam = body.locale ?? "he";
  if (!isLocale(localeParam)) {
    return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
  }

  if (!isSanityWriteConfigured()) {
    return NextResponse.json(
      {
        error: "Sanity write is not configured (missing project/dataset or SANITY_API_WRITE_TOKEN)",
      },
      { status: 500 },
    );
  }

  const messages = isRecord(body.messages) ? body.messages : {};

  try {
    const { updatedAt } = await saveStartStudioLocaleToSanity({
      locale: localeParam,
      messages,
      whatsappNumber: body.whatsappNumber,
    });

    // Keep legacy Blob patch in sync as a fallback source if Sanity becomes unavailable.
    let legacyUrl: string | null = null;
    try {
      const legacy = await ensureStartStudioContent();
      legacy.locales[localeParam] = { messages };
      if (typeof body.whatsappNumber === "string") {
        legacy.global = {
          ...(legacy.global ?? {}),
          whatsappNumber: body.whatsappNumber.trim(),
        };
      }
      legacyUrl = await saveStartStudioContent(legacy);
    } catch {
      // Blob may be intentionally disabled; Sanity is the primary source of truth.
    }

    return NextResponse.json({ ok: true, updatedAt, legacyUrl });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: reason }, { status: 500 });
  }
}
