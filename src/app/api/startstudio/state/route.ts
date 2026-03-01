import { NextResponse } from "next/server";

import { SUPPORTED_LOCALES, type Locale } from "@/lib/constants";
import { getLocaleMessages } from "@/lib/site-content";
import { ensureStartStudioContent, isAdminAuthorized } from "@/lib/startstudio";

function isLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export async function GET(request: Request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const localeParam = url.searchParams.get("locale") ?? "he";
  const locale = isLocale(localeParam) ? localeParam : "he";

  const [messages, content] = await Promise.all([
    getLocaleMessages(locale),
    ensureStartStudioContent(),
  ]);

  const patch = content.locales[locale]?.messages ?? {};
  const mediaLibrary = content.mediaLibrary
    .filter((item) => item.locale === locale)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return NextResponse.json({
    locale,
    messages,
    patch,
    mediaLibrary,
    updatedAt: content.updatedAt,
  });
}
