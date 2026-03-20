import { supabase, isSupabaseConfigured } from "../lib/supabase";

export type BackendMode = "preview" | "live";
export type RemoteLeaderboardView = "top" | "recent";

export type RemoteLeaderboardEntry = {
  id: string;
  guestId: string;
  displayName: string;
  tag: string;
  region: string;
  bestReactionMs: number;
  averageReactionMs: number;
  roundsCount: number;
  publishedAt: string;
  isGuest: boolean;
  claimRequested: boolean;
};

export const BACKEND_ERROR_CODES = {
  rpcSchemaCacheMiss: "REACTION_RUN_RPC_SCHEMA_CACHE_MISS",
} as const;

export type GuestScoreSubmissionInput = {
  guestId: string;
  displayName: string;
  tag: string;
  region: string;
  email?: string;
  bestReactionMs: number;
  averageReactionMs: number;
  roundsCount: number;
  sessionId: string;
};

type LeaderboardRowRecord = {
  id: string;
  guest_id: string;
  display_name: string;
  tag: string;
  region: string;
  best_reaction_ms: number;
  average_reaction_ms: number;
  rounds_count: number;
  published_at: string;
  is_guest: boolean;
  claim_requested: boolean;
};

const LEADERBOARD_VIEW_MAP: Record<RemoteLeaderboardView, string> = {
  top: "leaderboard_top_100",
  recent: "leaderboard_recent_100",
};

export const backendMode: BackendMode = isSupabaseConfigured ? "live" : "preview";

const mapLeaderboardRow = (row: LeaderboardRowRecord): RemoteLeaderboardEntry => ({
  id: row.id,
  guestId: row.guest_id,
  displayName: row.display_name,
  tag: row.tag,
  region: row.region,
  bestReactionMs: row.best_reaction_ms,
  averageReactionMs: row.average_reaction_ms,
  roundsCount: row.rounds_count,
  publishedAt: row.published_at,
  isGuest: row.is_guest,
  claimRequested: row.claim_requested,
});

const ensureBackend = () => {
  if (!supabase) {
    throw new Error("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
  }

  return supabase;
};

const clampLeaderboardLimit = (value: number) => Math.max(1, Math.min(100, Math.floor(value)));

const wait = (ms: number) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

const isRpcSchemaCacheMiss = (error: { code?: string; message?: string } | null) =>
  Boolean(
    error &&
      (error.code === "PGRST202" ||
        (error.message?.includes("schema cache") &&
          (error.message.includes("submit_guest_score") ||
            error.message.includes("request_profile_claim")))),
  );

const createBackendError = (error: { message?: string; code?: string }) => {
  if (isRpcSchemaCacheMiss(error)) {
    return new Error(BACKEND_ERROR_CODES.rpcSchemaCacheMiss);
  }

  return new Error(error.message || "Reaction Run backend request failed.");
};

export const normalizeTag = (value: string) => {
  const trimmed = value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9_@-]+/g, "");

  if (!trimmed) {
    return "";
  }

  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
};

export async function fetchRemoteLeaderboard(view: RemoteLeaderboardView = "top", limit = 100) {
  const client = ensureBackend();
  const table = LEADERBOARD_VIEW_MAP[view];
  const normalizedLimit = clampLeaderboardLimit(limit);

  let query = client
    .from(table)
    .select(
      "id, guest_id, display_name, tag, region, best_reaction_ms, average_reaction_ms, rounds_count, published_at, is_guest, claim_requested",
    )
    .limit(normalizedLimit);

  query =
    view === "recent"
      ? query.order("published_at", { ascending: false })
      : query.order("best_reaction_ms", { ascending: true }).order("published_at", { ascending: false });

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data satisfies LeaderboardRowRecord[]).map(mapLeaderboardRow);
}

export async function publishGuestScore(input: GuestScoreSubmissionInput) {
  const client = ensureBackend();
  const rpcPayload = {
    p_guest_id: input.guestId,
    p_display_name: input.displayName,
    p_tag: normalizeTag(input.tag),
    p_region: input.region.trim().toUpperCase(),
    p_best_reaction_ms: input.bestReactionMs,
    p_average_reaction_ms: input.averageReactionMs,
    p_rounds_count: input.roundsCount,
    p_session_id: input.sessionId,
    p_claim_email: input.email?.trim() || null,
    p_source: "web",
  };

  let { error } = await client.rpc("submit_guest_score", rpcPayload);

  if (isRpcSchemaCacheMiss(error)) {
    await wait(1200);
    ({ error } = await client.rpc("submit_guest_score", rpcPayload));
  }

  if (error) {
    throw createBackendError(error);
  }
}

export async function requestClaimLink(input: GuestScoreSubmissionInput) {
  const client = ensureBackend();
  const email = input.email?.trim();

  if (!email) {
    throw new Error("Email is required to request a claim link.");
  }

  const rpcPayload = {
    p_guest_id: input.guestId,
    p_display_name: input.displayName,
    p_tag: normalizeTag(input.tag),
    p_region: input.region.trim().toUpperCase(),
    p_email: email,
    p_best_reaction_ms: input.bestReactionMs,
    p_average_reaction_ms: input.averageReactionMs,
    p_rounds_count: input.roundsCount,
    p_session_id: input.sessionId,
    p_source: "web",
  };

  let { error } = await client.rpc("request_profile_claim", rpcPayload);

  if (isRpcSchemaCacheMiss(error)) {
    await wait(1200);
    ({ error } = await client.rpc("request_profile_claim", rpcPayload));
  }

  if (error) {
    throw createBackendError(error);
  }
}
