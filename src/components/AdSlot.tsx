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
  const isSilentSlot = adsLaunchState !== "ready";
  const showLocalPreview = import.meta.env.DEV;

  if (!hasValidSlot && !showLocalPreview) {
    return null;
  }

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
    : isGerman
      ? "Slot fehlt"
      : "Slot missing";

  const className = [
    "ad-slot",
    `ad-slot-${variant}`,
    `ad-slot-${layout}`,
    isSilentSlot ? "ad-slot-silent" : "",
    showLocalPreview ? "ad-slot-dev-visible" : "",
    layout === "frame-only" ? "glass-panel" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={className}>
      {layout === "default" && !isSilentSlot ? (
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
        {showLocalPreview ? (
          <div className="ad-slot-dev-preview">
            <span>{label}</span>
            <strong>{title}</strong>
            <p>
              {isGerman
                ? "Lokale Vorschau der Werbeflaeche. Dieser Rahmen ist nur auf localhost sichtbar."
                : "Local ad slot preview. This frame is only visible on localhost."}
            </p>
          </div>
        ) : adsEnabled ? (
          <ins
            ref={slotRef}
            className="adsbygoogle ad-slot-surface"
            style={{ display: "block" }}
            data-ad-client={adsenseClientId}
            data-ad-slot={slotId}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        ) : isSilentSlot ? null : (
          <div className="ad-slot-preview">
            <span>{isGerman ? "Werbeflaeche" : "Sponsored placement"}</span>
            <strong>
              {isGerman
                ? "Saubere, getrennte und premium-taugliche Werbeflaeche"
                : "Clean, separated, premium-safe ad surface"}
            </strong>
            <p>
              {consentState === "granted"
                ? isGerman
                  ? "Google CMP ist aktiv. Dieser Slot rendert ueber das veroefentlichte AdSense-Setup."
                  : "Google CMP is active. This slot renders through the published AdSense setup."
                : consentState === "denied"
                  ? isGerman
                    ? "Google CMP ist aktiv. Diese Flaeche wird gemaess der getroffenen Auswahl eingeschraenkt oder ohne Personalisierung ausgeliefert."
                    : "Google CMP is active. This surface is limited or served without personalization according to the visitor's choice."
                  : isGerman
                    ? "Google CMP verwaltet diese Flaeche. Der Slot wird aktiv, sobald die Consent-Nachricht und AdSense-Bereitstellung abgeschlossen sind."
                    : "Google CMP manages this surface. The slot becomes active once the consent message and AdSense serving flow complete."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
