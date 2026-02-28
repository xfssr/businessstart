"use client";

import { cn } from "@/lib/cn";

import { useLocale } from "./LocaleProvider";

type LanguageToggleProps = {
  className?: string;
};

export function LanguageToggle({ className }: LanguageToggleProps) {
  const { locale, setLocale, t } = useLocale();

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
        onClick={() => setLocale("he")}
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
        onClick={() => setLocale("en")}
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
