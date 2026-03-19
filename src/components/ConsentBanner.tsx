import { Button } from "./Button";
import { useMonetization } from "../state/MonetizationContext";

export function ConsentBanner() {
  const { consent, acceptAds, rejectAds, canAskForConsent } = useMonetization();

  if (!canAskForConsent || consent !== "unknown") {
    return null;
  }

  return (
    <div className="consent-banner-wrap">
      <div className="container">
        <div className="glass-panel consent-banner">
          <div className="consent-copy">
            <span className="subtle-pill">Privacy & ads</span>
            <strong>Allow clearly separated AdSense placements?</strong>
            <p>
              Only the dedicated sponsor surfaces below the product experience use ads. The test,
              stats, and leaderboard stay visually separate either way.
            </p>
          </div>

          <div className="consent-actions">
            <Button onClick={acceptAds}>Allow ads</Button>
            <Button onClick={rejectAds} variant="secondary">
              Continue ad-free
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
