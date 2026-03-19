import { AdSlot } from "../AdSlot";
import { GlassPanel } from "../GlassPanel";
import { SectionHeader } from "../SectionHeader";
import { adsensePrimarySlot } from "../../lib/ads";
import { useReactionProduct } from "../../state/ReactionProductContext";

export function LeaderboardSection() {
  const { leaderboardRows, leaderboardStatus, provisionalRank } = useReactionProduct();

  return (
    <section className="section" id="leaderboard">
      <div className="container">
        <SectionHeader
          eyebrow="Leaderboard"
          title="Leaderboard"
          description="Compare your best reaction time instantly and see where your current score lands."
        />

        <div className="leaderboard-grid">
          <GlassPanel className="leaderboard-panel">
            <div className="leaderboard-toolbar">
              <div className="toolbar-pills">
                <span className="toolbar-pill toolbar-pill-active">Global</span>
                <span className="toolbar-pill">Live</span>
              </div>
              <span className="leaderboard-note">{leaderboardStatus}</span>
            </div>

            <div className="leaderboard-table" role="table" aria-label="Reaction leaderboard">
              <div className="leaderboard-row leaderboard-row-header" role="row">
                <span role="columnheader">Rank</span>
                <span role="columnheader">Player</span>
                <span role="columnheader">Region</span>
                <span role="columnheader">Best</span>
                <span role="columnheader">Form</span>
              </div>

              {leaderboardRows.map((entry) => (
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
              ))}
            </div>
          </GlassPanel>

          <div className="leaderboard-side">
            <GlassPanel className="leaderboard-side-panel">
              <span className="subtle-pill">
                {provisionalRank ? `Current rank ${provisionalRank}` : "Ranking"}
              </span>
              <h3>
                {provisionalRank
                  ? `Your current best sits at ${provisionalRank}.`
                  : "Run a valid test to enter the board."}
              </h3>
              <p>
                {provisionalRank
                  ? "The board updates from your real test result, highlights your row, and keeps the comparison easy to scan."
                  : "Start with the test above, then use Show leaderboard to place your result directly into the ranking flow."}
              </p>
            </GlassPanel>

            <AdSlot
              label="Sponsored"
              title="Leaderboard sponsor slot"
              description="A premium-safe ad placement outside the core ranking table."
              slotId={adsensePrimarySlot}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
