"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  SUPPORTED_LOCALES,
  type Locale,
} from "@/lib/constants";
import enMessages from "@/messages/en.json";
import heMessages from "@/messages/he.json";

type Messages = typeof heMessages;

type LocaleContextValue = {
  locale: Locale;
  dir: "rtl" | "ltr";
  messages: Messages;
  t: (key: string) => string;
  get: <T = unknown>(key: string) => T;
  setLocale: (locale: Locale) => void;
};

const catalog: Record<Locale, Messages> = {
  en: enMessages,
  he: heMessages,
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function resolveValue(messages: Messages, key: string) {
  return key.split(".").reduce<unknown>((acc, segment) => {
    if (!acc || typeof acc !== "object") {
      return undefined;
    }

    return (acc as Record<string, unknown>)[segment];
  }, messages);
}

function isLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window === "undefined") {
      return DEFAULT_LOCALE;
    }

    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    return stored && isLocale(stored) ? stored : DEFAULT_LOCALE;
  });

  useEffect(() => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "he" ? "rtl" : "ltr";
  }, [locale]);

  const messages = catalog[locale];
  const dir: "rtl" | "ltr" = locale === "he" ? "rtl" : "ltr";

  const t = useCallback(
    (key: string) => {
      const value = resolveValue(messages, key);
      return typeof value === "string" ? value : key;
    },
    [messages],
  );

  const get = useCallback(
    <T,>(key: string) => {
      return resolveValue(messages, key) as T;
    },
    [messages],
  );

  const value = useMemo(
    () => ({
      dir,
      get,
      locale,
      messages,
      setLocale,
      t,
    }),
    [dir, get, locale, messages, t],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocale must be used inside LocaleProvider");
  }

  return context;
}
