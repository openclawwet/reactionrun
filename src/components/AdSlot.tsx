import { useEffect, useId, useRef } from "react";
import { adsenseClientId, isAdSenseSlotConfigured } from "../lib/ads";
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
  const { adsEnabled, adsLaunchState, consent } = useMonetization();
  const slotRef = useRef<HTMLModElement | null>(null);
  const elementId = useId();
  const hasValidSlot = isAdSenseSlotConfigured(slotId);

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
      ? "Ads are disabled because the visitor declined the separated sponsor surfaces."
      : adsLaunchState === "missing-client"
        ? "Preview slot active. Add a real AdSense client id to prepare this placement for launch."
        : adsLaunchState === "site-review-pending"
          ? "The AdSense client is present, but live serving stays blocked until the site is approved and marked ready."
          : adsLaunchState === "cmp-required"
            ? "Connect your certified CMP before enabling AdSense on this placement."
            : !hasValidSlot
              ? "AdSense can boot, but this surface still needs its own numeric slot id."
              : consent === "accepted"
                ? "AdSense is configured. This slot will render here once the page finishes loading."
                : "This sponsor surface stays inactive until the visitor explicitly allows ads.";

  const statusLabel = adsEnabled && hasValidSlot
    ? "AdSense live"
    : consent === "rejected"
      ? "Ads off"
      : adsLaunchState === "missing-client"
        ? "Preview"
      : adsLaunchState === "site-review-pending"
        ? "Approval pending"
        : adsLaunchState === "cmp-required"
          ? "CMP required"
          : hasValidSlot
            ? "Consent pending"
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
            <span>Sponsored placement</span>
            <strong>Clean, separated, premium-safe ad surface</strong>
            <p>{previewCopy}</p>
          </div>
        )}
      </div>
    </div>
  );
}
