import { useEffect } from "react";
import { CookiesPage, ImprintPage, PrivacyPage } from "./components/legal/LegalPages";
import { Footer } from "./components/sections/Footer";
import { Header } from "./components/sections/Header";
import { HeroSection } from "./components/sections/HeroSection";
import { LeaderboardSection } from "./components/sections/LeaderboardSection";
import { WorkspaceSection } from "./components/sections/WorkspaceSection";
import { isLegalRoute, useAppRoute } from "./lib/appRoute";
import { useLocale } from "./state/LocaleContext";

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

    document.title = title;

    const metaDescription = document.querySelector('meta[name="description"]');

    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    }

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
      <Footer />
    </div>
  );
}

export default App;
