import { useEffect, useRef, useState } from "react";
import { AdSlot } from "./AdSlot";
import { Button } from "./Button";
import { GlassPanel } from "./GlassPanel";
import { adsensePrimarySlot } from "../lib/ads";
import { useLocale } from "../state/LocaleContext";
import { useReactionProduct } from "../state/ReactionProductContext";

type DemoPhase = "idle" | "armed" | "ready" | "result" | "tooSoon";

const getPhaseCopy = (
  isGerman: boolean,
): Record<DemoPhase, { badge: string; body: string }> => ({
  idle: {
    badge: isGerman ? "Bereit" : "Standby",
    body: isGerman
      ? "Aktiviere das Signal und warte auf den Farbwechsel."
      : "Arm the signal and wait for the surface to change.",
  },
  armed: {
    badge: isGerman ? "Aktivierung" : "Arming",
    body: isGerman
      ? "Das Signal erscheint nach einer zufaelligen Verzoegerung."
      : "The signal will appear after a randomized delay.",
  },
  ready: {
    badge: isGerman ? "Live" : "Live",
    body: isGerman
      ? "Reagiere genau in dem Moment, in dem sich die Flaeche aendert."
      : "Respond the instant the panel shifts.",
  },
  result: {
    badge: isGerman ? "Erfasst" : "Captured",
    body: isGerman
      ? "Starte die naechste Runde und schaerfe deine Session."
      : "Run another round to sharpen the session.",
  },
  tooSoon: {
    badge: isGerman ? "Zu frueh" : "Early tap",
    body: isGerman
      ? "Fokussiere dich neu und warte auf das visuelle Signal."
      : "Reset your focus and wait for the visual signal.",
  },
});

const clearTimer = (timerRef: { current: number | null }) => {
  if (timerRef.current !== null) {
    window.clearTimeout(timerRef.current);
    timerRef.current = null;
  }
};

export function ReactionDemo() {
  const { locale } = useLocale();
  const {
    currentSessionRounds,
    currentSessionBestMs,
    currentSessionAverageMs,
    bestReactionMs,
    averageReactionMs,
    provisionalRank,
    guestProfile,
    publishMessage,
    publishStatus,
    showLeaderboard,
    recordReaction,
    recordEarlyTap,
    updateGuestProfile,
  } = useReactionProduct();
  const isGerman = locale === "de";
  const [phase, setPhase] = useState<DemoPhase>("idle");
  const [startTime, setStartTime] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (phase !== "armed") {
      return undefined;
    }

    timerRef.current = window.setTimeout(() => {
      setStartTime(performance.now());
      setPhase("ready");
    }, 1500 + Math.random() * 1800);

    return () => {
      clearTimer(timerRef);
    };
  }, [phase]);

  useEffect(() => {
    return () => clearTimer(timerRef);
  }, []);

  const latest =
    currentSessionRounds[currentSessionRounds.length - 1] ??
    bestReactionMs ??
    null;
  const best = currentSessionBestMs ?? bestReactionMs;
  const average = currentSessionAverageMs ?? averageReactionMs;
  const score = average === null ? null : Math.max(0, 420 - average);
  const rank = provisionalRank;
  const recentSessionRounds = currentSessionRounds.slice(-20).reverse();

  const startRound = () => {
    clearTimer(timerRef);
    setStartTime(null);
    setPhase("armed");
  };

  const handleSurfaceClick = () => {
    if (phase === "idle" || phase === "result" || phase === "tooSoon") {
      startRound();
      return;
    }

    if (phase === "armed") {
      clearTimer(timerRef);
      setStartTime(null);
      recordEarlyTap();
      setPhase("tooSoon");
      return;
    }

    if (phase === "ready" && startTime !== null) {
      const reaction = Math.round(performance.now() - startTime);
      recordReaction(reaction);
      setStartTime(null);
      setPhase("result");
    }
  };

  const handleShowLeaderboard = async () => {
    await showLeaderboard();
    document.getElementById("leaderboard")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const copy = getPhaseCopy(isGerman)[phase];
  const resultHint =
    publishStatus === "success"
      ? isGerman
        ? "Score live. Oeffne das Leaderboard, um dein Ranking zu sehen."
        : "Score is live. Open the leaderboard to see your rank."
      : publishStatus === "submitting"
        ? isGerman
          ? "Score wird ins Leaderboard uebertragen..."
          : "Score is being published to the leaderboard..."
        : publishStatus === "error"
          ? isGerman
            ? "Score gemessen. Nutze Leaderboard anzeigen, um den Eintrag erneut zu versuchen."
            : "Score captured. Use Show leaderboard to try the entry again."
          : isGerman
            ? "Klicke auf Leaderboard anzeigen, um deinen Score einzutragen und dein Ranking zu sehen."
            : "Click Show leaderboard to publish your score and see your rank.";

  return (
    <div className="reaction-demo" id="demo">
      <div className="reaction-demo-top">
        <div>
          <span className="subtle-pill">{isGerman ? "Live-Test" : "Live test"}</span>
          <h3>{isGerman ? "Reaktionstest" : "Reaction test"}</h3>
        </div>
        <span className={`demo-badge demo-badge-${phase}`}>{copy.badge}</span>
      </div>

      <div className="reaction-demo-stage">
        <button
          type="button"
          className={`reaction-surface reaction-surface-${phase}`}
          onClick={handleSurfaceClick}
          aria-label={isGerman ? "Interaktive Flaeche fuer den Reaktionstest" : "Interactive reaction test surface"}
        >
          <span className="reaction-surface-caption">{copy.badge}</span>
          <strong>
            {phase === "result"
              ? `${latest} ms`
              : phase === "ready"
                ? isGerman
                  ? "Jetzt"
                  : "Tap"
                : isGerman
                  ? "Warten"
                  : "Wait"}
          </strong>
          <p>{copy.body}</p>
          {recentSessionRounds.length ? (
            <div
              className="reaction-surface-session-cloud"
              aria-label={
                isGerman
                  ? "Letzte 20 Session-Runden"
                  : "Latest 20 session rounds"
              }
            >
              <span className="reaction-surface-session-label">
                {isGerman ? "Aktuelle Session" : "Current session"}
              </span>
              <div className="reaction-surface-session-list">
                {recentSessionRounds.map((attempt, index) => (
                  <span key={`${attempt}-${index}`}>{attempt} ms</span>
                ))}
              </div>
            </div>
          ) : null}
          {phase === "result" ? (
            <span className="reaction-surface-result-hint">{resultHint}</span>
          ) : null}
        </button>

        <div className="reaction-demo-side">
          <div className="reaction-entry-bar">
            <label className="field reaction-entry-field">
              <span>{isGerman ? "Nickname" : "Nickname"}</span>
              <input
                type="text"
                placeholder="Player 4821"
                value={guestProfile.displayName}
                onChange={(event) =>
                  updateGuestProfile({ displayName: event.target.value })
                }
              />
            </label>
            <Button variant="secondary" onClick={handleShowLeaderboard}>
              {isGerman ? "Leaderboard anzeigen" : "Show leaderboard"}
            </Button>
          </div>

          {publishMessage ? (
            <div className={`reaction-entry-feedback reaction-entry-feedback-${publishStatus}`}>
              <p>{publishMessage}</p>
            </div>
          ) : null}

          <div className="reaction-metric-grid">
            <GlassPanel className="metric-card">
              <span>{isGerman ? "Bestzeit" : "Best"}</span>
              <strong>{best === null ? "--" : `${best} ms`}</strong>
            </GlassPanel>
            <GlassPanel className="metric-card">
              <span>{isGerman ? "Durchschnitt" : "Average"}</span>
              <strong>{average === null ? "--" : `${average} ms`}</strong>
            </GlassPanel>
            <GlassPanel className="metric-card">
              <span>Score</span>
              <strong>{score === null ? "--" : score}</strong>
            </GlassPanel>
            <GlassPanel className="metric-card">
              <span>Rank</span>
              <strong>{rank ?? "--"}</strong>
            </GlassPanel>
          </div>

          <AdSlot
            label={isGerman ? "Werbung" : "Sponsored"}
            title={isGerman ? "Testmodul Placement" : "Test module placement"}
            description={
              isGerman
                ? "Werbeflaeche in der rechten Test-Rail, klar getrennt vom eigentlichen Reaktionsfeld."
                : "Ad surface in the right-side test rail, clearly separated from the actual reaction field."
            }
            slotId={adsensePrimarySlot}
            layout="frame-only"
          />
        </div>
      </div>
    </div>
  );
}
