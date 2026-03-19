import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  adsenseClientId,
  adsLaunchState,
  isAdSenseConfigured,
  type AdsLaunchState,
} from "../lib/ads";

type ConsentState = "unknown" | "accepted" | "rejected";

type MonetizationContextValue = {
  consent: ConsentState;
  adsMode: "preview" | "live";
  adsLaunchState: AdsLaunchState;
  adsEnabled: boolean;
  hasConsentChoice: boolean;
  canAskForConsent: boolean;
  acceptAds: () => void;
  rejectAds: () => void;
};

const CONSENT_KEY = "reaction-run-ad-consent-v1";

const MonetizationContext = createContext<MonetizationContextValue | null>(null);

const readStoredConsent = (): ConsentState => {
  if (typeof window === "undefined") {
    return "unknown";
  }

  const value = window.localStorage.getItem(CONSENT_KEY);
  return value === "accepted" || value === "rejected" ? value : "unknown";
};

export function MonetizationProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentState>(readStoredConsent);

  useEffect(() => {
    if (consent === "unknown") {
      window.localStorage.removeItem(CONSENT_KEY);
      return;
    }

    window.localStorage.setItem(CONSENT_KEY, consent);
  }, [consent]);

  const adsEnabled = consent === "accepted" && isAdSenseConfigured;
  const adsMode = isAdSenseConfigured ? "live" : "preview";
  const canAskForConsent = adsLaunchState === "ready";

  useEffect(() => {
    if (!adsEnabled) {
      return;
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
  }, [adsEnabled]);

  const value = useMemo<MonetizationContextValue>(
    () => ({
      consent,
      adsMode,
      adsLaunchState,
      adsEnabled,
      hasConsentChoice: consent !== "unknown",
      canAskForConsent,
      acceptAds: () => setConsent("accepted"),
      rejectAds: () => setConsent("rejected"),
    }),
    [adsEnabled, adsLaunchState, adsMode, canAskForConsent, consent],
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
