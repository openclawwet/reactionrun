create extension if not exists pgcrypto;

create table if not exists public.leaderboard_scores (
  id uuid primary key default gen_random_uuid(),
  display_name text not null check (char_length(display_name) between 2 and 32),
  tag text not null check (char_length(tag) between 3 and 24),
  region text not null default 'WEB' check (char_length(region) between 2 and 3),
  best_reaction_ms integer not null check (best_reaction_ms between 50 and 1000),
  average_reaction_ms integer not null check (average_reaction_ms between 50 and 1000),
  rounds_count integer not null check (rounds_count between 1 and 64),
  is_guest boolean not null default true,
  source text not null default 'web',
  session_id text,
  claim_email text,
  published_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists leaderboard_scores_best_idx
  on public.leaderboard_scores (best_reaction_ms asc, published_at desc);

create index if not exists leaderboard_scores_tag_idx
  on public.leaderboard_scores (lower(tag));

create table if not exists public.profile_claim_requests (
  id uuid primary key default gen_random_uuid(),
  display_name text not null check (char_length(display_name) between 2 and 32),
  tag text not null check (char_length(tag) between 3 and 24),
  region text not null default 'WEB' check (char_length(region) between 2 and 3),
  email text not null,
  best_reaction_ms integer not null check (best_reaction_ms between 50 and 1000),
  average_reaction_ms integer not null check (average_reaction_ms between 50 and 1000),
  rounds_count integer not null check (rounds_count between 1 and 64),
  source text not null default 'web',
  session_id text,
  status text not null default 'pending',
  created_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists profile_claim_requests_email_tag_idx
  on public.profile_claim_requests (lower(email), lower(tag));

create or replace view public.leaderboard_public as
with ranked_scores as (
  select
    id,
    display_name,
    tag,
    region,
    best_reaction_ms,
    average_reaction_ms,
    rounds_count,
    published_at,
    is_guest,
    claim_email is not null as claim_requested,
    row_number() over (
      partition by lower(tag)
      order by best_reaction_ms asc, published_at desc
    ) as tag_rank
  from public.leaderboard_scores
)
select
  id,
  display_name,
  tag,
  region,
  best_reaction_ms,
  average_reaction_ms,
  rounds_count,
  published_at,
  is_guest,
  claim_requested
from ranked_scores
where tag_rank = 1
order by best_reaction_ms asc, published_at desc;

alter table public.leaderboard_scores enable row level security;
alter table public.profile_claim_requests enable row level security;

drop policy if exists "leaderboard_public_read" on public.leaderboard_scores;
create policy "leaderboard_public_read"
  on public.leaderboard_scores
  for select
  to anon, authenticated
  using (true);

drop policy if exists "leaderboard_guest_insert" on public.leaderboard_scores;
create policy "leaderboard_guest_insert"
  on public.leaderboard_scores
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "claim_request_insert" on public.profile_claim_requests;
create policy "claim_request_insert"
  on public.profile_claim_requests
  for insert
  to anon, authenticated
  with check (true);
