import "server-only";

import { type Locale, SUPPORTED_LOCALES } from "@/lib/constants";
import type { StartStudioContent } from "@/lib/startstudio";
import { isSanityConfigured, sanityWriteClient } from "@/sanity/lib/client";

const GLOBAL_SETTINGS_FALLBACK_ID = "globalSettings";
const ALLOWED_MEDIA_CATEGORIES = new Set([
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
const ALLOWED_MEDIA_LOCALES = new Set(["he", "en", "all"]);
const ALLOWED_LINKED_TO = new Set(["home", "service", "solution", "portfolio", "general"]);

type SaveLocaleInput = {
  locale: Locale;
  messages: Record<string, unknown>;
  whatsappNumber?: string;
};

type MediaType = "image" | "video";
type MediaLocale = Locale | "all";
type LinkedTo = "home" | "service" | "solution" | "portfolio" | "general";

type PlacementInput = {
  includeHome?: boolean;
  serviceIds?: string[];
  solutionIds?: string[];
  portfolioIds?: string[];
};

type CreateMediaAssetInput = {
  title: string;
  caption?: string;
  category: string;
  locale: string;
  mediaType: MediaType;
  alt?: string;
  order?: number;
  isFeatured?: boolean;
  isHidden?: boolean;
  linkUrl?: string;
  linkedTo?: string[];
  file?: File;
  posterFile?: File | null;
  placement?: PlacementInput;
};

type UpdateMediaAssetInput = {
  id: string;
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
  placement?: PlacementInput;
};

type ListMediaAssetsOptions = {
  locale?: string;
  category?: string;
  linkedTo?: string;
  hidden?: string;
};

type LocalizedValue = string | { he?: string | null; en?: string | null } | null | undefined;
type SlugValue = { he?: { current?: string | null } | null; en?: { current?: string | null } | null } | null;

type MediaAssetSanity = {
  _id: string;
  _createdAt?: string;
  _updatedAt?: string;
  title?: string;
  caption?: string;
  category?: string;
  locale?: string;
  mediaType?: MediaType;
  alt?: string;
  order?: number;
  isFeatured?: boolean;
  isHidden?: boolean;
  linkUrl?: string;
  linkedTo?: string[];
  imageFile?: { asset?: { url?: string | null } | null } | null;
  videoFile?: { asset?: { url?: string | null } | null } | null;
  videoPoster?: { asset?: { url?: string | null } | null } | null;
};

type AssignmentDoc = {
  _id: string;
  examplesGalleryItems?: Array<{ _ref?: string }>;
  galleryItems?: Array<{ _ref?: string }>;
};

type TargetService = {
  _id: string;
  title?: LocalizedValue;
  slug?: SlugValue;
};

type TargetSolution = {
  _id: string;
  title?: LocalizedValue;
  slug?: SlugValue;
};

type TargetPortfolio = {
  _id: string;
  title?: LocalizedValue;
};

export type MediaLibraryItem = {
  id: string;
  title: string;
  caption: string;
  category: string;
  locale: MediaLocale;
  mediaType: MediaType;
  url: string;
  imageUrl: string;
  videoUrl: string;
  posterUrl: string;
  alt: string;
  order: number;
  isFeatured: boolean;
  isHidden: boolean;
  linkUrl: string;
  linkedTo: LinkedTo[];
  assignments: {
    home: boolean;
    serviceIds: string[];
    solutionIds: string[];
    portfolioIds: string[];
  };
  createdAt: string;
  updatedAt: string;
};

export type MediaTargetItem = {
  id: string;
  title: string;
  slug?: string;
};

export type MediaLibraryResponse = {
  media: MediaLibraryItem[];
  targets: {
    homePageId: string | null;
    services: MediaTargetItem[];
    solutions: MediaTargetItem[];
    portfolios: MediaTargetItem[];
  };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function normalizeLocale(value: string | undefined): MediaLocale {
  if (!value) return "all";
  return ALLOWED_MEDIA_LOCALES.has(value) ? (value as MediaLocale) : "all";
}

function normalizeLinkedTo(values: string[] | undefined): LinkedTo[] {
  const normalized = (values ?? []).filter((value) => ALLOWED_LINKED_TO.has(value)) as LinkedTo[];
  return Array.from(new Set(normalized));
}

function pickLocalized(value: LocalizedValue): string {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return "";
  return value.he || value.en || "";
}

function pickSlug(value: SlugValue | undefined): string {
  return value?.he?.current || value?.en?.current || "";
}

function ensureStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item ?? "").trim()).filter(Boolean);
}

function mediaRef(ref: string) {
  return { _type: "reference", _ref: ref };
}

function deriveLinkedTo(base: LinkedTo[], placement?: PlacementInput): LinkedTo[] {
  const out = new Set<LinkedTo>(base);
  if (!placement) return Array.from(out);
  if (placement.includeHome) out.add("home");
  if ((placement.serviceIds ?? []).length) out.add("service");
  if ((placement.solutionIds ?? []).length) out.add("solution");
  if ((placement.portfolioIds ?? []).length) out.add("portfolio");
  return Array.from(out);
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

async function resolveHomePageId() {
  try {
    return await sanityWriteClient.fetch<string | null>(`*[_type == "homePage"][0]._id`);
  } catch {
    return null;
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

async function uploadAsset(file: File, type: "image" | "file") {
  const buffer = Buffer.from(await file.arrayBuffer());
  return sanityWriteClient.assets.upload(type, buffer, {
    filename: file.name,
    contentType: file.type || undefined,
  });
}

async function removeReferenceFromAllPlacements(mediaId: string) {
  const docs = await sanityWriteClient.fetch<Array<{ _id: string; _type: string }>>(
    `*[_type in ["homePage","service","solution","portfolioProject"] && references($mediaId)]{_id,_type}`,
    { mediaId },
  );

  if (!docs.length) return;

  const tx = sanityWriteClient.transaction();
  for (const doc of docs) {
    if (doc._type === "homePage") {
      tx.patch(doc._id, (patch) => patch.unset([`examplesGalleryItems[_ref=="${mediaId}"]`]));
    } else {
      tx.patch(doc._id, (patch) => patch.unset([`galleryItems[_ref=="${mediaId}"]`]));
    }
  }
  await tx.commit();
}

async function applyPlacementAssignments(mediaId: string, placement?: PlacementInput) {
  if (!placement) return;
  const tx = sanityWriteClient.transaction();

  if (placement.includeHome) {
    const homeId = await resolveHomePageId();
    if (homeId) {
      tx.patch(homeId, (patch) =>
        patch
          .setIfMissing({ examplesGalleryItems: [] })
          .insert("after", "examplesGalleryItems[-1]", [mediaRef(mediaId)]),
      );
    }
  }

  for (const serviceId of placement.serviceIds ?? []) {
    tx.patch(serviceId, (patch) =>
      patch.setIfMissing({ galleryItems: [] }).insert("after", "galleryItems[-1]", [mediaRef(mediaId)]),
    );
  }
  for (const solutionId of placement.solutionIds ?? []) {
    tx.patch(solutionId, (patch) =>
      patch.setIfMissing({ galleryItems: [] }).insert("after", "galleryItems[-1]", [mediaRef(mediaId)]),
    );
  }
  for (const portfolioId of placement.portfolioIds ?? []) {
    tx.patch(portfolioId, (patch) =>
      patch.setIfMissing({ galleryItems: [] }).insert("after", "galleryItems[-1]", [mediaRef(mediaId)]),
    );
  }

  await tx.commit();
}

function normalizeMediaAsset(
  asset: MediaAssetSanity,
  assignments: {
    home: Set<string>;
    service: Map<string, Set<string>>;
    solution: Map<string, Set<string>>;
    portfolio: Map<string, Set<string>>;
  },
): MediaLibraryItem {
  const imageUrl = asset.imageFile?.asset?.url || "";
  const videoUrl = asset.videoFile?.asset?.url || "";
  const mediaType = asset.mediaType === "video" ? "video" : "image";
  const url = mediaType === "video" ? videoUrl : imageUrl;
  const linkedTo = normalizeLinkedTo(asset.linkedTo);

  const serviceIds = Array.from(
    [...assignments.service.entries()]
      .filter(([, refs]) => refs.has(asset._id))
      .map(([id]) => id),
  );
  const solutionIds = Array.from(
    [...assignments.solution.entries()]
      .filter(([, refs]) => refs.has(asset._id))
      .map(([id]) => id),
  );
  const portfolioIds = Array.from(
    [...assignments.portfolio.entries()]
      .filter(([, refs]) => refs.has(asset._id))
      .map(([id]) => id),
  );

  return {
    id: asset._id,
    title: asset.title || "",
    caption: asset.caption || "",
    category: asset.category || "general",
    locale: normalizeLocale(asset.locale),
    mediaType,
    url,
    imageUrl,
    videoUrl,
    posterUrl: asset.videoPoster?.asset?.url || "",
    alt: asset.alt || asset.title || "",
    order: asset.order ?? 100,
    isFeatured: Boolean(asset.isFeatured),
    isHidden: Boolean(asset.isHidden),
    linkUrl: asset.linkUrl || "",
    linkedTo,
    assignments: {
      home: assignments.home.has(asset._id),
      serviceIds,
      solutionIds,
      portfolioIds,
    },
    createdAt: asset._createdAt || "",
    updatedAt: asset._updatedAt || "",
  };
}

export async function listMediaLibraryFromSanity(
  options: ListMediaAssetsOptions = {},
): Promise<MediaLibraryResponse> {
  if (!isSanityWriteConfigured()) {
    throw new Error("Sanity write is not configured");
  }

  const [assets, services, solutions, portfolios, home] = await Promise.all([
    sanityWriteClient.fetch<MediaAssetSanity[]>(
      `*[_type == "mediaAsset"] | order(order asc, _createdAt desc){
        _id, _createdAt, _updatedAt, title, caption, category, locale, mediaType, alt, order, isFeatured, isHidden, linkUrl, linkedTo,
        "imageFile": imageFile{asset->{url}},
        "videoFile": videoFile{asset->{url}},
        "videoPoster": videoPoster{asset->{url}}
      }`,
    ),
    sanityWriteClient.fetch<Array<AssignmentDoc & TargetService>>(
      `*[_type == "service"] | order(order asc, _createdAt asc){
        _id, title, slug, "galleryItems": galleryItems[]{_ref}
      }`,
    ),
    sanityWriteClient.fetch<Array<AssignmentDoc & TargetSolution>>(
      `*[_type == "solution"] | order(order asc, _createdAt asc){
        _id, title, slug, "galleryItems": galleryItems[]{_ref}
      }`,
    ),
    sanityWriteClient.fetch<Array<AssignmentDoc & TargetPortfolio>>(
      `*[_type == "portfolioProject"] | order(order asc, _createdAt asc){
        _id, title, "galleryItems": galleryItems[]{_ref}
      }`,
    ),
    sanityWriteClient.fetch<AssignmentDoc | null>(
      `*[_type == "homePage"][0]{_id, "examplesGalleryItems": examplesGalleryItems[]{_ref}}`,
    ),
  ]);

  const assignments = {
    home: new Set((home?.examplesGalleryItems ?? []).map((item) => item._ref || "").filter(Boolean)),
    service: new Map<string, Set<string>>(),
    solution: new Map<string, Set<string>>(),
    portfolio: new Map<string, Set<string>>(),
  };
  for (const service of services) {
    assignments.service.set(
      service._id,
      new Set((service.galleryItems ?? []).map((item) => item._ref || "").filter(Boolean)),
    );
  }
  for (const solution of solutions) {
    assignments.solution.set(
      solution._id,
      new Set((solution.galleryItems ?? []).map((item) => item._ref || "").filter(Boolean)),
    );
  }
  for (const portfolio of portfolios) {
    assignments.portfolio.set(
      portfolio._id,
      new Set((portfolio.galleryItems ?? []).map((item) => item._ref || "").filter(Boolean)),
    );
  }

  let media = assets.map((asset) => normalizeMediaAsset(asset, assignments));

  if (options.locale && ALLOWED_MEDIA_LOCALES.has(options.locale)) {
    media = media.filter((item) => item.locale === options.locale || item.locale === "all");
  }
  if (options.category && ALLOWED_MEDIA_CATEGORIES.has(options.category)) {
    media = media.filter((item) => item.category === options.category);
  }
  if (options.hidden === "true") {
    media = media.filter((item) => item.isHidden);
  } else if (options.hidden === "false") {
    media = media.filter((item) => !item.isHidden);
  }
  if (options.linkedTo && ALLOWED_LINKED_TO.has(options.linkedTo)) {
    media = media.filter((item) => item.linkedTo.includes(options.linkedTo as LinkedTo));
  }

  return {
    media,
    targets: {
      homePageId: home?._id || null,
      services: services.map((item) => ({
        id: item._id,
        title: pickLocalized(item.title),
        slug: pickSlug(item.slug),
      })),
      solutions: solutions.map((item) => ({
        id: item._id,
        title: pickLocalized(item.title),
        slug: pickSlug(item.slug),
      })),
      portfolios: portfolios.map((item) => ({
        id: item._id,
        title: pickLocalized(item.title),
      })),
    },
  };
}

export async function createMediaAssetInSanity(input: CreateMediaAssetInput): Promise<MediaLibraryItem> {
  if (!isSanityWriteConfigured()) {
    throw new Error("Sanity write is not configured");
  }

  const title = input.title.trim();
  if (!title) throw new Error("Title is required");
  if (!ALLOWED_MEDIA_CATEGORIES.has(input.category)) throw new Error("Invalid media category");

  const locale = normalizeLocale(input.locale);
  const mediaType = input.mediaType;
  const linkedTo = normalizeLinkedTo(input.linkedTo);
  const order = Number.isFinite(input.order) ? Number(input.order) : 100;

  if (mediaType === "image" && !input.file) {
    throw new Error("Image file is required");
  }
  if (mediaType === "video" && !input.file) {
    throw new Error("Video file is required");
  }

  let imageAssetRef: string | null = null;
  let videoAssetRef: string | null = null;
  let posterAssetRef: string | null = null;

  if (mediaType === "image" && input.file) {
    const uploaded = await uploadAsset(input.file, "image");
    imageAssetRef = uploaded._id;
  }
  if (mediaType === "video" && input.file) {
    const uploaded = await uploadAsset(input.file, "file");
    videoAssetRef = uploaded._id;
  }
  if (input.posterFile) {
    const uploadedPoster = await uploadAsset(input.posterFile, "image");
    posterAssetRef = uploadedPoster._id;
  }

  const docId = `mediaAsset.${crypto.randomUUID()}`;
  const doc: Record<string, unknown> = {
    _id: docId,
    _type: "mediaAsset",
    title,
    caption: input.caption?.trim() || "",
    category: input.category,
    locale,
    mediaType,
    alt: input.alt?.trim() || "",
    order,
    isFeatured: Boolean(input.isFeatured),
    isHidden: Boolean(input.isHidden),
    linkUrl: input.linkUrl?.trim() || "",
    linkedTo: deriveLinkedTo(linkedTo, input.placement),
  };

  if (imageAssetRef) {
    doc.imageFile = { _type: "image", asset: mediaRef(imageAssetRef) };
  }
  if (videoAssetRef) {
    doc.videoFile = { _type: "file", asset: mediaRef(videoAssetRef) };
  }
  if (posterAssetRef) {
    doc.videoPoster = { _type: "image", asset: mediaRef(posterAssetRef) };
  }

  await sanityWriteClient.create(doc as { _id: string; _type: string } & Record<string, unknown>);
  await applyPlacementAssignments(docId, input.placement);

  const listed = await listMediaLibraryFromSanity({});
  const mediaItem = listed.media.find((item) => item.id === docId);
  if (!mediaItem) {
    throw new Error("Failed to create media asset");
  }
  return mediaItem;
}

export async function updateMediaAssetInSanity(input: UpdateMediaAssetInput): Promise<MediaLibraryItem> {
  if (!isSanityWriteConfigured()) {
    throw new Error("Sanity write is not configured");
  }
  if (!input.id) {
    throw new Error("Asset id is required");
  }

  const patch: Record<string, unknown> = {};
  if (typeof input.title === "string") patch.title = input.title.trim();
  if (typeof input.caption === "string") patch.caption = input.caption.trim();
  if (typeof input.alt === "string") patch.alt = input.alt.trim();
  if (typeof input.linkUrl === "string") patch.linkUrl = input.linkUrl.trim();
  if (typeof input.order === "number" && Number.isFinite(input.order)) patch.order = input.order;
  if (typeof input.isFeatured === "boolean") patch.isFeatured = input.isFeatured;
  if (typeof input.isHidden === "boolean") patch.isHidden = input.isHidden;
  if (typeof input.category === "string") {
    if (!ALLOWED_MEDIA_CATEGORIES.has(input.category)) throw new Error("Invalid media category");
    patch.category = input.category;
  }
  if (typeof input.locale === "string") {
    if (!ALLOWED_MEDIA_LOCALES.has(input.locale)) throw new Error("Invalid media locale");
    patch.locale = input.locale;
  }
  if (input.linkedTo) {
    patch.linkedTo = deriveLinkedTo(normalizeLinkedTo(input.linkedTo), input.placement);
  } else if (input.placement) {
    const existing = await sanityWriteClient.fetch<Pick<MediaAssetSanity, "linkedTo"> | null>(
      `*[_type == "mediaAsset" && _id == $id][0]{linkedTo}`,
      { id: input.id },
    );
    patch.linkedTo = deriveLinkedTo(normalizeLinkedTo(existing?.linkedTo), input.placement);
  }

  if (Object.keys(patch).length) {
    await sanityWriteClient.patch(input.id).set(patch).commit();
  }

  if (input.placement) {
    await removeReferenceFromAllPlacements(input.id);
    await applyPlacementAssignments(input.id, input.placement);
  }

  const listed = await listMediaLibraryFromSanity({});
  const mediaItem = listed.media.find((item) => item.id === input.id);
  if (!mediaItem) {
    throw new Error("Media asset not found");
  }
  return mediaItem;
}

export async function parsePlacementInput(raw: unknown): Promise<PlacementInput> {
  const payload = isRecord(raw) ? raw : {};
  return {
    includeHome: Boolean(payload.includeHome),
    serviceIds: ensureStringArray(payload.serviceIds),
    solutionIds: ensureStringArray(payload.solutionIds),
    portfolioIds: ensureStringArray(payload.portfolioIds),
  };
}
