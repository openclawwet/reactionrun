import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { leaderboardEntries } from "../data/siteContent";
import {
  backendMode,
  fetchRemoteLeaderboard,
  normalizeTag,
  publishGuestScore,
  type BackendMode,
  type RemoteLeaderboardEntry,
} from "../services/reactionBackend";
import { useLocale } from "./LocaleContext";

type ReactionRound = {
  id: string;
  value: number;
  createdAt: string;
  sessionId: string;
};

type EarlyTapEntry = {
  id: string;
  createdAt: string;
  sessionId: string;
};

type GuestProfile = {
  displayName: string;
  tag: string;
  region: string;
  email: string;
};

type PersistedReactionState = {
  activeSessionId: string;
  rounds: ReactionRound[];
  earlyTaps: EarlyTapEntry[];
  guestProfile: GuestProfile;
};

type TrendPoint = {
  label: string;
  value: number;
};

type SessionFeedItem = {
  label: string;
  detail: string;
  time: string;
  value: string;
};

type StatCard = {
  label: string;
  value: string;
  meta: string;
};

type LeaderboardRow = {
  rank: string;
  name: string;
  tag: string;
  region: string;
  best: string;
  delta: string;
  isCurrentUser?: boolean;
};

type BaseLeaderboardRow = Omit<LeaderboardRow, "rank" | "isCurrentUser">;

type SubmissionStatus = "idle" | "submitting" | "success" | "error";

type ReactionProductContextValue = {
  backendMode: BackendMode;
  guestProfile: GuestProfile;
  currentSessionId: string;
  currentSessionRounds: number[];
  recordedRounds: number[];
  hasRecordedRounds: boolean;
  recordedRoundCount: number;
  bestReactionMs: number | null;
  averageReactionMs: number | null;
  currentSessionBestMs: number | null;
  currentSessionAverageMs: number | null;
  totalSessions: number;
  activeDays: number;
  earlyTapCount: number;
  improvementMs: number | null;
  consistencyScore: number | null;
  stabilityBandMs: number | null;
  provisionalRank: string | null;
  workspaceStats: StatCard[];
  progressTrend: TrendPoint[];
  sessionFeed: SessionFeedItem[];
  leaderboardRows: LeaderboardRow[];
  leaderboardStatus: string;
  publishStatus: SubmissionStatus;
  publishMessage: string;
  canSubmitScore: boolean;
  updateGuestProfile: (patch: Partial<GuestProfile>) => void;
  refreshLeaderboard: () => Promise<void>;
  showLeaderboard: () => Promise<void>;
  startNewSession: () => void;
  recordReaction: (value: number) => void;
  recordEarlyTap: () => void;
};

const STORAGE_KEY = "reaction-run-product-state-v2";
const PLAYER_COUNTER_KEY = "reaction-run-player-sequence-v1";

const ReactionProductContext = createContext<ReactionProductContextValue | null>(null);

const createId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;

const createSessionId = () => createId("session");

const getNextPlayerNumber = () => {
  const fallbackStart = 1000 + Math.floor(Math.random() * 8000);

  if (typeof window === "undefined") {
    return fallbackStart;
  }

  const stored = window.localStorage.getItem(PLAYER_COUNTER_KEY);
  const parsed = stored ? Number.parseInt(stored, 10) : Number.NaN;
  const next = Number.isFinite(parsed) && parsed > 0 ? parsed : fallbackStart;

  window.localStorage.setItem(PLAYER_COUNTER_KEY, String(next + 1));

  return next;
};

const deriveTagFromName = (value: string) => {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");

  return slug ? `@${slug}` : "";
};

const createPlayerIdentity = () => {
  const playerNumber = getNextPlayerNumber();
  const displayName = `Player ${playerNumber}`;

  return {
    displayName,
    tag: deriveTagFromName(displayName),
  };
};

const createDefaultGuestProfile = (): GuestProfile => {
  const identity = createPlayerIdentity();

  return {
    displayName: identity.displayName,
    tag: identity.tag,
    region: "WEB",
    email: "",
  };
};

const createInitialState = (): PersistedReactionState => {
  const sessionId = createSessionId();

  return {
    activeSessionId: sessionId,
    rounds: [],
    earlyTaps: [],
    guestProfile: createDefaultGuestProfile(),
  };
};

const parseStoredState = (rawValue: string | null): PersistedReactionState | null => {
  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<PersistedReactionState>;

    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    const activeSessionId =
      typeof parsed.activeSessionId === "string" ? parsed.activeSessionId : createSessionId();
    const fallbackGuestProfile = createDefaultGuestProfile();

    return {
      activeSessionId,
      rounds: Array.isArray(parsed.rounds)
        ? parsed.rounds.filter(
            (entry): entry is ReactionRound =>
              !!entry &&
              typeof entry.id === "string" &&
              typeof entry.value === "number" &&
              typeof entry.createdAt === "string" &&
              typeof entry.sessionId === "string",
          )
        : [],
      earlyTaps: Array.isArray(parsed.earlyTaps)
        ? parsed.earlyTaps.filter(
            (entry): entry is EarlyTapEntry =>
              !!entry &&
              typeof entry.id === "string" &&
              typeof entry.createdAt === "string" &&
              typeof entry.sessionId === "string",
          )
        : [],
      guestProfile:
        parsed.guestProfile &&
        typeof parsed.guestProfile === "object" &&
        typeof parsed.guestProfile.displayName === "string" &&
        typeof parsed.guestProfile.tag === "string" &&
        typeof parsed.guestProfile.region === "string" &&
        typeof parsed.guestProfile.email === "string"
          ? parsed.guestProfile
          : fallbackGuestProfile,
    };
  } catch {
    return null;
  }
};

const average = (values: number[]) =>
  values.length
    ? Math.round(values.reduce((total, value) => total + value, 0) / values.length)
    : null;

const formatMilliseconds = (value: number | null, fallback = "--") =>
  value === null ? fallback : `${value} ms`;

const formatImprovement = (value: number | null, isGerman: boolean) => {
  if (value === null) {
    return isGerman ? "Kalibrierung" : "Calibrating";
  }

  if (value === 0) {
    return "0 ms";
  }

  const prefix = value > 0 ? "-" : "+";
  return `${prefix}${Math.abs(value)} ms`;
};

const parseBestTime = (value: string) => Number.parseInt(value.replace(/[^\d]/g, ""), 10);

const buildFallbackLeaderboardRows = (): BaseLeaderboardRow[] =>
  leaderboardEntries.map((entry) => ({
    name: entry.name,
    tag: entry.tag,
    region: entry.region,
    best: entry.best,
    delta: entry.delta,
  }));

const buildRemoteLeaderboardRows = (
  entries: RemoteLeaderboardEntry[],
  isGerman: boolean,
): BaseLeaderboardRow[] =>
  entries.map((entry) => ({
    name: entry.displayName,
    tag: entry.tag,
    region: entry.region,
    best: `${entry.bestReactionMs} ms`,
    delta: entry.claimRequested
      ? "Claim"
      : entry.isGuest
        ? isGerman
          ? "Gast"
          : "Guest"
        : "Live",
  }));

export function ReactionProductProvider({ children }: { children: ReactNode }) {
  const { locale } = useLocale();
  const isGerman = locale === "de";
  const timeLocale = isGerman ? "de-DE" : "en-US";
  const [state, setState] = useState<PersistedReactionState>(() => {
    if (typeof window === "undefined") {
      return createInitialState();
    }

    return parseStoredState(window.localStorage.getItem(STORAGE_KEY)) ?? createInitialState();
  });
  const [remoteLeaderboard, setRemoteLeaderboard] = useState<RemoteLeaderboardEntry[]>([]);
  const [leaderboardSyncStatus, setLeaderboardSyncStatus] = useState<SubmissionStatus>(
    backendMode === "live" ? "submitting" : "idle",
  );
  const [leaderboardSyncMessage, setLeaderboardSyncMessage] = useState("");
  const [leaderboardLastSyncedAt, setLeaderboardLastSyncedAt] = useState<string | null>(null);
  const [publishStatus, setPublishStatus] = useState<SubmissionStatus>("idle");
  const [publishMessage, setPublishMessage] = useState("");

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const formatTime = (isoString: string) =>
    new Intl.DateTimeFormat(timeLocale, {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(isoString));

  const formatSyncTime = (isoString: string) =>
    new Intl.DateTimeFormat(timeLocale, {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(isoString));

  const refreshLeaderboard = async () => {
    if (backendMode !== "live") {
      setLeaderboardSyncStatus("idle");
      setLeaderboardSyncMessage(
        isGerman
          ? "Vorschau aktiv. Hinterlege Supabase-Keys, um Live-Rankings zu aktivieren."
          : "Preview mode active. Add Supabase keys to enable live rankings.",
      );
      return;
    }

    setLeaderboardSyncStatus("submitting");

    try {
      const entries = await fetchRemoteLeaderboard();
      setRemoteLeaderboard(entries);
      setLeaderboardSyncStatus("success");
      setLeaderboardSyncMessage(
        entries.length
          ? isGerman
            ? "Live-Leaderboard synchronisiert."
            : "Live leaderboard synced."
          : isGerman
            ? "Live-Leaderboard verbunden und bereit fuer den ersten veroeffentlichten Score."
            : "Live leaderboard connected and ready for its first published score.",
      );
      setLeaderboardLastSyncedAt(new Date().toISOString());
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : isGerman
            ? "Das Live-Leaderboard konnte nicht geladen werden."
            : "Could not load the live leaderboard.";
      setLeaderboardSyncStatus("error");
      setLeaderboardSyncMessage(message);
    }
  };

  useEffect(() => {
    if (backendMode === "live") {
      void refreshLeaderboard();
      return;
    }

    setLeaderboardSyncMessage(
      isGerman
        ? "Vorschau aktiv. Hinterlege Supabase-Keys, um Live-Rankings zu aktivieren."
        : "Preview mode active. Add Supabase keys to enable live rankings.",
    );
  }, [isGerman]);

  const currentSessionRounds = state.rounds
    .filter((entry) => entry.sessionId === state.activeSessionId)
    .map((entry) => entry.value);
  const recordedRounds = state.rounds.map((entry) => entry.value);
  const hasRecordedRounds = recordedRounds.length > 0;
  const recordedRoundCount = recordedRounds.length;
  const bestReactionMs = hasRecordedRounds ? Math.min(...recordedRounds) : null;
  const averageReactionMs = average(recordedRounds);
  const currentSessionBestMs = currentSessionRounds.length
    ? Math.min(...currentSessionRounds)
    : null;
  const currentSessionAverageMs = average(currentSessionRounds);

  const sessionIds = new Set(
    [...state.rounds, ...state.earlyTaps].map((entry) => entry.sessionId),
  );
  const totalSessions = sessionIds.size;

  const activeDays = new Set(
    [...state.rounds, ...state.earlyTaps].map((entry) => entry.createdAt.slice(0, 10)),
  ).size;

  const earlyTapCount = state.earlyTaps.length;
  const currentSessionMetrics =
    currentSessionRounds.length >= 2 ? currentSessionRounds : recordedRounds.slice(-6);
  const consistencyAverage = average(currentSessionMetrics);
  const stabilityBandMs =
    consistencyAverage === null || currentSessionMetrics.length < 2
      ? null
      : Math.max(
          3,
          Math.round(
            currentSessionMetrics.reduce(
              (total, value) => total + Math.abs(value - consistencyAverage),
              0,
            ) / currentSessionMetrics.length,
          ),
        );
  const consistencyScore =
    stabilityBandMs === null ? null : Math.max(74, Math.min(99, 100 - stabilityBandMs));

  const improvementWindow = Math.min(5, Math.floor(recordedRounds.length / 2));
  const firstWindowAverage =
    improvementWindow >= 2 ? average(recordedRounds.slice(0, improvementWindow)) : null;
  const latestWindowAverage =
    improvementWindow >= 2 ? average(recordedRounds.slice(-improvementWindow)) : null;
  const improvementMs =
    firstWindowAverage === null || latestWindowAverage === null
      ? null
      : firstWindowAverage - latestWindowAverage;

  const roundsBySession = Array.from(
    state.rounds.reduce<Map<string, number[]>>((map, entry) => {
      const existing = map.get(entry.sessionId) ?? [];
      existing.push(entry.value);
      map.set(entry.sessionId, existing);
      return map;
    }, new Map()),
  );

  const progressTrend: TrendPoint[] =
    roundsBySession.length >= 2
      ? roundsBySession.slice(-7).map(([_, values], index) => ({
          label: `S${index + 1}`,
          value: average(values) ?? values[values.length - 1] ?? 0,
        }))
      : state.rounds.slice(-7).map((entry, index) => ({
          label: `R${index + 1}`,
          value: entry.value,
        }));

  const sessionFeed = [...state.rounds]
    .slice(-4)
    .reverse()
    .map((entry, index): SessionFeedItem => {
      const isActiveSession = entry.sessionId === state.activeSessionId;
      return {
        label: index === 0
          ? isGerman
            ? "Letzte Runde"
            : "Latest round"
          : isGerman
            ? "Gespeicherte Runde"
            : "Recorded round",
        detail: isActiveSession
          ? isGerman
            ? "In der aktuellen lokalen Session erfasst"
            : "Captured in the current local session"
          : isGerman
            ? "Aus einer letzten lokalen Session wiederhergestellt"
            : "Restored from a recent local session",
        time: formatTime(entry.createdAt),
        value: `${entry.value} ms`,
      };
    });

  const normalizedGuestTag = normalizeTag(state.guestProfile.tag || deriveTagFromName(state.guestProfile.displayName));
  const guestDisplayName = state.guestProfile.displayName.trim();
  const guestRegion = state.guestProfile.region.trim().toUpperCase() || "WEB";

  const canSubmitScore = Boolean(bestReactionMs !== null && averageReactionMs !== null);

  const remoteBaseRows = buildRemoteLeaderboardRows(remoteLeaderboard, isGerman);
  const fallbackBaseRows = buildFallbackLeaderboardRows();
  const usesRemoteLeaderboard = remoteBaseRows.length > 0;
  const baseLeaderboardRows = usesRemoteLeaderboard ? remoteBaseRows : fallbackBaseRows;
  const localRowName = guestDisplayName || (isGerman ? "Du" : "You");

  let provisionalRank: string | null = null;
  const composableLeaderboard = [...baseLeaderboardRows];

  if (bestReactionMs !== null) {
    const localPreviewRow: BaseLeaderboardRow = {
      name: localRowName,
      tag: normalizedGuestTag || "@guest",
      region: guestRegion,
      best: `${bestReactionMs} ms`,
      delta:
        publishStatus === "success"
          ? "Live"
          : backendMode === "live"
            ? isGerman
              ? "Lokal"
              : "Local"
            : isGerman
              ? "Vorschau"
              : "Preview",
    };
    const existingIndex = composableLeaderboard.findIndex(
      (entry) => normalizeTag(entry.tag) === localPreviewRow.tag,
    );

    if (existingIndex >= 0) {
      const existingBest = parseBestTime(composableLeaderboard[existingIndex].best);

      if (!Number.isNaN(existingBest) && bestReactionMs < existingBest) {
        composableLeaderboard[existingIndex] = localPreviewRow;
      }
    } else {
      const insertIndex = composableLeaderboard.findIndex(
        (entry) => bestReactionMs < parseBestTime(entry.best),
      );
      const resolvedIndex = insertIndex === -1 ? composableLeaderboard.length : insertIndex;
      composableLeaderboard.splice(resolvedIndex, 0, localPreviewRow);
    }
  }

  const leaderboardRows = composableLeaderboard.slice(0, 8).map((entry, index) => {
    const isCurrentUser = normalizedGuestTag ? normalizeTag(entry.tag) === normalizedGuestTag : false;

    if (isCurrentUser) {
      provisionalRank = `#${String(index + 1).padStart(2, "0")}`;
    }

    return {
      rank: String(index + 1).padStart(2, "0"),
      ...entry,
      isCurrentUser,
    };
  });

  const workspaceStats: StatCard[] = [
    {
      label: isGerman ? "Beste Reaktion" : "Best reaction",
      value: formatMilliseconds(bestReactionMs, isGerman ? "Warte auf Run" : "Awaiting run"),
      meta: hasRecordedRounds
        ? isGerman
          ? "Niedrigstes gespeichertes Ergebnis auf diesem Geraet"
          : "Lowest saved result on this device"
        : isGerman
          ? "Deine erste gueltige Runde setzt hier die Basis"
          : "Your first valid round sets the baseline here",
    },
    {
      label: isGerman ? "Durchschnitt" : "Average",
      value: formatMilliseconds(averageReactionMs, "--"),
      meta: hasRecordedRounds
        ? isGerman
          ? `Ueber ${recordedRoundCount} gespeicherte Runden`
          : `Across ${recordedRoundCount} recorded rounds`
        : isGerman
          ? "Der Durchschnitt erscheint nach den ersten gemessenen Inputs"
          : "Average appears once you have measured input",
    },
    {
      label: isGerman ? "Sessions" : "Sessions",
      value: totalSessions ? `${totalSessions}` : "0",
      meta: totalSessions
        ? isGerman
          ? `${activeDays} aktive${activeDays === 1 ? "r Tag" : " Tage"} lokal erfasst`
          : `${activeDays} active day${activeDays === 1 ? "" : "s"} captured locally`
        : isGerman
          ? "Neues lokales Profil, bereit fuer die erste Session"
          : "New local profile, ready for the first session",
    },
    {
      label: isGerman ? "Verbesserung" : "Improvement",
      value: formatImprovement(improvementMs, isGerman),
      meta:
        improvementMs === null
          ? isGerman
            ? "Braucht einige Runden, bevor ein Trend belastbar wird"
            : "Needs a few rounds before a trend becomes credible"
          : isGerman
            ? "Verglichen mit deinem fruehesten gespeicherten Sample"
            : "Compared to your earliest recorded sample",
    },
  ];

  const leaderboardStatus =
    publishStatus === "success"
      ? publishMessage
      : backendMode === "live"
        ? leaderboardSyncStatus === "success"
          ? leaderboardLastSyncedAt
            ? isGerman
              ? `Live-Leaderboard synchronisiert um ${formatSyncTime(leaderboardLastSyncedAt)}.`
              : `Live leaderboard synced at ${formatSyncTime(leaderboardLastSyncedAt)}.`
            : leaderboardSyncMessage
          : leaderboardSyncMessage ||
            (isGerman
              ? "Verbindung zum Live-Leaderboard wird aufgebaut..."
              : "Connecting to live leaderboard...")
        : isGerman
          ? "Vorschau-Modus. Konfiguriere Supabase, um Beispieldaten durch Live-Submissions zu ersetzen."
          : "Preview mode. Configure Supabase to replace example data with live submissions.";

  const updateGuestProfile = (patch: Partial<GuestProfile>) => {
    setState((current) => ({
      ...current,
      guestProfile: {
        ...current.guestProfile,
        ...(patch.displayName !== undefined && patch.tag === undefined
          ? { tag: deriveTagFromName(patch.displayName) }
          : {}),
        ...patch,
      },
    }));
  };

  const ensureGuestIdentity = () => {
    const trimmedDisplayName = state.guestProfile.displayName.trim();
    const derivedTag = normalizeTag(
      state.guestProfile.tag || deriveTagFromName(trimmedDisplayName),
    );

    if (trimmedDisplayName && derivedTag) {
      return {
        displayName: trimmedDisplayName,
        tag: derivedTag,
        region: guestRegion,
      };
    }

    const fallbackIdentity = createPlayerIdentity();

    setState((current) => ({
      ...current,
      guestProfile: {
        ...current.guestProfile,
        displayName: fallbackIdentity.displayName,
        tag: fallbackIdentity.tag,
      },
    }));

    return {
      displayName: fallbackIdentity.displayName,
      tag: fallbackIdentity.tag,
      region: guestRegion,
    };
  };

  const showLeaderboard = async () => {
    const resolvedIdentity = ensureGuestIdentity();

    if (!canSubmitScore || bestReactionMs === null || averageReactionMs === null) {
      setPublishStatus("idle");
      setPublishMessage(
        isGerman
          ? `${resolvedIdentity.displayName} ist bereit. Absolviere eine gueltige Runde, um ins Leaderboard zu kommen.`
          : `${resolvedIdentity.displayName} is ready. Finish a valid round to enter the leaderboard.`,
      );
      return;
    }

    if (backendMode !== "live") {
      setPublishStatus("success");
      setPublishMessage(
        isGerman
          ? `${resolvedIdentity.displayName} ist jetzt mit ${bestReactionMs} ms in der Leaderboard-Vorschau verbunden.`
          : `${resolvedIdentity.displayName} is now connected to the leaderboard preview with ${bestReactionMs} ms.`,
      );
      return;
    }

    setPublishStatus("submitting");
    setPublishMessage("");

    try {
      await publishGuestScore({
        displayName: resolvedIdentity.displayName,
        tag: resolvedIdentity.tag,
        region: resolvedIdentity.region,
        email: state.guestProfile.email,
        bestReactionMs,
        averageReactionMs,
        roundsCount: recordedRoundCount,
        sessionId: state.activeSessionId,
      });
      await refreshLeaderboard();
      setPublishStatus("success");
      setPublishMessage(
        isGerman
          ? `${resolvedIdentity.displayName} ist jetzt mit ${bestReactionMs} ms live im Leaderboard.`
          : `${resolvedIdentity.displayName} is now live on the leaderboard with ${bestReactionMs} ms.`,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : isGerman
            ? "Dieser Score konnte nicht mit dem Leaderboard verbunden werden."
            : "Could not connect this score to the leaderboard.";
      setPublishStatus("error");
      setPublishMessage(message);
    }
  };

  const recordReaction = (value: number) => {
    const createdAt = new Date().toISOString();

    setState((current) => ({
      ...current,
      rounds: [
        ...current.rounds,
        {
          id: createId("round"),
          value,
          createdAt,
          sessionId: current.activeSessionId,
        },
      ],
    }));
  };

  const recordEarlyTap = () => {
    const createdAt = new Date().toISOString();

    setState((current) => ({
      ...current,
      earlyTaps: [
        ...current.earlyTaps,
        {
          id: createId("early"),
          createdAt,
          sessionId: current.activeSessionId,
        },
      ],
    }));
  };

  const startNewSession = () => {
    setState((current) => ({
      ...current,
      activeSessionId: createSessionId(),
    }));
  };

  return (
    <ReactionProductContext.Provider
      value={{
        backendMode,
        guestProfile: state.guestProfile,
        currentSessionId: state.activeSessionId,
        currentSessionRounds,
        recordedRounds,
        hasRecordedRounds,
        recordedRoundCount,
        bestReactionMs,
        averageReactionMs,
        currentSessionBestMs,
        currentSessionAverageMs,
        totalSessions,
        activeDays,
        earlyTapCount,
        improvementMs,
        consistencyScore,
        stabilityBandMs,
        provisionalRank,
        workspaceStats,
        progressTrend,
        sessionFeed,
        leaderboardRows,
        leaderboardStatus,
        publishStatus,
        publishMessage,
        canSubmitScore,
        updateGuestProfile,
        refreshLeaderboard,
        showLeaderboard,
        startNewSession,
        recordReaction,
        recordEarlyTap,
      }}
    >
      {children}
    </ReactionProductContext.Provider>
  );
}

export function useReactionProduct() {
  const context = useContext(ReactionProductContext);

  if (!context) {
    throw new Error("useReactionProduct must be used within a ReactionProductProvider.");
  }

  return context;
}
