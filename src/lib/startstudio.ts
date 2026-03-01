import "server-only";

import { list, put } from "@vercel/blob";

import { type Locale } from "@/lib/constants";

type BlobAccess = "public" | "private";

export type StartStudioMediaItem = {
  id: string;
  locale: Locale;
  type: "image" | "video";
  title: string;
  url: string;
  rawUrl?: string;
  pathname?: string;
  createdAt: string;
};

export type StartStudioContent = {
  updatedAt: string;
  global?: {
    whatsappNumber?: string;
  };
  locales: Record<
    Locale,
    {
      messages?: Record<string, unknown>;
    }
  >;
  mediaLibrary: StartStudioMediaItem[];
};

const CONTENT_PATH = "startstudio/content.json";
const MEDIA_PREFIX = "startstudio/media";

function emptyContent(): StartStudioContent {
  return {
    updatedAt: new Date().toISOString(),
    locales: { he: {}, en: {} },
    mediaLibrary: [],
  };
}

function hasBlobToken() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function getBlobAccess(): BlobAccess {
  return process.env.STARTSTUDIO_BLOB_ACCESS === "public" ? "public" : "private";
}

function getBlobFetchHeaders() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return undefined;
  }

  return {
    Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
  };
}

async function findContentUrl() {
  if (!hasBlobToken()) {
    return process.env.NEXT_PUBLIC_STARTSTUDIO_CONTENT_URL ?? null;
  }

  const { blobs } = await list({ prefix: CONTENT_PATH, limit: 1 });
  return blobs[0]?.url ?? null;
}

export async function getStartStudioContent(): Promise<StartStudioContent | null> {
  try {
    const url = await findContentUrl();
    if (!url) {
      return null;
    }

    const response = await fetch(url, {
      cache: "no-store",
      headers: getBlobFetchHeaders(),
    });
    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as StartStudioContent;
    return data;
  } catch {
    return null;
  }
}

export async function saveStartStudioContent(content: StartStudioContent) {
  if (!hasBlobToken()) {
    throw new Error("BLOB_READ_WRITE_TOKEN is missing");
  }

  const payload = JSON.stringify(
    {
      ...content,
      updatedAt: new Date().toISOString(),
    },
    null,
    2,
  );

  const result = await put(CONTENT_PATH, payload, {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json; charset=utf-8",
  });

  return result.url;
}

export async function ensureStartStudioContent() {
  const current = await getStartStudioContent();
  if (current) {
    return current;
  }

  const fallback = emptyContent();

  if (hasBlobToken()) {
    await saveStartStudioContent(fallback);
  }

  return fallback;
}

export async function uploadStartStudioMedia({
  file,
  locale,
  title,
}: {
  file: File;
  locale: Locale;
  title?: string;
}) {
  if (!hasBlobToken()) {
    throw new Error("BLOB_READ_WRITE_TOKEN is missing");
  }

  const extension = file.name.includes(".") ? file.name.split(".").pop() : "";
  const safeExtension = extension ? `.${extension}` : "";
  const type = file.type.startsWith("video/") ? "video" : "image";
  const pathname = `${MEDIA_PREFIX}/${locale}/${Date.now()}-${crypto.randomUUID()}${safeExtension}`;
  const access = getBlobAccess();

  const upload = await put(pathname, file, {
    access,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: file.type || undefined,
  });

  const url =
    access === "private"
      ? `/api/startstudio/media?pathname=${encodeURIComponent(upload.pathname)}`
      : upload.url;

  const mediaItem: StartStudioMediaItem = {
    id: crypto.randomUUID(),
    locale,
    type,
    title: title?.trim() || file.name,
    url,
    rawUrl: upload.url,
    pathname: upload.pathname,
    createdAt: new Date().toISOString(),
  };

  return mediaItem;
}

export function isAdminAuthorized(request: Request) {
  const secret = process.env.STARTSTUDIO_ADMIN_KEY;
  if (!secret) {
    return true;
  }

  const headerKey = request.headers.get("x-startstudio-key");
  return headerKey === secret;
}
