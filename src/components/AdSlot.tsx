import { useEffect, useId, useRef } from "react";
import { adsenseClientId, isAdSenseSlotConfigured } from "../lib/ads";
import { useLocale } from "../state/LocaleContext";
import { useMonetization } from "../state/MonetizationContext";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type AdSlotProps = {
  label: string;
  title: string;
  description: string;
  slotId?: string;
  variant?: "feature" | "compact";
};

export function AdSlot({
  label,
  title,
  description,
  slotId,
  variant = "feature",
}: AdSlotProps) {
  const { locale } = useLocale();
  const { adsEnabled, adsLaunchState, consent } = useMonetization();
  const slotRef = useRef<HTMLModElement | null>(null);
  const elementId = useId();
  const hasValidSlot = isAdSenseSlotConfigured(slotId);
  const isGerman = locale === "de";

  useEffect(() => {
    if (!adsEnabled || !hasValidSlot || !slotRef.current) {
      return;
    }

    const node = slotRef.current;

    if (node.dataset.loaded === "true") {
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      node.dataset.loaded = "true";
    } catch {
      node.dataset.loaded = "error";
    }
  }, [adsEnabled, hasValidSlot]);

  const previewCopy =
    consent === "rejected"
      ? isGerman
        ? "Werbung ist deaktiviert, weil der Besucher die getrennten Sponsor-Flaechen abgelehnt hat."
        : "Ads are disabled because the visitor declined the separated sponsor surfaces."
      : adsLaunchState === "missing-client"
        ? isGerman
          ? "Vorschau-Slot aktiv. Hinterlege eine echte AdSense-Client-ID, um diese Flaeche fuer den Launch vorzubereiten."
          : "Preview slot active. Add a real AdSense client id to prepare this placement for launch."
        : adsLaunchState === "site-review-pending"
          ? isGerman
            ? "Die AdSense-Client-ID ist vorhanden, aber Live-Auslieferung bleibt gesperrt, bis die Website freigegeben ist."
            : "The AdSense client is present, but live serving stays blocked until the site is approved and marked ready."
          : adsLaunchState === "cmp-required"
            ? isGerman
              ? "Binde zuerst eine zertifizierte CMP an, bevor AdSense auf dieser Flaeche aktiviert wird."
              : "Connect your certified CMP before enabling AdSense on this placement."
            : !hasValidSlot
              ? isGerman
                ? "AdSense kann starten, aber diese Flaeche benoetigt noch ihre eigene numerische Slot-ID."
                : "AdSense can boot, but this surface still needs its own numeric slot id."
              : consent === "accepted"
                ? isGerman
                  ? "AdSense ist konfiguriert. Dieser Slot rendert hier, sobald die Seite fertig geladen ist."
                  : "AdSense is configured. This slot will render here once the page finishes loading."
                : isGerman
                  ? "Diese Sponsor-Flaeche bleibt inaktiv, bis der Besucher Werbung ausdruecklich erlaubt."
                  : "This sponsor surface stays inactive until the visitor explicitly allows ads.";

  const statusLabel = adsEnabled && hasValidSlot
    ? isGerman
      ? "AdSense live"
      : "AdSense live"
    : consent === "rejected"
      ? isGerman
        ? "Werbung aus"
        : "Ads off"
      : adsLaunchState === "missing-client"
        ? isGerman
          ? "Vorschau"
          : "Preview"
      : adsLaunchState === "site-review-pending"
        ? isGerman
          ? "Pruefung offen"
          : "Approval pending"
        : adsLaunchState === "cmp-required"
          ? isGerman
            ? "CMP noetig"
            : "CMP required"
          : hasValidSlot
            ? isGerman
              ? "Einwilligung offen"
              : "Consent pending"
            : isGerman
              ? "Slot fehlt"
              : "Slot missing";

  return (
    <div className={`ad-slot ad-slot-${variant}`}>
      <div className="ad-slot-head">
        <span className="subtle-pill">{label}</span>
        <span className="status-chip status-chip-soft">{statusLabel}</span>
      </div>

      <div className="ad-slot-copy">
        <strong>{title}</strong>
        <p>{description}</p>
      </div>

      <div className="ad-slot-frame" id={elementId}>
        {adsEnabled && hasValidSlot ? (
          <ins
            ref={slotRef}
            className="adsbygoogle ad-slot-surface"
            style={{ display: "block" }}
            data-ad-client={adsenseClientId}
            data-ad-slot={slotId}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        ) : (
          <div className="ad-slot-preview">
            <span>{isGerman ? "Werbeflaeche" : "Sponsored placement"}</span>
            <strong>
              {isGerman
                ? "Saubere, getrennte und premium-taugliche Werbeflaeche"
                : "Clean, separated, premium-safe ad surface"}
            </strong>
            <p>{previewCopy}</p>
          </div>
        )}
      </div>
    </div>
  );
}
