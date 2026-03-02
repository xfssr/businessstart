import { NextResponse } from "next/server";

import { isAdminAuthorized } from "@/lib/startstudio";
import {
  createMediaAssetInSanity,
  isSanityWriteConfigured,
  listMediaLibraryFromSanity,
  updateMediaAssetInSanity,
} from "@/lib/startstudio-sanity";

function parseBoolean(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return false;
  const normalized = value.trim().toLowerCase();
  return normalized === "true" || normalized === "1" || normalized === "yes" || normalized === "on";
}

function parseNumber(value: FormDataEntryValue | null, fallback = 100) {
  if (typeof value !== "string") return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseArrayInput(raw: string | null): string[] {
  if (!raw) return [];
  const value = raw.trim();
  if (!value) return [];

  if (value.startsWith("[")) {
    try {
      const parsed = JSON.parse(value) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item ?? "").trim()).filter(Boolean);
      }
    } catch {
      return [];
    }
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

type PatchBody = {
  id?: string;
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
};

export async function GET(request: Request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSanityWriteConfigured()) {
    return NextResponse.json(
      { error: "Sanity write is not configured" },
      { status: 500 },
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const data = await listMediaLibraryFromSanity({
      locale: searchParams.get("locale") || undefined,
      category: searchParams.get("category") || undefined,
      linkedTo: searchParams.get("linkedTo") || undefined,
      hidden: searchParams.get("hidden") || undefined,
    });

    return NextResponse.json({ ok: true, ...data });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: reason }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSanityWriteConfigured()) {
    return NextResponse.json({ error: "Sanity write is not configured" }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const posterFile = formData.get("posterFile");

    const mediaItem = await createMediaAssetInSanity({
      title: String(formData.get("title") ?? "").trim(),
      caption: String(formData.get("caption") ?? "").trim(),
      category: String(formData.get("category") ?? "general").trim(),
      locale: String(formData.get("locale") ?? "all").trim(),
      mediaType: String(formData.get("mediaType") ?? "image").trim() as "image" | "video",
      alt: String(formData.get("alt") ?? "").trim(),
      order: parseNumber(formData.get("order"), 100),
      isFeatured: parseBoolean(formData.get("isFeatured")),
      isHidden: parseBoolean(formData.get("isHidden")),
      linkUrl: String(formData.get("linkUrl") ?? "").trim(),
      linkedTo: parseArrayInput(String(formData.get("linkedTo") ?? "")),
      file: file instanceof File ? file : undefined,
      posterFile: posterFile instanceof File ? posterFile : null,
      placement: {
        includeHome: parseBoolean(formData.get("includeHome")),
        serviceIds: parseArrayInput(String(formData.get("serviceIds") ?? "")),
        solutionIds: parseArrayInput(String(formData.get("solutionIds") ?? "")),
        portfolioIds: parseArrayInput(String(formData.get("portfolioIds") ?? "")),
      },
    });

    return NextResponse.json({ ok: true, mediaItem });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: reason }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSanityWriteConfigured()) {
    return NextResponse.json({ error: "Sanity write is not configured" }, { status: 500 });
  }

  let body: PatchBody;
  try {
    body = (await request.json()) as PatchBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.id) {
    return NextResponse.json({ error: "Missing media asset id" }, { status: 400 });
  }

  try {
    const mediaItem = await updateMediaAssetInSanity({
      id: body.id,
      title: body.title,
      caption: body.caption,
      category: body.category,
      locale: body.locale,
      alt: body.alt,
      order: body.order,
      isFeatured: body.isFeatured,
      isHidden: body.isHidden,
      linkUrl: body.linkUrl,
      linkedTo: body.linkedTo,
      placement: body.placement,
    });

    return NextResponse.json({ ok: true, mediaItem });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: reason }, { status: 400 });
  }
}

