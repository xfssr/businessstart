import { cn } from "@/lib/cn";

type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  strong?: boolean;
};

export function GlassCard({
  children,
  className,
  interactive = true,
  strong = false,
}: GlassCardProps) {
  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-xl)] p-6 sm:p-7",
        strong ? "glass-surface-strong" : "glass-surface",
        interactive
          ? "transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[var(--glow-hero)]"
          : "",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      {children}
    </article>
  );
}
