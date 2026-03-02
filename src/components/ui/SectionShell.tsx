import { cn } from "@/lib/cn";

import { Container } from "@/components/Container";

type SectionShellProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
  headerClassName?: string;
  contentClassName?: string;
  size?: "default" | "large";
  tone?: "default" | "muted";
  withGlowAccent?: boolean;
};

export function SectionShell({
  children,
  className,
  contentClassName,
  description,
  eyebrow,
  headerClassName,
  id,
  size = "default",
  title,
  tone = "default",
  withGlowAccent = false,
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={cn(
        size === "large" ? "section-shell-lg" : "section-shell",
        tone === "muted" ? "relative" : "",
        className,
      )}
    >
      <Container className={cn(withGlowAccent ? "relative" : "")}>
        {withGlowAccent ? (
          <div
            className="pointer-events-none absolute -top-8 start-0 h-28 w-28 rounded-full blur-[34px]"
            style={{
              background:
                "radial-gradient(circle, rgb(98 171 255 / 0.28) 0%, transparent 72%)",
            }}
            aria-hidden
          />
        ) : null}
        {(eyebrow || title || description) && (
          <header className={cn("mb-9 max-w-3xl", headerClassName)}>
            {eyebrow ? (
              <p className="eyebrow-label mb-3 font-semibold">{eyebrow}</p>
            ) : null}
            {title ? (
              <h2
                className={cn(
                  "font-display leading-tight text-text-primary",
                  size === "large" ? "text-[var(--font-size-h1)]" : "text-[var(--font-size-h2)]",
                )}
              >
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-4 text-[var(--font-size-body)] leading-relaxed text-text-secondary sm:text-lg">
                {description}
              </p>
            ) : null}
          </header>
        )}
        <div className={contentClassName}>{children}</div>
      </Container>
    </section>
  );
}
