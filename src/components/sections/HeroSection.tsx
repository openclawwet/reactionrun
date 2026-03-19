import { Button } from "../Button";
import { ReactionDemo } from "../ReactionDemo";
import { goToHomeSection } from "../../lib/appRoute";
import { useLocale } from "../../state/LocaleContext";

export function HeroSection() {
  const { locale } = useLocale();
  const isGerman = locale === "de";

  return (
    <section className="section hero-section" id="top">
      <div className="container hero-shell">
        <div className="hero-copy">
          <span className="section-eyebrow">{isGerman ? "Reaktionstest" : "Reaction test"}</span>
          <h1>
            {isGerman ? "Miss deine Reaktionszeit," : "Measure reaction time,"}
            <span className="hero-emphasis"> {isGerman ? "sofort." : "instantly."}</span>
          </h1>
          <p>
            {isGerman
              ? "Starte den Test sofort, pruefe deine Live-Statistiken und vergleiche dein Ergebnis direkt im Leaderboard. Schnell, fokussiert und fuer wiederholte Runs gebaut."
              : "Run the test immediately, check your live stats, and compare your result in the leaderboard. Fast, focused, and built for repeat runs."}
          </p>

          <div className="hero-actions">
            <Button
              href="/"
              onClick={(event) => {
                event.preventDefault();
                goToHomeSection("demo");
              }}
            >
              {isGerman ? "Reaktionstest starten" : "Start reaction test"}
            </Button>
          </div>
        </div>

        <div className="hero-demo-wrap">
          <ReactionDemo />
        </div>
      </div>
    </section>
  );
}
