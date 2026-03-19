const parseFlag = (value?: string) => {
  const normalized = value?.trim().toLowerCase() || "";
  return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
};

export type AdsLaunchState =
  | "missing-client"
  | "site-review-pending"
  | "cmp-required"
  | "ready";

export const adsenseClientId = import.meta.env.VITE_ADSENSE_CLIENT_ID?.trim() || "";
export const adsenseTestSlot = import.meta.env.VITE_ADSENSE_SLOT_TEST?.trim() || "";
export const adsensePrimarySlot = import.meta.env.VITE_ADSENSE_SLOT_PRIMARY?.trim() || "";
export const adsenseSecondarySlot = import.meta.env.VITE_ADSENSE_SLOT_SECONDARY?.trim() || "";

export const hasAdSenseClientConfig = /^ca-pub-\d+$/.test(adsenseClientId);
export const isAdSenseSiteReady = parseFlag(import.meta.env.VITE_ADSENSE_SITE_READY);
export const isAdSenseCmpReady = parseFlag(import.meta.env.VITE_ADSENSE_CMP_READY);
export const adsensePublisherId = hasAdSenseClientConfig ? adsenseClientId.replace(/^ca-/, "") : "";

export const adsLaunchState: AdsLaunchState = !hasAdSenseClientConfig
  ? "missing-client"
  : !isAdSenseSiteReady
    ? "site-review-pending"
    : !isAdSenseCmpReady
      ? "cmp-required"
      : "ready";

export const isAdSenseSlotConfigured = (slotId?: string) => Boolean(slotId && /^\d+$/.test(slotId));
export const isAdSenseConfigured = adsLaunchState === "ready";
