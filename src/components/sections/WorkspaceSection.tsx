import { AdSlot } from "../AdSlot";
import { GlassPanel } from "../GlassPanel";
import { ProgressChart } from "../ProgressChart";
import { SectionHeader } from "../SectionHeader";
import { adsenseSecondarySlot } from "../../lib/ads";
import { useReactionProduct } from "../../state/ReactionProductContext";

export function WorkspaceSection() {
  const {
    activeDays,
    earlyTapCount,
    hasRecordedRounds,
    progressTrend,
    sessionFeed,
    stabilityBandMs,
    workspaceStats,
  } = useReactionProduct();

  return (
    <section className="section workspace-section" id="stats">
      <div className="container">
        <SectionHeader
          eyebrow="Statistics"
          title="Everything important, immediately after the run."
          description="Best time, average pace, recent rounds, and a simple progress view. No extra dashboard layer, just the stats that matter."
        />

        <div className="workspace-grid">
          <div className="workspace-main">
            <div className="stats-metrics">
              {workspaceStats.map((stat) => (
                <GlassPanel className="stats-card" key={stat.label}>
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                  <p>{stat.meta}</p>
                </GlassPanel>
              ))}
            </div>

            <GlassPanel className="trend-panel">
              <div className="trend-panel-copy">
                <span className="subtle-pill">Progress</span>
                <h3>Track improvement at a glance.</h3>
                <p>
                  {hasRecordedRounds
                    ? "Your recent sessions turn into a simple performance curve right away, so it is easy to see if you are getting faster or more stable."
                    : "As soon as you record your first valid rounds, your local progress curve starts building here."}
                </p>
              </div>

              <ProgressChart points={progressTrend} />

              <div className="trend-summary">
                <div>
                  <span>Stability band</span>
                  <strong>
                    {stabilityBandMs === null ? "Calibrating" : `±${stabilityBandMs} ms`}
                  </strong>
                </div>
                <div>
                  <span>Early taps</span>
                  <strong>{earlyTapCount}</strong>
                </div>
                <div>
                  <span>Active days</span>
                  <strong>{activeDays || 0}</strong>
                </div>
              </div>
            </GlassPanel>
          </div>

          <div className="workspace-rail">
            <GlassPanel className="session-feed-panel">
              <div className="session-feed-top">
                <span className="subtle-pill">Recent rounds</span>
                <strong>Latest attempts</strong>
              </div>

              <div className="session-feed-list">
                {sessionFeed.length ? (
                  sessionFeed.map((entry) => (
                    <div className="session-feed-row" key={`${entry.time}-${entry.value}`}>
                      <div className="session-feed-meta">
                        <strong>{entry.label}</strong>
                        <p>{entry.detail}</p>
                      </div>
                      <div className="session-feed-value">
                        <span>{entry.time}</span>
                        <strong>{entry.value}</strong>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="session-feed-empty">
                    <strong>No recorded rounds yet.</strong>
                    <p>Finish the test above once and your recent attempts start appearing here.</p>
                  </div>
                )}
              </div>
            </GlassPanel>

            <AdSlot
              label="Sponsor"
              title="Clean support slot"
              description="A separated ad surface that keeps the test and the stats area focused."
              slotId={adsenseSecondarySlot}
              variant="compact"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
