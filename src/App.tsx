import { useEffect } from "react";
import { CookieConsentBanner } from "./components/CookieConsentBanner";
import { GoodReactionTimePage, MobileVsDesktopPage } from "./components/content/GuidePages";
import { CookiesPage, ImprintPage, PrivacyPage } from "./components/legal/LegalPages";
import { FaqSection } from "./components/sections/FaqSection";
import { Footer } from "./components/sections/Footer";
import { Header } from "./components/sections/Header";
import { HeroSection } from "./components/sections/HeroSection";
import { LeaderboardSection } from "./components/sections/LeaderboardSection";
import { MethodSection } from "./components/sections/MethodSection";
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
  const isGuidePage = route === "good-reaction-time" || route === "mobile-vs-desktop";

  useEffect(() => {
    const routeMeta =
      route === "privacy"
        ? {
            title: isGerman ? "Datenschutz | Reaction Run" : "Privacy Policy | Reaction Run",
            description: isGerman
              ? "Datenschutzhinweise fuer Reaction Run mit Informationen zu lokalem Speicher, Leaderboard, Werbung und Kontakt."
              : "Privacy policy for Reaction Run with details about local storage, leaderboard submissions, advertising, and contact.",
          }
        : route === "imprint"
          ? {
              title: isGerman ? "Impressum | Reaction Run" : "Imprint | Reaction Run",
              description: isGerman
                ? "Impressum und Anbieterkennzeichnung fuer Reaction Run."
                : "Imprint and provider information for Reaction Run.",
            }
          : route === "cookies"
            ? {
                title: isGerman
                  ? "Cookie-Einstellungen | Reaction Run"
                  : "Cookie Settings | Reaction Run",
                description: isGerman
                  ? "Cookie-Einstellungen und Informationen zu erforderlichen Speicherungen und optionaler Werbung auf Reaction Run."
                  : "Cookie settings and information about necessary storage and optional advertising on Reaction Run.",
              }
            : route === "good-reaction-time"
              ? {
                  title: isGerman
                    ? "Was ist eine gute Reaktionszeit? | Reaction Run"
                    : "What is a good reaction time? | Reaction Run",
                  description: isGerman
                    ? "Ein kompakter Guide zu guten Reaktionszeit-Werten, validen Runs, Durchschnitt, Kontext und fairen Vergleichen im Browser."
                    : "A focused guide to good reaction-time scores, valid runs, averages, context, and fair browser-based comparison.",
                }
              : route === "mobile-vs-desktop"
                ? {
                    title: isGerman
                      ? "Mobile vs. Desktop Reaktionszeit | Reaction Run"
                      : "Mobile vs. Desktop Reaction Time | Reaction Run",
                    description: isGerman
                      ? "Warum sich Reaktionszeiten auf Handy und Desktop unterscheiden und wie man Scores geraeteuebergreifend fair einordnet."
                      : "Why reaction time differs between phone and desktop, and how to interpret scores fairly across devices.",
                  }
                : {
                    title: isGerman
                      ? "Reaction Run | Praeziser Reaktionstest"
                      : "Reaction Run | Precision Reaction Testing",
                    description: isGerman
                      ? "Reaction Run ist eine hochwertige Plattform zum Testen der Reaktionszeit, zum Verfolgen von Statistiken und zum Vergleichen im Leaderboard."
                      : "Reaction Run is a premium reaction time platform for testing speed, tracking progress, and comparing performance.",
                  };

    const { title, description } = routeMeta;

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
            "@type": isGuidePage ? "Article" : "SoftwareApplication",
            name: "Reaction Run",
            url: canonicalUrl,
            description,
            ...(isGuidePage
              ? {
                  headline: title,
                  author: {
                    "@type": "Organization",
                    name: "Reaction Run",
                  },
                  publisher: {
                    "@type": "Organization",
                    name: "Reaction Run",
                  },
                }
              : {
                  applicationCategory: "GameApplication",
                  operatingSystem: "Web",
                  offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "EUR",
                  },
                }),
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
  }, [isGerman, isGuidePage, legalPage, route]);

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
        ) : route === "good-reaction-time" ? (
          <GoodReactionTimePage />
        ) : route === "mobile-vs-desktop" ? (
          <MobileVsDesktopPage />
        ) : (
          <>
            <HeroSection />
            <WorkspaceSection />
            <LeaderboardSection />
            <MethodSection />
            <FaqSection />
          </>
        )}
      </main>
      <CookieConsentBanner />
      <Footer />
    </div>
  );
}

export default App;
