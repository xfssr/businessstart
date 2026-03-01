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

import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, type Locale } from "@/lib/constants";
import { getDirection, getMessages, type Messages } from "@/lib/i18n";

type LocaleContextValue = {
  locale: Locale;
  dir: "rtl" | "ltr";
  messages: Messages;
  t: (key: string) => string;
  get: <T = unknown>(key: string) => T;
  setLocale: (locale: Locale) => void;
};

type LocaleProviderProps = {
  children: ReactNode;
  initialLocale?: Locale;
  initialMessages?: Messages;
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

export function LocaleProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
  initialMessages,
}: LocaleProviderProps) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const messages = initialMessages ?? getMessages(initialLocale);

  const dir = getDirection(locale);

  useEffect(() => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [dir, locale]);

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
