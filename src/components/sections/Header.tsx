import { Button } from "../Button";
import type { AppRoute } from "../../lib/appRoute";

type HeaderProps = {
  route: AppRoute;
};

export function Header({ route }: HeaderProps) {
  const isLegalPage = route !== "home";

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <a className="brand" href="#top" aria-label="Reaction Run home">
          <span className="brand-mark">R</span>
          <span className="brand-copy">
            <strong>Reaction Run</strong>
            <span>Reaction time, refined</span>
          </span>
        </a>

        <nav className="nav-links" aria-label="Primary">
          {isLegalPage ? (
            <>
              <a href="#demo">Product</a>
              <a href="#privacy">Datenschutz</a>
              <a href="#imprint">Impressum</a>
              <a href="#cookies">Cookies</a>
            </>
          ) : (
            <>
              <a href="#demo">Reaction Test</a>
              <a href="#stats">Stats</a>
              <a href="#leaderboard">Leaderboard</a>
            </>
          )}
        </nav>

        <Button href="#demo" className="header-cta">
          {isLegalPage ? "Open product" : "Start reaction test"}
        </Button>
      </div>
    </header>
  );
}
