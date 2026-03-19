import { Button } from "./Button";
import { useMonetization } from "../state/MonetizationContext";
import { useLocale } from "../state/LocaleContext";

export function ConsentBanner() {
  const { locale } = useLocale();
  const { consent, acceptAds, rejectAds, canAskForConsent } = useMonetization();
  const isGerman = locale === "de";

  if (!canAskForConsent || consent !== "unknown") {
    return null;
  }

  return (
    <div className="consent-banner-wrap">
      <div className="container">
        <div className="glass-panel consent-banner">
          <div className="consent-copy">
            <span className="subtle-pill">{isGerman ? "Datenschutz & Werbung" : "Privacy & ads"}</span>
            <strong>
              {isGerman
                ? "Duerfen klar getrennte AdSense-Flaechen geladen werden?"
                : "Allow clearly separated AdSense placements?"}
            </strong>
            <p>
              {isGerman
                ? "Werbung erscheint nur auf den vorgesehenen Sponsor-Flaechen. Test, Statistiken und Leaderboard bleiben in jedem Fall visuell getrennt."
                : "Only the dedicated sponsor surfaces below the product experience use ads. The test, stats, and leaderboard stay visually separate either way."}
            </p>
          </div>

          <div className="consent-actions">
            <Button onClick={acceptAds}>{isGerman ? "Werbung erlauben" : "Allow ads"}</Button>
            <Button onClick={rejectAds} variant="secondary">
              {isGerman ? "Ohne Werbung fortfahren" : "Continue ad-free"}
            </Button>
            <Button href="#cookies" variant="ghost">
              {isGerman ? "Cookie-Einstellungen" : "Cookie settings"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
