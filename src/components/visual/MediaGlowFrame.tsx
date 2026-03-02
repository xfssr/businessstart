import { cn } from "@/lib/cn";

type MediaGlowFrameProps = {
  children: React.ReactNode;
  className?: string;
  showHoverOverlay?: boolean;
};

export function MediaGlowFrame({
  children,
  className,
  showHoverOverlay = true,
}: MediaGlowFrameProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-[var(--radius-xl)] border border-border-subtle bg-surface-overlay shadow-[var(--glow-soft)]",
        className,
      )}
    >
      {children}
      {showHoverOverlay ? (
        <span
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/28 via-transparent to-white/8 opacity-70 transition-opacity duration-300 group-hover:opacity-55"
          aria-hidden
        />
      ) : null}
    </div>
  );
}
