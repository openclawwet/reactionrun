import { useEffect, useState } from "react";

export type AppRoute = "home" | "privacy" | "imprint" | "cookies";

const LEGAL_ROUTE_SET = new Set<AppRoute>(["privacy", "imprint", "cookies"]);

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

export function useAppRoute() {
  const [route, setRoute] = useState<AppRoute>(() =>
    typeof window === "undefined" ? "home" : getAppRouteFromHash(window.location.hash),
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const handleHashChange = () => {
      setRoute(getAppRouteFromHash(window.location.hash));
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return route;
}
