import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  adsenseClientId,
  adsLaunchState,
  isAdSenseConfigured,
  type AdsLaunchState,
} from "../lib/ads";
import {
  APP_ROUTE_EVENT,
  getAppRouteFromLocation,
  getConsentManagementUrl,
  type AppRoute,
} from "../lib/appRoute";

type GoogleConsentState = "unknown" | "granted" | "denied";
type CookieConsentPreference = "unset" | "necessary" | "all";

type SiteCookiePreferences = {
  necessary: true;
  advertising: boolean;
  choiceMade: boolean;
  updatedAt: string | null;
};

type GoogleFcConsentModeValues = {
  adStoragePurposeConsentStatus?: number;
  adUserDataPurposeConsentStatus?: number;
  adPersonalizationPurposeConsentStatus?: number;
  analyticsStoragePurposeConsentStatus?: number;
};

type GoogleFcWindow = {
  callbackQueue?: Array<Record<string, () => void> | (() => void)>;
  showRevocationMessage?: () => void;
  getGoogleConsentModeValues?: () => GoogleFcConsentModeValues;
  ConsentModePurposeStatusEnum?: {
    UNKNOWN: number;
    GRANTED: number;
    DENIED: number;
    NOT_APPLICABLE: number;
    NOT_CONFIGURED: number;
  };
};

declare global {
  interface Window {
    googlefc?: GoogleFcWindow;
  }
}

type MonetizationContextValue = {
  adsMode: "preview" | "live";
  adsLaunchState: AdsLaunchState;
  adsEnabled: boolean;
  consentState: GoogleConsentState;
  cookiePreferences: SiteCookiePreferences;
  cookiePreference: CookieConsentPreference;
  showCookieBanner: boolean;
  cookieSettingsOpen: boolean;
  googleCmpConfigured: boolean;
  canManageConsent: boolean;
  consentManagementUrl: string;
  acceptNecessaryCookies: () => void;
  acceptAllCookies: () => void;
  saveCookiePreferences: (advertising: boolean) => void;
  openCookieSettingsPanel: () => void;
  closeCookieSettingsPanel: () => void;
  openConsentSettings: () => void;
};

const MonetizationContext = createContext<MonetizationContextValue | null>(null);
const COOKIE_PREFERENCES_KEY = "reaction-run-cookie-preferences-v1";

const DEFAULT_COOKIE_PREFERENCES: SiteCookiePreferences = {
  necessary: true,
  advertising: false,
  choiceMade: false,
  updatedAt: null,
};

const getCurrentRoute = (): AppRoute => {
  if (typeof window === "undefined") {
    return "home";
  }

  return getAppRouteFromLocation(window.location.pathname, window.location.hash);
};

const deriveConsentState = (values?: GoogleFcConsentModeValues): GoogleConsentState => {
  if (!values) {
    return "unknown";
  }

  const relevantStatuses = [
    values.adStoragePurposeConsentStatus,
    values.adUserDataPurposeConsentStatus,
    values.adPersonalizationPurposeConsentStatus,
  ].filter((entry): entry is number => typeof entry === "number");

  if (!relevantStatuses.length) {
    return "unknown";
  }

  if (relevantStatuses.some((entry) => entry === 1)) {
    return "granted";
  }

  if (relevantStatuses.every((entry) => entry === 2 || entry === 3 || entry === 4)) {
    return "denied";
  }

  return "unknown";
};

const parseStoredCookiePreferences = (rawValue: string | null): SiteCookiePreferences => {
  if (!rawValue) {
    return DEFAULT_COOKIE_PREFERENCES;
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<SiteCookiePreferences>;

    return {
      necessary: true,
      advertising: Boolean(parsed.advertising),
      choiceMade: Boolean(parsed.choiceMade),
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : null,
    };
  } catch {
    return DEFAULT_COOKIE_PREFERENCES;
  }
};

export function MonetizationProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<AppRoute>(getCurrentRoute);
  const [consentState, setConsentState] = useState<GoogleConsentState>("unknown");
  const [cookiePreferences, setCookiePreferences] = useState<SiteCookiePreferences>(() => {
    if (typeof window === "undefined") {
      return DEFAULT_COOKIE_PREFERENCES;
    }

    return parseStoredCookiePreferences(window.localStorage.getItem(COOKIE_PREFERENCES_KEY));
  });
  const [cookieSettingsOpen, setCookieSettingsOpen] = useState(false);
  const consentCallbackRegisteredRef = useRef(false);
  const consentManagementUrl = getConsentManagementUrl();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(cookiePreferences));
  }, [cookiePreferences]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const handleRouteChange = () => {
      setRoute(getCurrentRoute());
    };

    window.addEventListener("popstate", handleRouteChange);
    window.addEventListener(APP_ROUTE_EVENT, handleRouteChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
      window.removeEventListener(APP_ROUTE_EVENT, handleRouteChange);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || route !== "home" || !isAdSenseConfigured) {
      return;
    }

    window.googlefc = window.googlefc || {};
    window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];

    if (!consentCallbackRegisteredRef.current) {
      window.googlefc.callbackQueue.push({
        CONSENT_MODE_DATA_READY: () => {
          setConsentState(deriveConsentState(window.googlefc?.getGoogleConsentModeValues?.()));
        },
      });
      consentCallbackRegisteredRef.current = true;
    }

    const searchParams = new URLSearchParams(window.location.search);
    const shouldOpenConsentManager = searchParams.get("manage-consent") === "1";

    if (shouldOpenConsentManager) {
      window.googlefc.callbackQueue.push(() => {
        const nextUrl = new URL(window.location.href);
        nextUrl.searchParams.delete("manage-consent");
        window.history.replaceState(
          null,
          "",
          `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`,
        );
        window.googlefc?.showRevocationMessage?.();
      });
    }

    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-adsense-client="${adsenseClientId}"]`,
    );

    if (existing) {
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`;
    script.crossOrigin = "anonymous";
    script.dataset.adsenseClient = adsenseClientId;
    document.head.appendChild(script);
  }, [route]);

  const openConsentSettings = () => {
    if (typeof window === "undefined") {
      return;
    }

    if (route !== "home") {
      window.location.assign(consentManagementUrl);
      return;
    }

    window.googlefc = window.googlefc || {};
    window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];
    window.googlefc.callbackQueue.push(() => {
      window.googlefc?.showRevocationMessage?.();
    });
  };

  const saveCookiePreferences = (advertising: boolean) => {
    setCookiePreferences({
      necessary: true,
      advertising,
      choiceMade: true,
      updatedAt: new Date().toISOString(),
    });
    setCookieSettingsOpen(false);
  };

  const acceptNecessaryCookies = () => {
    saveCookiePreferences(false);
  };

  const acceptAllCookies = () => {
    saveCookiePreferences(true);
  };

  const openCookieSettingsPanel = () => {
    setCookieSettingsOpen(true);
  };

  const closeCookieSettingsPanel = () => {
    setCookieSettingsOpen(false);
  };

  const cookiePreference: CookieConsentPreference = !cookiePreferences.choiceMade
    ? "unset"
    : cookiePreferences.advertising
      ? "all"
      : "necessary";

  const value = useMemo<MonetizationContextValue>(
    () => ({
      adsMode: isAdSenseConfigured ? "live" : "preview",
      adsLaunchState,
      adsEnabled: route === "home" && isAdSenseConfigured,
      consentState,
      cookiePreferences,
      cookiePreference,
      showCookieBanner: route === "home" && !cookiePreferences.choiceMade,
      cookieSettingsOpen,
      googleCmpConfigured: adsLaunchState !== "cmp-required" && adsLaunchState !== "missing-client",
      canManageConsent: adsLaunchState === "ready",
      consentManagementUrl,
      acceptNecessaryCookies,
      acceptAllCookies,
      saveCookiePreferences,
      openCookieSettingsPanel,
      closeCookieSettingsPanel,
      openConsentSettings,
    }),
    [consentManagementUrl, consentState, cookiePreference, cookiePreferences, cookieSettingsOpen, route],
  );

  return <MonetizationContext.Provider value={value}>{children}</MonetizationContext.Provider>;
}

export function useMonetization() {
  const context = useContext(MonetizationContext);

  if (!context) {
    throw new Error("useMonetization must be used within a MonetizationProvider.");
  }

  return context;
}
