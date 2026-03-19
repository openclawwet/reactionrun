import { useEffect, useState } from "react";

export type AppRoute = "home" | "privacy" | "imprint" | "cookies";

const LEGAL_ROUTE_SET = new Set<AppRoute>(["privacy", "imprint", "cookies"]);
const HOME_SECTION_SET = new Set(["top", "demo", "stats", "leaderboard"]);
const APP_ROUTE_EVENT = "reaction-run-route-change";

const normalizeHash = (hash: string) => hash.replace(/^#\/?/, "").trim().toLowerCase();

export const getAppRouteFromHash = (hash: string): AppRoute => {
  const normalized = normalizeHash(hash);

  if (!normalized) {
    return "home";
  }

  const [head] = normalized.split(/[/?]/);
  return LEGAL_ROUTE_SET.has(head as AppRoute) ? (head as AppRoute) : "home";
};

export const isLegalRoute = (route: AppRoute) => route !== "home";

export const getHomeSectionFromHash = (hash: string) => {
  const normalized = normalizeHash(hash);
  return HOME_SECTION_SET.has(normalized) ? normalized : null;
};

const emitRouteChange = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(APP_ROUTE_EVENT));
};

export const goToHomeSection = (
  sectionId: "top" | "demo" | "stats" | "leaderboard" = "top",
  behavior: ScrollBehavior = "smooth",
) => {
  if (typeof window === "undefined") {
    return;
  }

  const cleanUrl = `${window.location.pathname}${window.location.search}`;
  const currentRoute = getAppRouteFromHash(window.location.hash);

  if (window.location.hash) {
    if (currentRoute === "home") {
      window.history.replaceState(null, "", cleanUrl);
    } else {
      window.history.pushState(null, "", cleanUrl);
    }
  }

  emitRouteChange();

  const scrollToTarget = () => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior,
      block: "start",
    });
  };

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(scrollToTarget);
  });
};

export function useAppRoute() {
  const [route, setRoute] = useState<AppRoute>(() =>
    typeof window === "undefined" ? "home" : getAppRouteFromHash(window.location.hash),
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const handleRouteChange = () => {
      setRoute(getAppRouteFromHash(window.location.hash));
    };

    const productSection = getHomeSectionFromHash(window.location.hash);

    if (productSection) {
      goToHomeSection(
        productSection as "top" | "demo" | "stats" | "leaderboard",
        "auto",
      );
    }

    window.addEventListener("hashchange", handleRouteChange);
    window.addEventListener("popstate", handleRouteChange);
    window.addEventListener(APP_ROUTE_EVENT, handleRouteChange);

    return () => {
      window.removeEventListener("hashchange", handleRouteChange);
      window.removeEventListener("popstate", handleRouteChange);
      window.removeEventListener(APP_ROUTE_EVENT, handleRouteChange);
    };
  }, []);

  return route;
}
