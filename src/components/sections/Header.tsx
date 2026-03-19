import { useEffect, useState, type MouseEvent } from "react";
import { Button } from "../Button";
import { goToHomeSection, type AppRoute } from "../../lib/appRoute";
import { useLocale } from "../../state/LocaleContext";

type HeaderProps = {
  route: AppRoute;
};

export function Header({ route }: HeaderProps) {
  const isLegalPage = route !== "home";
  const { locale, setLocale } = useLocale();
  const isGerman = locale === "de";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [route]);

  const handleHomeNav =
    (section: "top" | "demo" | "stats" | "leaderboard") =>
    (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      setMobileMenuOpen(false);
      goToHomeSection(section);
    };

  const handleMenuLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <a
          className="brand"
          href="/"
          aria-label={isGerman ? "Reaction Run Startseite" : "Reaction Run home"}
          onClick={handleHomeNav("top")}
        >
          <span className="brand-mark" aria-hidden="true">
            <img src="/reaction-run-mark.svg" alt="" />
          </span>
          <span className="brand-copy">
            <strong>Reaction Run</strong>
            <span>{isGerman ? "Reaktionszeit, verfeinert" : "Reaction time, refined"}</span>
          </span>
        </a>

        <nav className="nav-links" aria-label={isGerman ? "Hauptnavigation" : "Primary"}>
          {isLegalPage ? (
            <>
              <a href="/" onClick={handleHomeNav("top")}>{isGerman ? "Produkt" : "Product"}</a>
              <a href="/privacy">{isGerman ? "Datenschutz" : "Privacy"}</a>
              <a href="/imprint">{isGerman ? "Impressum" : "Imprint"}</a>
              <a href="/cookies">{isGerman ? "Cookies" : "Cookies"}</a>
            </>
          ) : (
            <>
              <a href="/" onClick={handleHomeNav("demo")}>{isGerman ? "Reaktionstest" : "Reaction Test"}</a>
              <a href="/" onClick={handleHomeNav("stats")}>{isGerman ? "Statistiken" : "Stats"}</a>
              <a href="/" onClick={handleHomeNav("leaderboard")}>Leaderboard</a>
            </>
          )}
        </nav>

        <div className="header-controls">
          <div
            className="language-toggle"
            role="group"
            aria-label={isGerman ? "Sprache" : "Language"}
          >
            <button
              type="button"
              className={
                locale === "de"
                  ? "language-toggle-button language-toggle-button-active"
                  : "language-toggle-button"
              }
              onClick={() => setLocale("de")}
              aria-pressed={locale === "de"}
            >
              DE
            </button>
            <button
              type="button"
              className={
                locale === "en"
                  ? "language-toggle-button language-toggle-button-active"
                  : "language-toggle-button"
              }
              onClick={() => setLocale("en")}
              aria-pressed={locale === "en"}
            >
              EN
            </button>
          </div>

          <Button href="/" className="header-cta" onClick={handleHomeNav("demo")}>
            {isLegalPage
              ? isGerman
                ? "Produkt oeffnen"
                : "Open product"
              : isGerman
                ? "Reaktionstest starten"
                : "Start reaction test"}
          </Button>

          <button
            type="button"
            className={mobileMenuOpen ? "mobile-nav-toggle mobile-nav-toggle-active" : "mobile-nav-toggle"}
            aria-label={isGerman ? "Menue oeffnen" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((current) => !current)}
          >
            <span className="mobile-nav-icon" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      {mobileMenuOpen ? (
        <div className="container mobile-nav-shell">
          <div className="mobile-nav-panel glass-panel">
            <div className="mobile-nav-links" aria-label={isGerman ? "Mobilnavigation" : "Mobile navigation"}>
              {isLegalPage ? (
                <>
                  <a href="/" onClick={handleHomeNav("top")}>{isGerman ? "Produkt" : "Product"}</a>
                  <a href="/privacy" onClick={handleMenuLinkClick}>{isGerman ? "Datenschutz" : "Privacy"}</a>
                  <a href="/imprint" onClick={handleMenuLinkClick}>{isGerman ? "Impressum" : "Imprint"}</a>
                  <a href="/cookies" onClick={handleMenuLinkClick}>{isGerman ? "Cookies" : "Cookies"}</a>
                </>
              ) : (
                <>
                  <a href="/" onClick={handleHomeNav("demo")}>{isGerman ? "Reaktionstest" : "Reaction Test"}</a>
                  <a href="/" onClick={handleHomeNav("stats")}>{isGerman ? "Statistiken" : "Stats"}</a>
                  <a href="/" onClick={handleHomeNav("leaderboard")}>Leaderboard</a>
                  <a href="/privacy" onClick={handleMenuLinkClick}>{isGerman ? "Datenschutz" : "Privacy"}</a>
                  <a href="/imprint" onClick={handleMenuLinkClick}>{isGerman ? "Impressum" : "Imprint"}</a>
                  <a href="/cookies" onClick={handleMenuLinkClick}>{isGerman ? "Cookies" : "Cookies"}</a>
                </>
              )}
            </div>

            <Button
              href="/"
              className="mobile-nav-cta"
              onClick={handleHomeNav(isLegalPage ? "top" : "demo")}
            >
              {isLegalPage
                ? isGerman
                  ? "Produkt oeffnen"
                  : "Open product"
                : isGerman
                  ? "Reaktionstest starten"
                  : "Start reaction test"}
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
