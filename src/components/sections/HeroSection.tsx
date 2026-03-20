import { Fragment, type CSSProperties } from "react";
import { Button } from "../Button";
import { ReactionDemo } from "../ReactionDemo";
import { goToHomeSection } from "../../lib/appRoute";
import { useLocale } from "../../state/LocaleContext";

const renderAnimatedWords = (
  text: string,
  startIndex = 0,
  className = "",
) =>
  text.split(" ").map((word, index, words) => (
    <Fragment key={`${word}-${startIndex + index}`}>
      <span
        className={["hero-word", className].filter(Boolean).join(" ")}
        style={{ "--word-index": startIndex + index } as CSSProperties}
        aria-hidden="true"
      >
        {word}
      </span>
      {index < words.length - 1 ? " " : null}
    </Fragment>
  ));

export function HeroSection() {
  const { locale } = useLocale();
  const isGerman = locale === "de";
  const titleLead = isGerman ? "Miss deine Reaktionszeit," : "Measure reaction time,";
  const titleEmphasis = isGerman ? "sofort." : "instantly.";
  const leadWordCount = titleLead.split(" ").length;
  const fullTitle = `${titleLead} ${titleEmphasis}`;

  return (
    <section className="section hero-section" id="top">
      <div className="container hero-shell">
        <div className="hero-copy">
          <span className="section-eyebrow">{isGerman ? "Reaktionstest" : "Reaction test"}</span>
          <h1 aria-label={fullTitle}>
            <span className="hero-title-line">
              {renderAnimatedWords(titleLead)}
            </span>
            <span className="hero-title-line hero-emphasis">
              {renderAnimatedWords(titleEmphasis, leadWordCount, "hero-word-emphasis")}
            </span>
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
