import { cn } from "@/lib/cn";

import { GlowBackground } from "@/components/visual/GlowBackground";

type HeroBackdropProps = {
  children: React.ReactNode;
  className?: string;
  imageSrc?: string;
  textureSrc?: string;
};

export function HeroBackdrop({
  children,
  className,
  imageSrc = "/images/hero/studio-hero.svg",
  textureSrc = "/images/textures/noise-soft.svg",
}: HeroBackdropProps) {
  return (
    <div className={cn("relative isolate overflow-hidden rounded-[var(--radius-2xl)] border border-border-subtle", className)}>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageSrc})` }}
        aria-hidden
      />
      <div className="absolute inset-0" style={{ background: "var(--bg-overlay-strong)" }} aria-hidden />
      <div className="absolute inset-0 bg-[var(--gradient-hero)]" aria-hidden />
      <div
        className="absolute inset-0 opacity-30 mix-blend-soft-light"
        style={{ backgroundImage: `url(${textureSrc})`, backgroundSize: "360px 360px" }}
        aria-hidden
      />
      <GlowBackground dense />
      <div className="vignette-overlay" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
