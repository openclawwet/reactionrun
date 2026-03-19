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
  layout?: "default" | "frame-only";
};

export function AdSlot({
  label,
  title,
  description,
  slotId,
  variant = "feature",
  layout = "default",
}: AdSlotProps) {
  const { locale } = useLocale();
  const { adsEnabled, adsLaunchState, consentState } = useMonetization();
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
    adsLaunchState === "missing-client"
      ? isGerman
        ? "Vorschau-Slot aktiv. Hinterlege eine echte AdSense-Client-ID, um diese Flaeche fuer den Launch vorzubereiten."
        : "Preview slot active. Add a real AdSense client id to prepare this placement for launch."
      : adsLaunchState === "site-review-pending"
        ? isGerman
          ? "Die AdSense-Client-ID ist vorhanden, aber Live-Auslieferung bleibt gesperrt, bis die Website freigegeben ist."
          : "The AdSense client is present, but live serving stays blocked until the site is approved and marked ready."
        : adsLaunchState === "cmp-required"
          ? isGerman
            ? "Aktiviere zuerst Googles zertifizierte CMP, bevor AdSense auf dieser Flaeche live gehen kann."
            : "Enable Google's certified CMP before AdSense can go live on this placement."
          : !hasValidSlot
            ? isGerman
              ? "AdSense kann starten, aber diese Flaeche benoetigt noch ihre eigene numerische Slot-ID."
              : "AdSense can boot, but this surface still needs its own numeric slot id."
            : consentState === "granted"
              ? isGerman
                ? "Google CMP ist aktiv. Dieser Slot rendert ueber das veroefentlichte AdSense-Setup."
                : "Google CMP is active. This slot renders through the published AdSense setup."
              : consentState === "denied"
                ? isGerman
                  ? "Google CMP ist aktiv. Diese Flaeche wird gemaess der getroffenen Auswahl eingeschraenkt oder ohne Personalisierung ausgeliefert."
                  : "Google CMP is active. This surface is limited or served without personalization according to the visitor's choice."
                : isGerman
                  ? "Google CMP verwaltet diese Flaeche. Der Slot wird aktiv, sobald die Consent-Nachricht und AdSense-Bereitstellung abgeschlossen sind."
                  : "Google CMP manages this surface. The slot becomes active once the consent message and AdSense serving flow complete.";

  const statusLabel = adsEnabled && hasValidSlot
    ? consentState === "granted"
      ? isGerman
        ? "AdSense live"
        : "AdSense live"
      : consentState === "denied"
        ? isGerman
          ? "CMP aktiv"
          : "CMP active"
        : isGerman
          ? "Google CMP"
          : "Google CMP"
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
        : isGerman
          ? "Slot fehlt"
          : "Slot missing";

  const className = [
    "ad-slot",
    `ad-slot-${variant}`,
    `ad-slot-${layout}`,
    layout === "frame-only" ? "glass-panel" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={className}>
      {layout === "default" ? (
        <>
          <div className="ad-slot-head">
            <span className="subtle-pill">{label}</span>
            <span className="status-chip status-chip-soft">{statusLabel}</span>
          </div>

          <div className="ad-slot-copy">
            <strong>{title}</strong>
            <p>{description}</p>
          </div>
        </>
      ) : null}

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
