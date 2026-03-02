import Image from "next/image";

import { CardModule } from "./CardModule";
import { MediaGlowFrame } from "./visual/MediaGlowFrame";

type PortfolioItem = {
  alt: string;
  mediaType?: "image" | "video";
  metric: string;
  subtitle: string;
  title: string;
  visual: string;
};

type PortfolioGalleryProps = {
  items: PortfolioItem[];
};

export function PortfolioGallery({ items }: PortfolioGalleryProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <CardModule key={item.title} className="overflow-hidden p-0">
          <MediaGlowFrame className="rounded-none border-x-0 border-t-0">
            {item.mediaType === "video" || item.visual.toLowerCase().includes(".mp4") ? (
              <video
                src={item.visual}
                className="h-52 w-full object-cover"
                controls
                muted
                playsInline
              />
            ) : (
              <Image
                src={item.visual}
                alt={item.alt}
                width={720}
                height={480}
                className="h-52 w-full object-cover"
              />
            )}
          </MediaGlowFrame>
          <div className="space-y-3 p-5">
            <p className="product-meta-label font-semibold">
              {item.metric}
            </p>
            <h3 className="font-display text-2xl text-text-primary">{item.title}</h3>
            <p className="text-sm text-text-secondary">{item.subtitle}</p>
          </div>
        </CardModule>
      ))}
    </div>
  );
}
