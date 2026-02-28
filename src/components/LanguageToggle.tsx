"use client";

import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/cn";
import { LOCALE_STORAGE_KEY, type Locale } from "@/lib/constants";

import { useLocale } from "./LocaleProvider";

type LanguageToggleProps = {
  className?: string;
};

function replaceLocaleInPath(pathname: string, targetLocale: Locale) {
  const segments = pathname.split("/").filter(Boolean);

  if (!segments.length) {
    return `/${targetLocale}`;
  }

  if (segments[0] === "he" || segments[0] === "en") {
    segments[0] = targetLocale;
  } else {
    segments.unshift(targetLocale);
  }

  return `/${segments.join("/")}`;
}

export function LanguageToggle({ className }: LanguageToggleProps) {
  const { locale, setLocale, t } = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (nextLocale: Locale) => {
    if (nextLocale === locale) {
      return;
    }

    setLocale(nextLocale);
    window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
    router.push(replaceLocaleInPath(pathname, nextLocale));
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border-subtle bg-surface-overlay/80 p-1",
        className,
      )}
      role="group"
      aria-label={t("ui.languageToggle")}
    >
      <button
        type="button"
        onClick={() => switchLocale("he")}
        className={cn(
          "rounded-full px-3 py-2 text-xs font-semibold tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          locale === "he" ? "bg-surface-elevated text-text-primary" : "text-text-muted hover:text-text-primary",
        )}
        aria-pressed={locale === "he"}
      >
        עברית
      </button>
      <button
        type="button"
        onClick={() => switchLocale("en")}
        className={cn(
          "rounded-full px-3 py-2 text-xs font-semibold tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          locale === "en" ? "bg-surface-elevated text-text-primary" : "text-text-muted hover:text-text-primary",
        )}
        aria-pressed={locale === "en"}
      >
        EN
      </button>
    </div>
  );
}
