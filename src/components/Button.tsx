import { PremiumButton } from "@/components/ui/PremiumButton";

type ButtonBaseProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
};

type LinkButtonProps = ButtonBaseProps & {
  href: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "className" | "href">;

type ActionButtonProps = ButtonBaseProps & {
  href?: undefined;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className">;

type ButtonProps = ActionButtonProps | LinkButtonProps;

export function Button({
  children,
  className,
  href,
  variant = "primary",
  ...rest
}: ButtonProps) {
  if (href) {
    return (
      <PremiumButton
        href={href}
        variant={variant}
        className={className}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </PremiumButton>
    );
  }

  return (
    <PremiumButton
      variant={variant}
      className={className}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </PremiumButton>
  );
}
