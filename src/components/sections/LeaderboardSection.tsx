import { AdSlot } from "../AdSlot";
import { GlassPanel } from "../GlassPanel";
import { SectionHeader } from "../SectionHeader";
import { adsensePrimarySlot } from "../../lib/ads";
import { useLocale } from "../../state/LocaleContext";
import { useReactionProduct } from "../../state/ReactionProductContext";

export function LeaderboardSection() {
  const { locale } = useLocale();
  const { leaderboardRows, leaderboardStatus, provisionalRank } = useReactionProduct();
  const isGerman = locale === "de";
  const hasRows = leaderboardRows.length > 0;

  return (
    <section className="section" id="leaderboard">
      <div className="container">
        <SectionHeader
          eyebrow="Leaderboard"
          title="Leaderboard"
          description={
            isGerman
              ? "Vergleiche deine beste Reaktionszeit sofort und sieh, wo dein aktueller Score landet."
              : "Compare your best reaction time instantly and see where your current score lands."
          }
        />

        <div className="leaderboard-grid">
          <GlassPanel className="leaderboard-panel">
            <div className="leaderboard-toolbar">
              <div className="toolbar-pills">
                <span className="toolbar-pill toolbar-pill-active">{isGerman ? "Global" : "Global"}</span>
                <span className="toolbar-pill">Live</span>
              </div>
              <span className="leaderboard-note">{leaderboardStatus}</span>
            </div>

            <div
              className="leaderboard-table"
              role="table"
              aria-label={isGerman ? "Reaction-Run-Leaderboard" : "Reaction leaderboard"}
            >
              <div className="leaderboard-row leaderboard-row-header" role="row">
                <span role="columnheader">{isGerman ? "Rang" : "Rank"}</span>
                <span role="columnheader">{isGerman ? "Spieler" : "Player"}</span>
                <span role="columnheader">{isGerman ? "Region" : "Region"}</span>
                <span role="columnheader">{isGerman ? "Bestwert" : "Best"}</span>
                <span role="columnheader">{isGerman ? "Status" : "Form"}</span>
              </div>

              {hasRows ? (
                leaderboardRows.map((entry) => (
                  <div
                    className={`leaderboard-row${entry.isCurrentUser ? " leaderboard-row-user" : ""}`}
                    role="row"
                    key={`${entry.tag}-${entry.rank}`}
                  >
                    <span role="cell" className="leaderboard-rank">
                      {entry.rank}
                    </span>
                    <span role="cell" className="leaderboard-player">
                      <strong>{entry.name}</strong>
                      <small>{entry.tag}</small>
                    </span>
                    <span role="cell">{entry.region}</span>
                    <span role="cell" className="leaderboard-best">
                      {entry.best}
                    </span>
                    <span role="cell" className="leaderboard-delta">
                      {entry.delta}
                    </span>
                  </div>
                ))
              ) : (
                <div className="leaderboard-empty" role="row">
                  <strong>{isGerman ? "Noch keine Live-Eintraege." : "No live entries yet."}</strong>
                  <p>
                    {isGerman
                      ? "Fuehre oben einen gueltigen Test durch und sende deinen Score ins Leaderboard, um den ersten echten Eintrag zu setzen."
                      : "Run a valid test above and submit your score to the leaderboard to create the first real entry."}
                  </p>
                </div>
              )}
            </div>
          </GlassPanel>

          <div className="leaderboard-side">
            <GlassPanel className="leaderboard-side-panel">
              <span className="subtle-pill">
                {provisionalRank
                  ? isGerman
                    ? `Aktueller Rang ${provisionalRank}`
                    : `Current rank ${provisionalRank}`
                  : isGerman
                    ? "Ranking"
                    : "Ranking"}
              </span>
              <h3>
                {provisionalRank
                  ? isGerman
                    ? `Dein aktueller Bestwert steht auf ${provisionalRank}.`
                    : `Your current best sits at ${provisionalRank}.`
                  : isGerman
                    ? "Absolviere einen gueltigen Test, um ins Board zu kommen."
                    : "Run a valid test to enter the board."}
              </h3>
              <p>
                {provisionalRank
                  ? isGerman
                    ? "Das Board aktualisiert sich aus deinem echten Testergebnis, hebt deine Zeile hervor und bleibt leicht scanbar."
                    : "The board updates from your real test result, highlights your row, and keeps the comparison easy to scan."
                  : isGerman
                    ? "Starte oben mit dem Test und nutze danach Leaderboard anzeigen, um dein Ergebnis direkt in den Ranking-Flow zu schicken."
                    : "Start with the test above, then use Show leaderboard to place your result directly into the ranking flow."}
              </p>
            </GlassPanel>

            <AdSlot
              label={isGerman ? "Werbung" : "Sponsored"}
              title={isGerman ? "Sponsor-Slot am Leaderboard" : "Leaderboard sponsor slot"}
              description={
                isGerman
                  ? "Eine premium-taugliche Werbeplatzierung ausserhalb der eigentlichen Ranking-Tabelle."
                  : "A premium-safe ad placement outside the core ranking table."
              }
              slotId={adsensePrimarySlot}
              layout="frame-only"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
