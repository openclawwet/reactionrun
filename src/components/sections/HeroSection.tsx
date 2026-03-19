import { Button } from "../Button";
import { ReactionDemo } from "../ReactionDemo";
import { goToHomeSection } from "../../lib/appRoute";

export function HeroSection() {
  return (
    <section className="section hero-section" id="top">
      <div className="container hero-shell">
        <div className="hero-copy">
          <span className="section-eyebrow">Reaction test</span>
          <h1>
            Measure reaction time,
            <span className="hero-emphasis"> instantly.</span>
          </h1>
          <p>
            Run the test immediately, check your live stats, and compare your result in
            the leaderboard. Fast, focused, and built for repeat runs.
          </p>

          <div className="hero-actions">
            <Button
              href="/"
              onClick={(event) => {
                event.preventDefault();
                goToHomeSection("demo");
              }}
            >
              Start reaction test
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
