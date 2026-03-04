import { NextResponse } from "next/server";

import { SUPPORTED_LOCALES, type Locale } from "@/lib/constants";
import {
  ensureStartStudioContent,
  isAdminAuthorized,
  saveStartStudioContent,
  type StartStudioMediaAssignments,
  type StartStudioMediaItem,
  type StartStudioMediaLocale,
  uploadStartStudioMedia,
} from "@/lib/startstudio";

const ALLOWED_CATEGORIES = new Set([
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
]);
const ALLOWED_LINKED_TO = new Set(["home", "service", "solution", "portfolio", "general"]);
const MAX_VIDEO_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB
const MAX_IMAGE_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB
const MIN_SHORT_SIDE_PX = 720;
const MAX_SHORT_SIDE_PX = 1080;
const MAX_LONG_SIDE_PX = 1920;

type LibraryMediaItem = {
  id: string;
  title: string;
  caption: string;
  category: string;
  locale: StartStudioMediaLocale;
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
  assignments: StartStudioMediaAssignments;
  createdAt: string;
  updatedAt: string;
};

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

const EMPTY_MEDIA_LIBRARY_RESPONSE = {
  media: [] as LibraryMediaItem[],
  targets: {
    homePageId: null,
    services: [],
    solutions: [],
    portfolios: [],
  },
};

function isLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

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

function parseDimension(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function formatMegabytes(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function isLikelyVideoFile(file: File) {
  return file.type.startsWith("video/") || /\.(mp4|mov|webm|m4v|avi|mkv)$/i.test(file.name);
}

function isLikelyImageFile(file: File) {
  return file.type.startsWith("image/") || /\.(png|jpe?g|gif|webp|svg|avif|bmp|tiff?)$/i.test(file.name);
}

function isResolutionInAllowedRange(width: number, height: number) {
  const shortSide = Math.min(width, height);
  const longSide = Math.max(width, height);
  return shortSide >= MIN_SHORT_SIDE_PX && shortSide <= MAX_SHORT_SIDE_PX && longSide <= MAX_LONG_SIDE_PX;
}

function assertUploadPolicy({
  file,
  mediaType,
  width,
  height,
  label,
}: {
  file: File;
  mediaType: "image" | "video";
  width: number | null;
  height: number | null;
  label: "Image" | "Video" | "Poster";
}) {
  const maxBytes = mediaType === "video" ? MAX_VIDEO_FILE_SIZE_BYTES : MAX_IMAGE_FILE_SIZE_BYTES;
  if (file.size > maxBytes) {
    throw new Error(`${label} file is too large. Max ${formatMegabytes(maxBytes)}.`);
  }

  if (mediaType === "video" && !isLikelyVideoFile(file)) {
    throw new Error(`${label} file must be a valid video format.`);
  }
  if (mediaType === "image" && !isLikelyImageFile(file)) {
    throw new Error(`${label} file must be a valid image format.`);
  }

  if (!width || !height) {
    throw new Error(`${label} dimensions are missing. Please reselect the file and upload again.`);
  }

  if (!isResolutionInAllowedRange(width, height)) {
    throw new Error(
      `${label} resolution ${width}x${height} is outside allowed range (short side ${MIN_SHORT_SIDE_PX}-${MAX_SHORT_SIDE_PX}px, long side up to ${MAX_LONG_SIDE_PX}px).`,
    );
  }
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

function parseLocale(value: string | undefined): StartStudioMediaLocale {
  if (!value) return "all";
  if (value === "all") return "all";
  return isLocale(value) ? value : "all";
}

function parseLinkedTo(values: string[] | undefined): string[] {
  const normalized = (values ?? []).filter((value) => ALLOWED_LINKED_TO.has(value));
  return Array.from(new Set(normalized));
}

function parseAssignments(placement: PatchBody["placement"] | undefined): StartStudioMediaAssignments {
  return {
    home: Boolean(placement?.includeHome),
    serviceIds: Array.isArray(placement?.serviceIds)
      ? placement.serviceIds.map((item) => String(item ?? "").trim()).filter(Boolean)
      : [],
    solutionIds: Array.isArray(placement?.solutionIds)
      ? placement.solutionIds.map((item) => String(item ?? "").trim()).filter(Boolean)
      : [],
    portfolioIds: Array.isArray(placement?.portfolioIds)
      ? placement.portfolioIds.map((item) => String(item ?? "").trim()).filter(Boolean)
      : [],
  };
}

function deriveLinkedTo(linkedTo: string[], assignments: StartStudioMediaAssignments) {
  const out = new Set(parseLinkedTo(linkedTo));
  if (assignments.home) out.add("home");
  if (assignments.serviceIds.length) out.add("service");
  if (assignments.solutionIds.length) out.add("solution");
  if (assignments.portfolioIds.length) out.add("portfolio");
  if (!out.size) out.add("general");
  return Array.from(out);
}

function normalizeCategory(value: string | undefined) {
  if (!value) return "general";
  return ALLOWED_CATEGORIES.has(value) ? value : "general";
}

function normalizeAssignments(
  assignments: StartStudioMediaItem["assignments"],
  linkedTo: string[],
): StartStudioMediaAssignments {
  return {
    home: Boolean(assignments?.home || linkedTo.includes("home")),
    serviceIds: Array.isArray(assignments?.serviceIds) ? assignments.serviceIds : [],
    solutionIds: Array.isArray(assignments?.solutionIds) ? assignments.solutionIds : [],
    portfolioIds: Array.isArray(assignments?.portfolioIds) ? assignments.portfolioIds : [],
  };
}

function normalizeMediaItem(item: StartStudioMediaItem): LibraryMediaItem {
  const mediaType = item.type === "video" ? "video" : "image";
  const imageUrl = item.imageUrl || (mediaType === "image" ? item.url : "");
  const videoUrl = item.videoUrl || (mediaType === "video" ? item.url : "");
  const linkedTo = parseLinkedTo(item.linkedTo);
  const assignments = normalizeAssignments(item.assignments, linkedTo);

  return {
    id: item.id,
    title: item.title || "",
    caption: item.caption || "",
    category: normalizeCategory(item.category),
    locale: parseLocale(item.locale),
    mediaType,
    url: mediaType === "video" ? videoUrl || item.url : imageUrl || item.url,
    imageUrl,
    videoUrl,
    posterUrl: item.posterUrl || "",
    alt: item.alt || item.title || "",
    order: Number.isFinite(item.order) ? Number(item.order) : 100,
    isFeatured: Boolean(item.isFeatured),
    isHidden: Boolean(item.isHidden),
    linkUrl: item.linkUrl || "",
    linkedTo: deriveLinkedTo(linkedTo, assignments),
    assignments,
    createdAt: item.createdAt || new Date(0).toISOString(),
    updatedAt: item.updatedAt || item.createdAt || new Date(0).toISOString(),
  };
}

function sortMedia(items: LibraryMediaItem[]) {
  return [...items].sort((left, right) => {
    if (left.order !== right.order) return left.order - right.order;
    return right.createdAt.localeCompare(left.createdAt);
  });
}

export async function GET(request: Request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const localeFilter = parseLocale(searchParams.get("locale") || undefined);
    const categoryFilter = normalizeCategory(searchParams.get("category") || undefined);
    const linkedToFilter = searchParams.get("linkedTo") || undefined;
    const hiddenFilter = searchParams.get("hidden") || undefined;

    const content = await ensureStartStudioContent();
    let media = sortMedia(content.mediaLibrary.map((item) => normalizeMediaItem(item)));

    if (localeFilter !== "all") {
      media = media.filter((item) => item.locale === localeFilter || item.locale === "all");
    }
    if (searchParams.has("category")) {
      media = media.filter((item) => item.category === categoryFilter);
    }
    if (linkedToFilter && ALLOWED_LINKED_TO.has(linkedToFilter)) {
      media = media.filter((item) => item.linkedTo.includes(linkedToFilter));
    }
    if (hiddenFilter === "true") {
      media = media.filter((item) => item.isHidden);
    } else if (hiddenFilter === "false") {
      media = media.filter((item) => !item.isHidden);
    }

    return NextResponse.json({ ok: true, media, targets: EMPTY_MEDIA_LIBRARY_RESPONSE.targets });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: reason, ...EMPTY_MEDIA_LIBRARY_RESPONSE }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const posterFile = formData.get("posterFile");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing media file" }, { status: 400 });
    }

    const mediaType = String(formData.get("mediaType") ?? "image").trim() === "video" ? "video" : "image";
    const category = normalizeCategory(String(formData.get("category") ?? "general").trim());
    const locale = parseLocale(String(formData.get("locale") ?? "all").trim());
    const title = String(formData.get("title") ?? "").trim() || file.name;
    const caption = String(formData.get("caption") ?? "").trim();
    const alt = String(formData.get("alt") ?? "").trim();
    const linkUrl = String(formData.get("linkUrl") ?? "").trim();
    const order = parseNumber(formData.get("order"), 100);
    const mediaWidth = parseDimension(formData.get("mediaWidth"));
    const mediaHeight = parseDimension(formData.get("mediaHeight"));
    const posterWidth = parseDimension(formData.get("posterWidth"));
    const posterHeight = parseDimension(formData.get("posterHeight"));

    assertUploadPolicy({
      file,
      mediaType,
      width: mediaWidth,
      height: mediaHeight,
      label: mediaType === "video" ? "Video" : "Image",
    });

    const assignments = parseAssignments({
      includeHome: parseBoolean(formData.get("includeHome")),
      serviceIds: parseArrayInput(String(formData.get("serviceIds") ?? "")),
      solutionIds: parseArrayInput(String(formData.get("solutionIds") ?? "")),
      portfolioIds: parseArrayInput(String(formData.get("portfolioIds") ?? "")),
    });
    const linkedTo = deriveLinkedTo(parseArrayInput(String(formData.get("linkedTo") ?? "")), assignments);

    const uploadedMain = await uploadStartStudioMedia({
      file,
      locale,
      title,
    });

    let posterUrl = "";
    if (mediaType === "video" && posterFile instanceof File) {
      assertUploadPolicy({
        file: posterFile,
        mediaType: "image",
        width: posterWidth,
        height: posterHeight,
        label: "Poster",
      });

      const posterUpload = await uploadStartStudioMedia({
        file: posterFile,
        locale,
        title: `${title} poster`,
      });
      posterUrl = posterUpload.url;
    }

    const now = new Date().toISOString();
    const imageUrl = mediaType === "image" ? uploadedMain.url : "";
    const videoUrl = mediaType === "video" ? uploadedMain.url : "";

    const created: StartStudioMediaItem = {
      id: crypto.randomUUID(),
      locale,
      type: mediaType,
      title,
      url: mediaType === "video" ? videoUrl : imageUrl,
      rawUrl: uploadedMain.rawUrl,
      pathname: uploadedMain.pathname,
      caption,
      category,
      alt,
      order,
      isFeatured: parseBoolean(formData.get("isFeatured")),
      isHidden: parseBoolean(formData.get("isHidden")),
      linkUrl,
      linkedTo,
      assignments,
      imageUrl,
      videoUrl,
      posterUrl,
      createdAt: now,
      updatedAt: now,
    };

    const content = await ensureStartStudioContent();
    content.mediaLibrary = [created, ...content.mediaLibrary].slice(0, 1000);
    content.updatedAt = now;
    await saveStartStudioContent(content);

    return NextResponse.json({ ok: true, mediaItem: normalizeMediaItem(created) });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: reason }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    const content = await ensureStartStudioContent();
    const index = content.mediaLibrary.findIndex((item) => item.id === body.id);
    if (index < 0) {
      return NextResponse.json({ error: "Media asset not found" }, { status: 404 });
    }

    const current = normalizeMediaItem(content.mediaLibrary[index]);
    const assignments = body.placement ? parseAssignments(body.placement) : current.assignments;
    const linkedTo = body.linkedTo
      ? deriveLinkedTo(body.linkedTo, assignments)
      : body.placement
        ? deriveLinkedTo(current.linkedTo, assignments)
        : current.linkedTo;

    const mediaType = current.mediaType;
    const now = new Date().toISOString();

    const updated: StartStudioMediaItem = {
      ...content.mediaLibrary[index],
      title: typeof body.title === "string" ? body.title.trim() : current.title,
      caption: typeof body.caption === "string" ? body.caption.trim() : current.caption,
      category: typeof body.category === "string" ? normalizeCategory(body.category) : current.category,
      locale: typeof body.locale === "string" ? parseLocale(body.locale) : current.locale,
      type: mediaType,
      url: mediaType === "video" ? current.videoUrl || current.url : current.imageUrl || current.url,
      imageUrl: current.imageUrl,
      videoUrl: current.videoUrl,
      posterUrl: current.posterUrl,
      alt: typeof body.alt === "string" ? body.alt.trim() : current.alt,
      order: typeof body.order === "number" && Number.isFinite(body.order) ? body.order : current.order,
      isFeatured: typeof body.isFeatured === "boolean" ? body.isFeatured : current.isFeatured,
      isHidden: typeof body.isHidden === "boolean" ? body.isHidden : current.isHidden,
      linkUrl: typeof body.linkUrl === "string" ? body.linkUrl.trim() : current.linkUrl,
      linkedTo,
      assignments,
      createdAt: content.mediaLibrary[index].createdAt || current.createdAt,
      updatedAt: now,
    };

    content.mediaLibrary[index] = updated;
    content.updatedAt = now;
    await saveStartStudioContent(content);

    return NextResponse.json({ ok: true, mediaItem: normalizeMediaItem(updated) });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: reason }, { status: 400 });
  }
}
