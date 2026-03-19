import { supabase, isSupabaseConfigured } from "../lib/supabase";

export type BackendMode = "preview" | "live";

export type RemoteLeaderboardEntry = {
  id: string;
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

export type GuestScoreSubmissionInput = {
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

export const backendMode: BackendMode = isSupabaseConfigured ? "live" : "preview";

const mapLeaderboardRow = (row: LeaderboardRowRecord): RemoteLeaderboardEntry => ({
  id: row.id,
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

export const normalizeTag = (value: string) => {
  const trimmed = value.trim().toLowerCase().replace(/\s+/g, "");

  if (!trimmed) {
    return "";
  }

  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
};

export async function fetchRemoteLeaderboard(limit = 8) {
  const client = ensureBackend();
  const { data, error } = await client
    .from("leaderboard_public")
    .select(
      "id, display_name, tag, region, best_reaction_ms, average_reaction_ms, rounds_count, published_at, is_guest, claim_requested",
    )
    .order("best_reaction_ms", { ascending: true })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return (data satisfies LeaderboardRowRecord[]).map(mapLeaderboardRow);
}

export async function publishGuestScore(input: GuestScoreSubmissionInput) {
  const client = ensureBackend();
  const { error } = await client.from("leaderboard_scores").insert({
    display_name: input.displayName,
    tag: normalizeTag(input.tag),
    region: input.region.trim().toUpperCase(),
    best_reaction_ms: input.bestReactionMs,
    average_reaction_ms: input.averageReactionMs,
    rounds_count: input.roundsCount,
    is_guest: true,
    source: "web",
    session_id: input.sessionId,
    claim_email: input.email?.trim() || null,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function requestClaimLink(input: GuestScoreSubmissionInput) {
  const client = ensureBackend();
  const email = input.email?.trim();

  if (!email) {
    throw new Error("Email is required to request a claim link.");
  }

  const { error } = await client.from("profile_claim_requests").insert({
    display_name: input.displayName,
    tag: normalizeTag(input.tag),
    region: input.region.trim().toUpperCase(),
    email,
    best_reaction_ms: input.bestReactionMs,
    average_reaction_ms: input.averageReactionMs,
    rounds_count: input.roundsCount,
    session_id: input.sessionId,
    source: "web",
  });

  if (error) {
    throw new Error(error.message);
  }
}
