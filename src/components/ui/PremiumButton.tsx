import { cn } from "@/lib/cn";

type PremiumButtonBaseProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
};

type PremiumLinkButtonProps = PremiumButtonBaseProps & {
  href: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "className" | "href">;

type PremiumActionButtonProps = PremiumButtonBaseProps & {
  href?: undefined;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className">;

export type PremiumButtonProps = PremiumActionButtonProps | PremiumLinkButtonProps;

function variantClasses(variant: PremiumButtonProps["variant"]) {
  if (variant === "secondary") {
    return "glass-surface border-border-subtle text-text-primary hover:border-accent/50 hover:text-white";
  }

  if (variant === "ghost") {
    return "border border-border-subtle/70 bg-transparent text-text-secondary hover:border-border-strong hover:bg-white/5 hover:text-text-primary";
  }

  return "border border-accent/80 bg-gradient-to-r from-accent-blue to-accent-cyan text-white glow-accent hover:from-accent hover:to-accent-cyan";
}

export function PremiumButton({
  children,
  className,
  href,
  variant = "primary",
  ...rest
}: PremiumButtonProps) {
  const classes = cn(
    "inline-flex min-h-12 items-center justify-center rounded-[var(--radius-sm)] px-6 py-3 text-sm font-semibold tracking-[0.04em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base active:translate-y-px",
    variantClasses(variant),
    className,
  );

  if (href) {
    return (
      <a href={href} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)} className={classes}>
      {children}
    </button>
  );
}
