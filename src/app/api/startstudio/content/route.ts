import { NextResponse } from "next/server";

import { SUPPORTED_LOCALES, type Locale } from "@/lib/constants";
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

  const messages = isRecord(body.messages) ? body.messages : {};

  try {
    const content = await ensureStartStudioContent();
    const updatedAt = new Date().toISOString();

    content.locales[localeParam] = { messages };
    if (typeof body.whatsappNumber === "string") {
      const normalized = body.whatsappNumber.trim();
      content.global = {
        ...(content.global ?? {}),
        whatsappNumber: normalized,
      };
    }
    content.updatedAt = updatedAt;

    const blobUrl = await saveStartStudioContent(content);

    return NextResponse.json({ ok: true, updatedAt, blobUrl });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: reason }, { status: 500 });
  }
}
