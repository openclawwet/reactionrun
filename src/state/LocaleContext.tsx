import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Locale = "de" | "en";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const STORAGE_KEY = "reaction-run-locale-v1";

const LocaleContext = createContext<LocaleContextValue | null>(null);

const normalizeLocale = (value?: string | null): Locale => {
  const normalized = value?.trim().toLowerCase() || "";
  return normalized.startsWith("de") ? "de" : "en";
};

const detectBrowserLocale = (): Locale => {
  if (typeof window === "undefined") {
    return "en";
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (stored) {
    return normalizeLocale(stored);
  }

  const browserLocales = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];

  return browserLocales.some((entry) => normalizeLocale(entry) === "de") ? "de" : "en";
};

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(detectBrowserLocale);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
    }),
    [locale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider.");
  }

  return context;
}
