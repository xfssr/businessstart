import type { Locale } from "@/lib/constants";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/lib/constants";
import enMessages from "@/messages/en.json";
import heMessages from "@/messages/he.json";

export type Messages = typeof heMessages;

export const messageCatalog: Record<Locale, Messages> = {
  en: enMessages,
  he: heMessages,
};

export function isLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function getLocaleOrDefault(value: string): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export function getMessages(locale: Locale): Messages {
  return messageCatalog[locale];
}

export function getDirection(locale: Locale): "rtl" | "ltr" {
  return locale === "he" ? "rtl" : "ltr";
}
