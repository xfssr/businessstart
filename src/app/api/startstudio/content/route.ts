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

  const content = await ensureStartStudioContent();
  content.locales[localeParam] = {
    messages: body.messages ?? {},
  };

  if (typeof body.whatsappNumber === "string") {
    content.global = {
      ...(content.global ?? {}),
      whatsappNumber: body.whatsappNumber.trim(),
    };
  }

  try {
    const url = await saveStartStudioContent(content);
    return NextResponse.json({ ok: true, url, updatedAt: content.updatedAt });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: reason }, { status: 500 });
  }
}
