import { cn } from "@/lib/cn";

type ButtonBaseProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
};

type LinkButtonProps = ButtonBaseProps & {
  href: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "className" | "href">;

type ActionButtonProps = ButtonBaseProps & {
  href?: undefined;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className">;

type ButtonProps = ActionButtonProps | LinkButtonProps;

function buttonClasses(variant: "primary" | "secondary") {
  if (variant === "secondary") {
    return "border border-border-strong bg-surface-elevated text-text-primary hover:border-accent/40 hover:text-accent";
  }

  return "border border-accent bg-accent text-white shadow-panel hover:bg-accent-strong hover:border-accent-strong";
}

export function Button({
  children,
  className,
  href,
  variant = "primary",
  ...rest
}: ButtonProps) {
  const classes = cn(
    "inline-flex min-h-12 items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold tracking-wide transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
    buttonClasses(variant),
    className,
  );

  if (href) {
    return (
      <a
        href={href}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        className={classes}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      className={classes}
    >
      {children}
    </button>
  );
}
