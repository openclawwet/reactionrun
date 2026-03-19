import type { MouseEvent } from "react";
import { goToHomeSection } from "../../lib/appRoute";

export function Footer() {
  const handleHomeNav =
    (section: "demo" | "stats" | "leaderboard") =>
    (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      goToHomeSection(section);
    };

  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <div className="footer-brand">
          <strong>Reaction Run</strong>
          <span>Reaction test, statistics, and leaderboard in one focused experience.</span>
        </div>

        <div className="footer-links">
          <a href="/" onClick={handleHomeNav("demo")}>Reaction Test</a>
          <a href="/" onClick={handleHomeNav("stats")}>Stats</a>
          <a href="/" onClick={handleHomeNav("leaderboard")}>Leaderboard</a>
          <a href="#privacy">Datenschutz</a>
          <a href="#imprint">Impressum</a>
          <a href="#cookies">Cookies</a>
          <a href="mailto:team@reactionrun.com">Contact</a>
        </div>
      </div>
    </footer>
  );
}
