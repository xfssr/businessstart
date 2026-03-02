import Image from "next/image";
import Link from "next/link";

import { CardModule } from "./CardModule";

export type ExamplesGalleryItem = {
  title: string;
  subtitle: string;
  category: string;
  mediaType: "image" | "video";
  src: string;
  poster?: string;
  alt: string;
  order?: number;
  link?: string;
};

type ExamplesGalleryProps = {
  categoryLabels?: Record<string, string>;
  items: ExamplesGalleryItem[];
};

export function ExamplesGallery({ categoryLabels, items }: ExamplesGalleryProps) {
  if (!items.length) return null;

  const categories = Array.from(
    new Set(
      items
        .map((item) => item.category?.trim())
        .filter(Boolean),
    ),
  );

  return (
    <div className="space-y-5">
      {categories.length > 1 ? (
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <span
              key={category}
              className="rounded-full border border-border-subtle bg-surface-elevated px-3 py-1 text-xs font-semibold tracking-[0.12em] text-text-muted uppercase"
            >
              {categoryLabels?.[category] || category}
            </span>
          ))}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item, index) => {
          const cardContent = (
            <>
              <div className="relative border-b border-border-subtle bg-surface-overlay/70">
                {item.mediaType === "video" || item.src.toLowerCase().includes(".mp4") ? (
                  <>
                    <video
                      src={item.src}
                      poster={item.poster}
                      className="h-52 w-full object-cover"
                      controls
                      muted
                      playsInline
                    />
                    <span
                      className="pointer-events-none absolute top-3 end-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white"
                      aria-hidden
                    >
                      <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
                        <path d="M6 4l10 6-10 6V4z" />
                      </svg>
                    </span>
                  </>
                ) : (
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={720}
                    height={480}
                    className="h-52 w-full object-cover"
                  />
                )}
              </div>

              <div className="space-y-2 p-5">
                {item.category ? (
                  <p className="text-xs font-semibold tracking-[0.18em] text-text-muted uppercase">
                    {categoryLabels?.[item.category] || item.category}
                  </p>
                ) : null}
                <h3 className="font-display text-2xl text-text-primary">{item.title}</h3>
                {item.subtitle ? <p className="text-sm text-text-secondary">{item.subtitle}</p> : null}
              </div>
            </>
          );

          return (
            <CardModule key={`${item.title}-${index}`} className="overflow-hidden p-0">
              {item.link ? (
                <Link href={item.link} className="block transition-opacity hover:opacity-95">
                  {cardContent}
                </Link>
              ) : (
                cardContent
              )}
            </CardModule>
          );
        })}
      </div>
    </div>
  );
}
