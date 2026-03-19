import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const STORAGE_KEY = "reaction-run-theme-v1";
const LIGHT_THEME_COLOR = "#f5f5f2";
const DARK_THEME_COLOR = "#0b1014";

const ThemeContext = createContext<ThemeContextValue | null>(null);

const isTheme = (value: string | null): value is Theme =>
  value === "light" || value === "dark";

const readStoredTheme = (): Theme | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isTheme(stored) ? stored : null;
  } catch {
    return null;
  }
};

const getSystemTheme = (): Theme => {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const readInitialThemeState = () => {
  const storedTheme = readStoredTheme();

  return {
    theme: storedTheme ?? getSystemTheme(),
    hasStoredPreference: storedTheme !== null,
  };
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeState, setThemeState] = useState(readInitialThemeState);
  const { theme, hasStoredPreference } = themeState;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;

    const themeColorMeta = document.querySelector('meta[name="theme-color"]');

    if (themeColorMeta) {
      themeColorMeta.setAttribute(
        "content",
        theme === "dark" ? DARK_THEME_COLOR : LIGHT_THEME_COLOR,
      );
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Ignore storage write failures and continue with the in-memory theme.
    }
  }, [theme]);

  useEffect(() => {
    if (hasStoredPreference || typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event: MediaQueryListEvent) => {
      setThemeState((current) => ({
        ...current,
        theme: event.matches ? "dark" : "light",
      }));
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [hasStoredPreference]);

  const setTheme = (nextTheme: Theme) => {
    setThemeState({
      theme: nextTheme,
      hasStoredPreference: true,
    });
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === "dark",
      setTheme,
      toggleTheme,
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider.");
  }

  return context;
}
