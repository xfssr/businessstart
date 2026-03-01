import { NextResponse } from "next/server";

import { SUPPORTED_LOCALES, type Locale } from "@/lib/constants";
import {
  ensureStartStudioContent,
  isAdminAuthorized,
  saveStartStudioContent,
  uploadStartStudioMedia,
} from "@/lib/startstudio";

function isLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export async function POST(request: Request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const localeParam = String(formData.get("locale") ?? "he");
  const title = String(formData.get("title") ?? "").trim();
  const file = formData.get("file");

  if (!isLocale(localeParam)) {
    return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  try {
    const mediaItem = await uploadStartStudioMedia({
      file,
      locale: localeParam,
      title,
    });

    const content = await ensureStartStudioContent();
    content.mediaLibrary = [mediaItem, ...content.mediaLibrary].slice(0, 300);
    await saveStartStudioContent(content);

    return NextResponse.json({ ok: true, mediaItem });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: reason }, { status: 500 });
  }
}
