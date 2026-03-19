import { useEffect, useState } from "react";

export type AppRoute = "home" | "privacy" | "imprint" | "cookies";
export type HomeSection = "top" | "demo" | "stats" | "leaderboard";

const LEGAL_ROUTE_PATHS: Record<Exclude<AppRoute, "home">, string> = {
  privacy: "/privacy",
  imprint: "/imprint",
  cookies: "/cookies",
};

const HOME_SECTION_SET = new Set<HomeSection>(["top", "demo", "stats", "leaderboard"]);
export const APP_ROUTE_EVENT = "reaction-run-route-change";

const normalizeHash = (hash: string) => hash.replace(/^#\/?/, "").trim().toLowerCase();

const normalizePathname = (pathname: string) => {
  const normalized = pathname.trim().toLowerCase().replace(/\/+$/, "");
  return normalized || "/";
};

const getLegacyRouteFromHash = (hash: string): AppRoute => {
  const normalized = normalizeHash(hash);

  if (!normalized) {
    return "home";
  }

  const [head] = normalized.split(/[/?]/);
  return head === "privacy" || head === "imprint" || head === "cookies" ? head : "home";
};

export const getHomeSectionFromHash = (hash: string): HomeSection | null => {
  const normalized = normalizeHash(hash);
  return HOME_SECTION_SET.has(normalized as HomeSection) ? (normalized as HomeSection) : null;
};

export const getAppRouteFromLocation = (pathname: string, hash = ""): AppRoute => {
  const normalizedPath = normalizePathname(pathname);

  if (normalizedPath === LEGAL_ROUTE_PATHS.privacy) {
    return "privacy";
  }

  if (normalizedPath === LEGAL_ROUTE_PATHS.imprint) {
    return "imprint";
  }

  if (normalizedPath === LEGAL_ROUTE_PATHS.cookies) {
    return "cookies";
  }

  return getLegacyRouteFromHash(hash);
};

export const getRoutePath = (route: AppRoute) =>
  route === "home" ? "/" : LEGAL_ROUTE_PATHS[route];

export const getConsentManagementUrl = () => "/?manage-consent=1";

export const isLegalRoute = (route: AppRoute) => route !== "home";

const emitRouteChange = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(APP_ROUTE_EVENT));
};

export const navigateToRoute = (route: AppRoute, replace = false) => {
  if (typeof window === "undefined") {
    return;
  }

  const targetUrl = `${getRoutePath(route)}${window.location.search}`;
  const updateHistory = replace ? window.history.replaceState : window.history.pushState;
  updateHistory.call(window.history, null, "", targetUrl);
  emitRouteChange();
};

export const goToHomeSection = (
  sectionId: HomeSection = "top",
  behavior: ScrollBehavior = "smooth",
) => {
  if (typeof window === "undefined") {
    return;
  }

  const url = new URL(window.location.href);
  url.pathname = "/";
  url.hash = "";

  if (window.location.pathname !== "/" || window.location.hash) {
    window.history.pushState(null, "", `${url.pathname}${url.search}`);
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
    typeof window === "undefined"
      ? "home"
      : getAppRouteFromLocation(window.location.pathname, window.location.hash),
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const handleRouteChange = () => {
      setRoute(getAppRouteFromLocation(window.location.pathname, window.location.hash));
    };

    const legacyRoute = getLegacyRouteFromHash(window.location.hash);
    const productSection = getHomeSectionFromHash(window.location.hash);

    if (legacyRoute !== "home" && window.location.pathname === "/") {
      navigateToRoute(legacyRoute, true);
    } else if (productSection) {
      goToHomeSection(productSection, "auto");
    }

    window.addEventListener("popstate", handleRouteChange);
    window.addEventListener(APP_ROUTE_EVENT, handleRouteChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
      window.removeEventListener(APP_ROUTE_EVENT, handleRouteChange);
    };
  }, []);

  return route;
}
