import { AdSlot } from "../AdSlot";
import { GlassPanel } from "../GlassPanel";
import { ProgressChart } from "../ProgressChart";
import { SectionHeader } from "../SectionHeader";
import { adsenseSecondarySlot } from "../../lib/ads";
import { useLocale } from "../../state/LocaleContext";
import { useReactionProduct } from "../../state/ReactionProductContext";

export function WorkspaceSection() {
  const { locale } = useLocale();
  const {
    activeDays,
    earlyTapCount,
    hasRecordedRounds,
    progressTrend,
    sessionFeed,
    stabilityBandMs,
    workspaceStats,
  } = useReactionProduct();
  const isGerman = locale === "de";

  return (
    <section className="section workspace-section" id="stats">
      <div className="container">
        <SectionHeader
          eyebrow={isGerman ? "Statistiken" : "Statistics"}
          title={
            isGerman
              ? "Alles Wichtige, direkt nach dem Run."
              : "Everything important, immediately after the run."
          }
          description={
            isGerman
              ? "Bestzeit, Durchschnitt, letzte Runden und ein klarer Fortschrittsverlauf. Kein zusaetzliches Dashboard, nur die Statistiken, die wirklich zaehlen."
              : "Best time, average pace, recent rounds, and a simple progress view. No extra dashboard layer, just the stats that matter."
          }
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
                <span className="subtle-pill">{isGerman ? "Fortschritt" : "Progress"}</span>
                <h3>{isGerman ? "Verbesserung auf einen Blick." : "Track improvement at a glance."}</h3>
                <p>
                  {hasRecordedRounds
                    ? isGerman
                      ? "Deine letzten Sessions werden sofort zu einer klaren Leistungskurve, damit du direkt siehst, ob du schneller oder stabiler wirst."
                      : "Your recent sessions turn into a simple performance curve right away, so it is easy to see if you are getting faster or more stable."
                    : isGerman
                      ? "Sobald du deine ersten gueltigen Runden speicherst, entsteht hier dein lokaler Fortschrittsverlauf."
                      : "As soon as you record your first valid rounds, your local progress curve starts building here."}
                </p>
              </div>

              <ProgressChart points={progressTrend} />

              <div className="trend-summary">
                <div>
                  <span>{isGerman ? "Stabilitaetsband" : "Stability band"}</span>
                  <strong>
                    {stabilityBandMs === null
                      ? isGerman
                        ? "Kalibrierung"
                        : "Calibrating"
                      : `±${stabilityBandMs} ms`}
                  </strong>
                </div>
                <div>
                  <span>{isGerman ? "Fruehe Taps" : "Early taps"}</span>
                  <strong>{earlyTapCount}</strong>
                </div>
                <div>
                  <span>{isGerman ? "Aktive Tage" : "Active days"}</span>
                  <strong>{activeDays || 0}</strong>
                </div>
              </div>
            </GlassPanel>
          </div>

          <div className="workspace-rail">
            <GlassPanel className="session-feed-panel">
              <div className="session-feed-top">
                <span className="subtle-pill">{isGerman ? "Letzte Runden" : "Recent rounds"}</span>
                <strong>{isGerman ? "Neueste Versuche" : "Latest attempts"}</strong>
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
                    <strong>{isGerman ? "Noch keine gespeicherten Runden." : "No recorded rounds yet."}</strong>
                    <p>
                      {isGerman
                        ? "Schliesse den Test oben einmal ab, dann erscheinen hier sofort deine letzten Versuche."
                        : "Finish the test above once and your recent attempts start appearing here."}
                    </p>
                  </div>
                )}
              </div>
            </GlassPanel>

            <AdSlot
              label={isGerman ? "Werbung" : "Sponsor"}
              title={isGerman ? "Sauberer Sponsor-Slot" : "Clean support slot"}
              description={
                isGerman
                  ? "Eine getrennte Werbeflaeche, die Test und Statistikbereich fokussiert haelt."
                  : "A separated ad surface that keeps the test and the stats area focused."
              }
              slotId={adsenseSecondarySlot}
              variant="compact"
              layout="frame-only"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
