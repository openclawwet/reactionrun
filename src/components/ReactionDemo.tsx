import { useEffect, useRef, useState } from "react";
import { Button } from "./Button";
import { GlassPanel } from "./GlassPanel";
import { useReactionProduct } from "../state/ReactionProductContext";

type DemoPhase = "idle" | "armed" | "ready" | "result" | "tooSoon";

const phaseCopy: Record<
  DemoPhase,
  { badge: string; title: string; body: string; action: string }
> = {
  idle: {
    badge: "Standby",
    title: "Start when you're ready.",
    body: "Arm the signal and wait for the surface to change.",
    action: "Arm signal",
  },
  armed: {
    badge: "Arming",
    title: "Hold steady.",
    body: "The signal will appear after a randomized delay.",
    action: "Wait for signal",
  },
  ready: {
    badge: "Live",
    title: "Tap now.",
    body: "Respond the instant the panel shifts.",
    action: "Record reaction",
  },
  result: {
    badge: "Captured",
    title: "Reaction logged.",
    body: "Run another round to sharpen the session.",
    action: "Run again",
  },
  tooSoon: {
    badge: "Early tap",
    title: "Too early.",
    body: "Reset your focus and wait for the visual signal.",
    action: "Try again",
  },
};

const clearTimer = (timerRef: { current: number | null }) => {
  if (timerRef.current !== null) {
    window.clearTimeout(timerRef.current);
    timerRef.current = null;
  }
};

export function ReactionDemo() {
  const {
    currentSessionRounds,
    currentSessionBestMs,
    currentSessionAverageMs,
    bestReactionMs,
    averageReactionMs,
    consistencyScore,
    provisionalRank,
    hasRecordedRounds,
    guestProfile,
    publishMessage,
    publishStatus,
    showLeaderboard,
    startNewSession,
    recordReaction,
    recordEarlyTap,
    updateGuestProfile,
  } = useReactionProduct();
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
  const consistency = consistencyScore;
  const score = average === null ? null : Math.max(0, 420 - average);
  const rank = provisionalRank;

  const startRound = () => {
    clearTimer(timerRef);
    setStartTime(null);
    setPhase("armed");
  };

  const resetSession = () => {
    clearTimer(timerRef);
    setStartTime(null);
    startNewSession();
    setPhase("idle");
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

  const copy = phaseCopy[phase];

  return (
    <GlassPanel className="reaction-demo" id="demo">
      <div className="reaction-demo-top">
        <div>
          <span className="subtle-pill">Live test</span>
          <h3>Reaction test</h3>
        </div>
        <span className={`demo-badge demo-badge-${phase}`}>{copy.badge}</span>
      </div>

      <div className="reaction-demo-stage">
        <button
          type="button"
          className={`reaction-surface reaction-surface-${phase}`}
          onClick={handleSurfaceClick}
          aria-label="Interactive reaction test surface"
        >
          <span className="reaction-surface-caption">{copy.badge}</span>
          <strong>
            {phase === "result" ? `${latest} ms` : phase === "ready" ? "Tap" : "Wait"}
          </strong>
          <p>{copy.body}</p>
        </button>

        <div className="reaction-demo-side">
          <div className="reaction-demo-actions">
            <Button onClick={startRound}>{copy.action}</Button>
            <Button href="#stats" variant="secondary">
              View stats
            </Button>
            <Button variant="ghost" onClick={resetSession}>
              Start new session
            </Button>
          </div>

          <div className="reaction-entry-bar">
            <label className="field reaction-entry-field">
              <span>Nickname</span>
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
              Show leaderboard
            </Button>
          </div>

          {publishMessage ? (
            <div className={`reaction-entry-feedback reaction-entry-feedback-${publishStatus}`}>
              <p>{publishMessage}</p>
            </div>
          ) : null}

          <div className="reaction-metric-grid">
            <GlassPanel className="metric-card">
              <span>Best</span>
              <strong>{best === null ? "--" : `${best} ms`}</strong>
            </GlassPanel>
            <GlassPanel className="metric-card">
              <span>Average</span>
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
                <span>Current session</span>
                <strong>{currentSessionRounds.length} rounds</strong>
              </div>
              <div className="session-history" aria-label="Recent reaction attempts">
                {currentSessionRounds.length ? (
                  currentSessionRounds.map((attempt, index) => (
                    <span key={`${attempt}-${index}`}>{attempt} ms</span>
                  ))
                ) : (
                  <span>New session ready</span>
                )}
              </div>
            </div>
          </GlassPanel>

          <GlassPanel className="consistency-panel">
            <div className="consistency-grid">
              <div>
                <span>Consistency</span>
                <strong>{consistency === null ? "--" : `${consistency}%`}</strong>
              </div>
              <div>
                <span>Save state</span>
                <strong>{hasRecordedRounds ? "Local live" : "Ready"}</strong>
              </div>
            </div>
            <p>
              {copy.title} Run another round to improve your average, then send your
              best result straight into the leaderboard.
            </p>
          </GlassPanel>
        </div>
      </div>
    </GlassPanel>
  );
}
