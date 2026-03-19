import { AdSlot } from "./AdSlot";
import { useEffect, useRef, useState } from "react";
import { Button } from "./Button";
import { GlassPanel } from "./GlassPanel";
import { adsenseTestSlot } from "../lib/ads";
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

          <GlassPanel className="reaction-session-panel">
            <div className="session-strip">
              <div className="session-strip-copy">
                <span>{isGerman ? "Aktuelle Session" : "Current session"}</span>
                <strong>
                  {currentSessionRounds.length} {isGerman ? "Runden" : "rounds"}
                </strong>
              </div>
              <div
                className="session-history"
                aria-label={isGerman ? "Letzte Reaktionsversuche" : "Recent reaction attempts"}
              >
                {currentSessionRounds.length ? (
                  currentSessionRounds.map((attempt, index) => (
                    <span key={`${attempt}-${index}`}>{attempt} ms</span>
                  ))
                ) : (
                  <span>{isGerman ? "Neue Session bereit" : "New session ready"}</span>
                )}
              </div>
            </div>
          </GlassPanel>

          <AdSlot
            label={isGerman ? "Werbung" : "Sponsored"}
            title={isGerman ? "Premium Sponsor-Slot im Testmodul" : "Premium sponsor slot in the test module"}
            description={
              isGerman
                ? "Diese Flaeche ist fuer ausgewaehlte Performance-Partner im ersten Screen reserviert und bleibt klar vom Test getrennt. Passend fuer Hardware, Tools und Produkte, die zum Fokus der Seite passen."
                : "This surface is reserved for selected performance partners in the first screen and stays clearly separated from the test itself. Ideal for hardware, tools, and products that fit the focus of the platform."
            }
            slotId={adsenseTestSlot}
            variant="compact"
            layout="frame-only"
          />
        </div>
      </div>
    </div>
  );
}
