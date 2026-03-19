import type { MouseEvent } from "react";
import { Button } from "../Button";
import { goToHomeSection, type AppRoute } from "../../lib/appRoute";

type HeaderProps = {
  route: AppRoute;
};

export function Header({ route }: HeaderProps) {
  const isLegalPage = route !== "home";
  const handleHomeNav =
    (section: "top" | "demo" | "stats" | "leaderboard") =>
    (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      goToHomeSection(section);
    };

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <a className="brand" href="/" aria-label="Reaction Run home" onClick={handleHomeNav("top")}>
          <span className="brand-mark">R</span>
          <span className="brand-copy">
            <strong>Reaction Run</strong>
            <span>Reaction time, refined</span>
          </span>
        </a>

        <nav className="nav-links" aria-label="Primary">
          {isLegalPage ? (
            <>
              <a href="/" onClick={handleHomeNav("top")}>Product</a>
              <a href="#privacy">Datenschutz</a>
              <a href="#imprint">Impressum</a>
              <a href="#cookies">Cookies</a>
            </>
          ) : (
            <>
              <a href="/" onClick={handleHomeNav("demo")}>Reaction Test</a>
              <a href="/" onClick={handleHomeNav("stats")}>Stats</a>
              <a href="/" onClick={handleHomeNav("leaderboard")}>Leaderboard</a>
            </>
          )}
        </nav>

        <Button href="/" className="header-cta" onClick={handleHomeNav("demo")}>
          {isLegalPage ? "Open product" : "Start reaction test"}
        </Button>
      </div>
    </header>
  );
}
