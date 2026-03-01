"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";

import { Button } from "./Button";
import { Container } from "./Container";
import { LanguageToggle } from "./LanguageToggle";
import { StickyWhatsAppBar } from "./StickyWhatsAppBar";
import { WhatsAppLink } from "./WhatsAppLink";
import { useLocale } from "./LocaleProvider";

type SiteShellProps = {
  children: React.ReactNode;
};

type NavLink = {
  label: string;
  path: string;
};

function normalizeLink(path: string, locale: string) {
  if (path === "/") {
    return `/${locale}`;
  }

  return `/${locale}${path}`;
}

export function SiteShell({ children }: SiteShellProps) {
  const { get, locale, t } = useLocale();
  const pathname = usePathname();
  const navLinks = get<NavLink[]>("nav.links");
  const primaryCtaLabel = (get<string>("nav.primaryCta") || t("nav.stickyCta")).trim();
  const secondaryCtaLabel = (get<string>("nav.secondaryCta") || (locale === "he" ? "בקשת הצעה" : "Get a quote")).trim();
  const secondaryCtaHref = get<string>("nav.secondaryCtaHref") || "/contact";
  const normalizedSecondaryHref = secondaryCtaHref.startsWith("/")
    ? secondaryCtaHref
    : `/${secondaryCtaHref}`;
  const localizedSecondaryHref =
    normalizedSecondaryHref === `/${locale}` || normalizedSecondaryHref.startsWith(`/${locale}/`)
      ? normalizedSecondaryHref
      : `/${locale}${normalizedSecondaryHref}`;

  return (
    <div className="relative min-h-screen pb-24 md:pb-0">
      <header className="sticky top-0 z-30 border-b border-border-subtle bg-surface-base/85 backdrop-blur-md">
        <Container className="flex items-center gap-3 py-4 sm:py-5">
          <Link href={`/${locale}`} className="space-y-1">
            <p className="text-[0.62rem] font-semibold tracking-[0.25em] text-text-muted uppercase">
              {t("brand.label")}
            </p>
            <p className="font-display text-lg leading-none text-text-primary sm:text-xl">
              {t("brand.name")}
            </p>
          </Link>

          <nav className="mx-auto hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const href = normalizeLink(link.path, locale);
              const active = pathname === href;

              return (
                <Link
                  key={link.path}
                  href={href}
                  className={cn(
                    "rounded-full px-3 py-2 text-xs font-semibold tracking-wide transition-colors",
                    active
                      ? "bg-surface-overlay text-text-primary"
                      : "text-text-muted hover:text-text-primary",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="ms-auto flex items-center gap-2">
            <div className="hidden items-center gap-2 sm:flex">
              <WhatsAppLink label={primaryCtaLabel} message={t("whatsapp.prefill")} variant="secondary" />
              <Button href={localizedSecondaryHref} className="min-w-36">
                {secondaryCtaLabel}
              </Button>
            </div>
            <LanguageToggle />
          </div>
        </Container>
      </header>

      <main>{children}</main>

      <footer className="border-t border-border-subtle py-8">
        <Container className="flex flex-col gap-2 text-sm text-text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>{t("footer.copyright")}</p>
          <p>{t("footer.note")}</p>
        </Container>
      </footer>

      <StickyWhatsAppBar label={t("nav.stickyCta")} message={t("whatsapp.prefill")} />
    </div>
  );
}
