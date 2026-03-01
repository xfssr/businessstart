import { type Locale } from "@/lib/constants";

export type SlugPair = {
  he: string;
  en: string;
};

export function resolveLocalizedSlug(slugPair: SlugPair, locale: Locale) {
  return locale === "he" ? slugPair.he : slugPair.en;
}

export function resolveAlternateSlug(slugPair: SlugPair, locale: Locale) {
  return locale === "he" ? slugPair.en : slugPair.he;
}
