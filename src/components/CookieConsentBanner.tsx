import { Button } from "./Button";
import { GlassPanel } from "./GlassPanel";
import { useLocale } from "../state/LocaleContext";
import { useMonetization } from "../state/MonetizationContext";
import { CookiePreferenceCenter } from "./CookiePreferenceCenter";

export function CookieConsentBanner() {
  const { locale } = useLocale();
  const isGerman = locale === "de";
  const {
    acceptAllCookies,
    acceptNecessaryCookies,
    closeCookieSettingsPanel,
    cookieSettingsOpen,
    openCookieSettingsPanel,
    showCookieBanner,
  } = useMonetization();

  if (!showCookieBanner) {
    return null;
  }

  return (
    <div className="cookie-banner-wrap" aria-live="polite">
      <GlassPanel className="cookie-banner">
        <div className="cookie-banner-copy">
          <span className="subtle-pill">{isGerman ? "Cookies" : "Cookies"}</span>
          <strong>
            {isGerman ? "Lege deine Cookie-Auswahl fest." : "Set your cookie preferences."}
          </strong>
          <p>
            {isGerman
              ? "Reaction Run nutzt notwendige Browser-Speicherungen fuer Test, Statistiken und Leaderboard. Optionale Werbung bleibt getrennt und kann zusaetzlich freigegeben werden."
              : "Reaction Run uses necessary browser storage for the test, stats, and leaderboard. Optional advertising stays separated and can be allowed additionally."}
          </p>
        </div>

        <div className="cookie-banner-actions">
          <Button variant="ghost" onClick={acceptNecessaryCookies}>
            {isGerman ? "Nur notwendige" : "Only necessary"}
          </Button>
          <Button
            variant="secondary"
            onClick={cookieSettingsOpen ? closeCookieSettingsPanel : openCookieSettingsPanel}
          >
            {cookieSettingsOpen
              ? isGerman
                ? "Einstellungen schliessen"
                : "Close settings"
              : isGerman
                ? "Einstellungen"
                : "Settings"}
          </Button>
          <Button onClick={acceptAllCookies}>
            {isGerman ? "Alle akzeptieren" : "Accept all"}
          </Button>
        </div>

        <div className="cookie-banner-links">
          <a href="/cookies">{isGerman ? "Cookies" : "Cookies"}</a>
          <a href="/privacy">{isGerman ? "Datenschutz" : "Privacy"}</a>
        </div>

        {cookieSettingsOpen ? (
          <div className="cookie-banner-settings">
            <CookiePreferenceCenter context="banner" />
          </div>
        ) : null}
      </GlassPanel>
    </div>
  );
}
