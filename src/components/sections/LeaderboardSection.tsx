import { AdSlot } from "../AdSlot";
import { GlassPanel } from "../GlassPanel";
import { SectionHeader } from "../SectionHeader";
import { adsensePrimarySlot } from "../../lib/ads";
import { useLocale } from "../../state/LocaleContext";
import { useReactionProduct } from "../../state/ReactionProductContext";

export function LeaderboardSection() {
  const { locale } = useLocale();
  const {
    leaderboardRows,
    leaderboardStatus,
    provisionalRank,
    leaderboardView,
    setLeaderboardView,
  } = useReactionProduct();
  const isGerman = locale === "de";
  const hasRows = leaderboardRows.length > 0;
  const firstColumnLabel =
    leaderboardView === "recent"
      ? isGerman
        ? "Neu"
        : "Latest"
      : isGerman
        ? "Rang"
        : "Rank";

  return (
    <section className="section" id="leaderboard">
      <div className="container">
        <SectionHeader
          eyebrow="Leaderboard"
          title="Leaderboard"
          description={
            isGerman
              ? "Sieh die globalen Bestwerte und die letzten veroefentlichten Scores aus allen Geraeten und Sessions."
              : "See global best scores and the latest published runs across devices and sessions."
          }
        />

        <div className="leaderboard-grid">
          <GlassPanel className="leaderboard-panel">
            <div className="leaderboard-toolbar">
              <div className="toolbar-pills">
                <button
                  type="button"
                  className={
                    leaderboardView === "top"
                      ? "toolbar-pill toolbar-pill-active"
                      : "toolbar-pill"
                  }
                  onClick={() => setLeaderboardView("top")}
                  aria-pressed={leaderboardView === "top"}
                >
                  {isGerman ? "Top 100" : "Top 100"}
                </button>
                <button
                  type="button"
                  className={
                    leaderboardView === "recent"
                      ? "toolbar-pill toolbar-pill-active"
                      : "toolbar-pill"
                  }
                  onClick={() => setLeaderboardView("recent")}
                  aria-pressed={leaderboardView === "recent"}
                >
                  {isGerman ? "Letzte 100" : "Latest 100"}
                </button>
              </div>
              <span className="leaderboard-note">{leaderboardStatus}</span>
            </div>

            <div
              className="leaderboard-table"
              role="table"
              aria-label={isGerman ? "Reaction-Run-Leaderboard" : "Reaction leaderboard"}
            >
              <div className="leaderboard-row leaderboard-row-header" role="row">
                <span role="columnheader">{firstColumnLabel}</span>
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
                    key={entry.id ?? `${entry.tag}-${entry.rank}`}
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
                      ? "Fuehre oben einen gueltigen Test durch und nutze danach Leaderboard anzeigen, damit dein Score hier global erscheint."
                      : "Run a valid test above, then use Show leaderboard so your score appears here globally."}
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
                {leaderboardView === "recent"
                  ? isGerman
                    ? "Die letzten 100 veroeffentlichten Eintraege laufen hier live ein."
                    : "The latest 100 published entries appear here live."
                  : provisionalRank
                  ? isGerman
                    ? `Dein aktueller Bestwert steht auf ${provisionalRank}.`
                    : `Your current best sits at ${provisionalRank}.`
                  : isGerman
                    ? "Absolviere einen gueltigen Test, um ins Board zu kommen."
                    : "Run a valid test to enter the board."}
              </h3>
              <p>
                {leaderboardView === "recent"
                  ? isGerman
                    ? "Wenn ein Score am MacBook, Handy oder Tablet veroeffentlicht wurde, taucht er hier geraeteuebergreifend in der Verlaufsansicht auf."
                    : "Once a score has been published from a MacBook, phone, or tablet, it appears here across devices in the latest feed."
                  : provisionalRank
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
