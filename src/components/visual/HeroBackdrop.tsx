import { cn } from "@/lib/cn";

import { GlowBackground } from "@/components/visual/GlowBackground";

type HeroBackdropProps = {
  children: React.ReactNode;
  className?: string;
  imageSrc?: string;
  photoSrc?: string;
  textureSrc?: string;
};

export function HeroBackdrop({
  children,
  className,
  imageSrc = "/images/hero/studio-hero.svg",
  photoSrc = "/images/hero/studio-hero-photo.jpg",
  textureSrc = "/images/textures/noise-soft.svg",
}: HeroBackdropProps) {
  return (
    <div className={cn("relative isolate overflow-hidden", className)}>
      <div
        className="hero-bg-photo-blur absolute -inset-[2%] bg-cover bg-[center_46%] opacity-[0.44] blur-[12px] lg:bg-center"
        style={{ backgroundImage: `url(${photoSrc})` }}
        aria-hidden
      />
      <div
        className="hero-bg-photo-base absolute inset-0 bg-cover bg-[center_46%] opacity-[0.24] lg:bg-center"
        style={{ backgroundImage: `url(${photoSrc})` }}
        aria-hidden
      />
      <div
        className="hero-bg-vector absolute inset-0 bg-cover bg-[center_46%] opacity-[0.38] lg:bg-center"
        style={{ backgroundImage: `url(${imageSrc})` }}
        aria-hidden
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(112deg, rgb(3 8 15 / 0.66) 0%, rgb(6 14 26 / 0.42) 44%, rgb(3 8 14 / 0.84) 100%)",
        }}
        aria-hidden
      />
      <div
        className="hero-bg-glow absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 22% 26%, rgb(98 171 255 / 0.2) 0%, transparent 42%), radial-gradient(circle at 84% 8%, rgb(79 226 255 / 0.12) 0%, transparent 34%)",
        }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-[var(--gradient-hero)]" aria-hidden />
      <div
        className="absolute inset-0 opacity-[0.18] mix-blend-soft-light"
        style={{ backgroundImage: `url(${textureSrc})`, backgroundSize: "360px 360px" }}
        aria-hidden
      />
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/35 to-transparent" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/46 to-transparent" aria-hidden />
      <GlowBackground dense />
      <div className="pointer-events-none absolute inset-x-0 bottom-10 z-20 flex justify-center lg:hidden" aria-hidden>
        <span className="hero-scroll-cue">
          <span className="hero-scroll-cue-dot" />
        </span>
      </div>
      <div className="vignette-overlay" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
