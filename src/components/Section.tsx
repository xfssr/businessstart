import { cn } from "@/lib/cn";

import { Container } from "./Container";

type SectionProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
};

export function Section({
  children,
  className,
  description,
  eyebrow,
  id,
  title,
}: SectionProps) {
  return (
    <section id={id} className={cn("py-14 sm:py-20", className)}>
      <Container>
        {(eyebrow || title || description) && (
          <header className="mb-9 max-w-3xl">
            {eyebrow ? (
              <p className="mb-3 text-[0.66rem] font-semibold tracking-[0.26em] text-text-muted uppercase">
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h2 className="font-display text-3xl leading-tight text-text-primary sm:text-4xl">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-4 text-base leading-relaxed text-text-secondary sm:text-lg">
                {description}
              </p>
            ) : null}
          </header>
        )}
        {children}
      </Container>
    </section>
  );
}
