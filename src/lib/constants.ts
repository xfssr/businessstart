export const WHATSAPP_PHONE = "972500000000";
export const LOCALE_STORAGE_KEY = "vgl-locale";
export const DEFAULT_LOCALE = "he";
export const SUPPORTED_LOCALES = ["he", "en"] as const;
export const DEFAULT_SITE_URL = "https://businessstart.vercel.app";

export type Locale = (typeof SUPPORTED_LOCALES)[number];
