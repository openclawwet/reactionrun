import type { MouseEvent } from "react";
import { goToHomeSection } from "../../lib/appRoute";
import { siteLegalProfile } from "../../data/legalContent";
import { useLocale } from "../../state/LocaleContext";

export function Footer() {
  const { locale } = useLocale();
  const isGerman = locale === "de";
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
          <span>
            {isGerman
              ? "Reaktionstest, Statistiken und Leaderboard in einer fokussierten Experience."
              : "Reaction test, statistics, and leaderboard in one focused experience."}
          </span>
        </div>

        <div className="footer-links">
          <a href="/" onClick={handleHomeNav("demo")}>{isGerman ? "Reaktionstest" : "Reaction Test"}</a>
          <a href="/" onClick={handleHomeNav("stats")}>{isGerman ? "Statistiken" : "Stats"}</a>
          <a href="/" onClick={handleHomeNav("leaderboard")}>Leaderboard</a>
          <a href="#privacy">{isGerman ? "Datenschutz" : "Privacy"}</a>
          <a href="#imprint">{isGerman ? "Impressum" : "Imprint"}</a>
          <a href="#cookies">Cookies</a>
          <a href={`mailto:${siteLegalProfile.contactEmail}`}>{isGerman ? "Kontakt" : "Contact"}</a>
        </div>
      </div>
    </footer>
  );
}
