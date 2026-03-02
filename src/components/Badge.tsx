import { cn } from "@/lib/cn";

type BadgeProps = {
  children: React.ReactNode;
  className?: string;
};

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "glass-surface inline-flex items-center gap-2 rounded-full border border-border-subtle px-3 py-1 text-[var(--font-size-caption)] font-semibold tracking-[0.18em] text-text-label uppercase",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
      {children}
    </span>
  );
}
