import { useEffect } from "react";
import { ConsentBanner } from "./components/ConsentBanner";
import { CookiesPage, ImprintPage, PrivacyPage } from "./components/legal/LegalPages";
import { Footer } from "./components/sections/Footer";
import { Header } from "./components/sections/Header";
import { HeroSection } from "./components/sections/HeroSection";
import { LeaderboardSection } from "./components/sections/LeaderboardSection";
import { WorkspaceSection } from "./components/sections/WorkspaceSection";
import { isLegalRoute, useAppRoute } from "./lib/appRoute";

function App() {
  const route = useAppRoute();
  const legalPage = isLegalRoute(route);

  useEffect(() => {
    document.title =
      route === "privacy"
        ? "Datenschutz | Reaction Run"
        : route === "imprint"
          ? "Impressum | Reaction Run"
          : route === "cookies"
            ? "Cookie-Einstellungen | Reaction Run"
            : "Reaction Run | Precision Reaction Testing";

    if (legalPage) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [legalPage, route]);

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
      {route !== "cookies" ? <ConsentBanner /> : null}
    </div>
  );
}

export default App;
