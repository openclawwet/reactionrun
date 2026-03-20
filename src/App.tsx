import { useEffect } from "react";
import { CookieConsentBanner } from "./components/CookieConsentBanner";
import { CookiesPage, ImprintPage, PrivacyPage } from "./components/legal/LegalPages";
import { Footer } from "./components/sections/Footer";
import { Header } from "./components/sections/Header";
import { HeroSection } from "./components/sections/HeroSection";
import { LeaderboardSection } from "./components/sections/LeaderboardSection";
import { WorkspaceSection } from "./components/sections/WorkspaceSection";
import { getRoutePath, isLegalRoute, useAppRoute } from "./lib/appRoute";
import { useLocale } from "./state/LocaleContext";

const SITE_URL = "https://reactionrun.com";

const ensureMetaTag = (
  selector: string,
  attributes: Record<string, string>,
) => {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
};

const ensureLinkTag = (
  selector: string,
  attributes: Record<string, string>,
) => {
  let element = document.head.querySelector(selector) as HTMLLinkElement | null;

  if (!element) {
    element = document.createElement("link");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
};

const ensureStructuredData = (id: string, payload: object | object[]) => {
  let element = document.head.querySelector(`#${id}`) as HTMLScriptElement | null;

  if (!element) {
    element = document.createElement("script");
    element.type = "application/ld+json";
    element.id = id;
    document.head.appendChild(element);
  }

  element.textContent = JSON.stringify(payload);
};

function App() {
  const route = useAppRoute();
  const legalPage = isLegalRoute(route);
  const { locale } = useLocale();
  const isGerman = locale === "de";

  useEffect(() => {
    const title =
      route === "privacy"
        ? isGerman
          ? "Datenschutz | Reaction Run"
          : "Privacy Policy | Reaction Run"
        : route === "imprint"
          ? isGerman
            ? "Impressum | Reaction Run"
            : "Imprint | Reaction Run"
          : route === "cookies"
            ? isGerman
              ? "Cookie-Einstellungen | Reaction Run"
              : "Cookie Settings | Reaction Run"
            : isGerman
              ? "Reaction Run | Praeziser Reaktionstest"
              : "Reaction Run | Precision Reaction Testing";

    const description =
      route === "privacy"
        ? isGerman
          ? "Datenschutzhinweise fuer Reaction Run mit Informationen zu lokalem Speicher, Leaderboard, Werbung und Kontakt."
          : "Privacy policy for Reaction Run with details about local storage, leaderboard submissions, advertising, and contact."
        : route === "imprint"
          ? isGerman
            ? "Impressum und Anbieterkennzeichnung fuer Reaction Run."
            : "Imprint and provider information for Reaction Run."
          : route === "cookies"
            ? isGerman
              ? "Cookie-Einstellungen und Informationen zu erforderlichen Speicherungen und optionaler Werbung auf Reaction Run."
              : "Cookie settings and information about necessary storage and optional advertising on Reaction Run."
            : isGerman
              ? "Reaction Run ist eine hochwertige Plattform zum Testen der Reaktionszeit, zum Verfolgen von Statistiken und zum Vergleichen im Leaderboard."
              : "Reaction Run is a premium reaction time platform for testing speed, tracking progress, and comparing performance.";

    const canonicalPath = getRoutePath(route);
    const canonicalUrl = `${SITE_URL}${canonicalPath}`;
    const robots = legalPage ? "noindex, follow" : "index, follow";
    const structuredData = legalPage
      ? {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: title,
          description,
          url: canonicalUrl,
          inLanguage: isGerman ? "de-DE" : "en-US",
          isPartOf: {
            "@type": "WebSite",
            name: "Reaction Run",
            url: SITE_URL,
          },
        }
      : [
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Reaction Run",
            url: SITE_URL,
            inLanguage: isGerman ? "de-DE" : "en-US",
            description,
          },
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Reaction Run",
            applicationCategory: "GameApplication",
            operatingSystem: "Web",
            url: canonicalUrl,
            description,
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "EUR",
            },
          },
        ];

    document.title = title;

    const metaDescription = document.querySelector('meta[name="description"]');

    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    }

    ensureMetaTag('meta[name="robots"]', { name: "robots", content: robots });
    ensureMetaTag('meta[name="googlebot"]', {
      name: "googlebot",
      content: `${robots}, max-image-preview:large, max-snippet:-1, max-video-preview:-1`,
    });
    ensureMetaTag('meta[property="og:title"]', {
      property: "og:title",
      content: title,
    });
    ensureMetaTag('meta[property="og:description"]', {
      property: "og:description",
      content: description,
    });
    ensureMetaTag('meta[property="og:url"]', {
      property: "og:url",
      content: canonicalUrl,
    });
    ensureMetaTag('meta[property="og:type"]', {
      property: "og:type",
      content: legalPage ? "article" : "website",
    });
    ensureMetaTag('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: title,
    });
    ensureMetaTag('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: description,
    });
    ensureLinkTag('link[rel="canonical"]', {
      rel: "canonical",
      href: canonicalUrl,
    });
    ensureStructuredData("reaction-run-structured-data", structuredData);

    if (legalPage) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [isGerman, legalPage, route]);

  return (
    <div className="page-shell">
      <div className="page-backdrop" aria-hidden="true" />
      <Header route={route} />
      <main>
        {route === "privacy" ? (
          <PrivacyPage />
        ) : route === "imprint" ? (
          <ImprintPage />
        ) : route === "cookies" ? (
          <CookiesPage />
        ) : (
          <>
            <HeroSection />
            <WorkspaceSection />
            <LeaderboardSection />
          </>
        )}
      </main>
      <CookieConsentBanner />
      <Footer />
    </div>
  );
}

export default App;
