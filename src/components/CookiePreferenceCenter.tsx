import { useEffect, useState } from "react";
import { Button } from "./Button";
import { useLocale } from "../state/LocaleContext";
import { useMonetization } from "../state/MonetizationContext";

type CookiePreferenceCenterProps = {
  context: "banner" | "page";
};

export function CookiePreferenceCenter({ context }: CookiePreferenceCenterProps) {
  const { locale } = useLocale();
  const isGerman = locale === "de";
  const {
    canManageConsent,
    cookiePreference,
    cookiePreferences,
    acceptAllCookies,
    acceptNecessaryCookies,
    openConsentSettings,
    saveCookiePreferences,
  } = useMonetization();
  const [advertisingEnabled, setAdvertisingEnabled] = useState(cookiePreferences.advertising);

  useEffect(() => {
    setAdvertisingEnabled(cookiePreferences.advertising);
  }, [cookiePreferences.advertising]);

  const preferenceLabel =
    cookiePreference === "all"
      ? isGerman
        ? "Alle Cookies"
        : "All cookies"
      : cookiePreference === "necessary"
        ? isGerman
          ? "Nur notwendige"
          : "Necessary only"
        : isGerman
          ? "Noch nicht gesetzt"
          : "Not set yet";

  return (
    <div className={`cookie-preference-center cookie-preference-center-${context}`}>
      <div className="cookie-preference-head">
        <div>
          {context === "page" ? (
            <span className="subtle-pill">{isGerman ? "Einstellungen" : "Settings"}</span>
          ) : null}
          <strong>
            {isGerman ? "Cookie-Einstellungen" : "Cookie settings"}
          </strong>
          <p>
            {isGerman
              ? "Lege fest, ob nur notwendige Speicherungen aktiv bleiben oder ob zusaetzlich optionale Werbeflaechen vorbereitet werden duerfen."
              : "Choose whether only necessary storage stays active or whether optional advertising surfaces may also be prepared."}
          </p>
        </div>
        <span className="status-chip status-chip-soft">{preferenceLabel}</span>
      </div>

      <div className="cookie-preference-list">
        <div className="cookie-preference-row">
          <div className="cookie-preference-copy">
            <strong>{isGerman ? "Erforderlich" : "Necessary"}</strong>
            <p>
              {isGerman
                ? "Sichert Reaktionstest, lokale Sessions, Nickname und grundlegende Seitennavigation."
                : "Keeps the reaction test, local sessions, nickname, and core site navigation working."}
            </p>
          </div>
          <span className="cookie-preference-lock">
            {isGerman ? "Immer aktiv" : "Always active"}
          </span>
        </div>

        <div className="cookie-preference-row">
          <div className="cookie-preference-copy">
            <strong>{isGerman ? "Werbung" : "Advertising"}</strong>
            <p>
              {isGerman
                ? "Bereitet getrennte AdSense-Flaechen vor. Die eigentliche Werbeeinwilligung wird zusaetzlich ueber Googles zertifizierte CMP verwaltet."
                : "Prepares separated AdSense surfaces. The actual advertising consent is additionally managed through Google's certified CMP."}
            </p>
          </div>
          <button
            type="button"
            className={
              advertisingEnabled
                ? "cookie-toggle cookie-toggle-active"
                : "cookie-toggle"
            }
            onClick={() => setAdvertisingEnabled((current) => !current)}
            aria-pressed={advertisingEnabled}
            aria-label={isGerman ? "Werbung aktivieren" : "Enable advertising"}
          >
            <span />
          </button>
        </div>
      </div>

      <p className="cookie-preference-note">
        {isGerman
          ? "Hinweis: Fuer Google AdSense wird die finale Auswahl auf der Produktseite weiterhin ueber Googles zertifizierte Consent-Nachricht abgeschlossen."
          : "Note: For Google AdSense, the final choice is still completed on the product page through Google's certified consent message."}
      </p>

      <div className="cookie-preference-actions">
        <Button variant="ghost" onClick={acceptNecessaryCookies}>
          {isGerman ? "Nur notwendige" : "Only necessary"}
        </Button>
        <Button variant="secondary" onClick={() => saveCookiePreferences(advertisingEnabled)}>
          {isGerman ? "Einstellungen speichern" : "Save settings"}
        </Button>
        <Button onClick={acceptAllCookies}>
          {isGerman ? "Alle akzeptieren" : "Accept all"}
        </Button>
        {context === "page" ? (
          <Button variant="ghost" onClick={openConsentSettings} disabled={!canManageConsent}>
            {isGerman ? "Google-Consent oeffnen" : "Open Google consent"}
          </Button>
        ) : null}
      </div>

    </div>
  );
}
