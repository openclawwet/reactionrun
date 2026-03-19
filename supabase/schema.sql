create extension if not exists pgcrypto;

create table if not exists public.leaderboard_scores (
  id uuid primary key default gen_random_uuid(),
  guest_id uuid not null default gen_random_uuid(),
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

alter table public.leaderboard_scores
  add column if not exists guest_id uuid;

alter table public.leaderboard_scores
  alter column guest_id set default gen_random_uuid();

update public.leaderboard_scores
set guest_id = gen_random_uuid()
where guest_id is null;

alter table public.leaderboard_scores
  alter column guest_id set not null;

create index if not exists leaderboard_scores_best_idx
  on public.leaderboard_scores (best_reaction_ms asc, published_at desc);

create index if not exists leaderboard_scores_recent_idx
  on public.leaderboard_scores (published_at desc);

create index if not exists leaderboard_scores_guest_idx
  on public.leaderboard_scores (guest_id, published_at desc);

create index if not exists leaderboard_scores_tag_idx
  on public.leaderboard_scores (lower(tag));

create table if not exists public.profile_claim_requests (
  id uuid primary key default gen_random_uuid(),
  guest_id uuid not null default gen_random_uuid(),
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

alter table public.profile_claim_requests
  add column if not exists guest_id uuid;

alter table public.profile_claim_requests
  alter column guest_id set default gen_random_uuid();

update public.profile_claim_requests
set guest_id = gen_random_uuid()
where guest_id is null;

alter table public.profile_claim_requests
  alter column guest_id set not null;

create unique index if not exists profile_claim_requests_email_tag_idx
  on public.profile_claim_requests (lower(email), lower(tag));

create or replace function public.submit_guest_score(
  p_guest_id uuid,
  p_display_name text,
  p_tag text,
  p_region text,
  p_best_reaction_ms integer,
  p_average_reaction_ms integer,
  p_rounds_count integer,
  p_session_id text default null,
  p_claim_email text default null,
  p_source text default 'web'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_inserted_id uuid;
  v_display_name text;
  v_tag text;
  v_region text;
begin
  v_display_name := btrim(p_display_name);

  if char_length(v_display_name) < 2 or char_length(v_display_name) > 32 then
    raise exception 'Display name must be between 2 and 32 characters.';
  end if;

  v_tag := lower(regexp_replace(coalesce(p_tag, ''), '\s+', '', 'g'));
  v_tag := regexp_replace(v_tag, '[^a-z0-9_@-]+', '', 'g');

  if v_tag = '' then
    raise exception 'A nickname tag is required.';
  end if;

  if left(v_tag, 1) <> '@' then
    v_tag := '@' || v_tag;
  end if;

  if char_length(v_tag) < 3 or char_length(v_tag) > 24 then
    raise exception 'Tag must be between 3 and 24 characters.';
  end if;

  v_region := upper(left(coalesce(nullif(btrim(p_region), ''), 'WEB'), 3));

  select id
  into v_inserted_id
  from public.leaderboard_scores
  where guest_id = p_guest_id
    and session_id is not distinct from p_session_id
    and best_reaction_ms = p_best_reaction_ms
    and average_reaction_ms = p_average_reaction_ms
    and published_at >= timezone('utc', now()) - interval '15 seconds'
  order by published_at desc
  limit 1;

  if v_inserted_id is not null then
    return v_inserted_id;
  end if;

  insert into public.leaderboard_scores (
    guest_id,
    display_name,
    tag,
    region,
    best_reaction_ms,
    average_reaction_ms,
    rounds_count,
    is_guest,
    source,
    session_id,
    claim_email
  )
  values (
    p_guest_id,
    v_display_name,
    v_tag,
    v_region,
    p_best_reaction_ms,
    p_average_reaction_ms,
    p_rounds_count,
    true,
    coalesce(nullif(btrim(p_source), ''), 'web'),
    nullif(btrim(p_session_id), ''),
    nullif(btrim(p_claim_email), '')
  )
  returning id into v_inserted_id;

  return v_inserted_id;
end;
$$;

create or replace function public.request_profile_claim(
  p_guest_id uuid,
  p_display_name text,
  p_tag text,
  p_region text,
  p_email text,
  p_best_reaction_ms integer,
  p_average_reaction_ms integer,
  p_rounds_count integer,
  p_session_id text default null,
  p_source text default 'web'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_request_id uuid;
  v_display_name text;
  v_tag text;
  v_region text;
  v_email text;
begin
  v_display_name := btrim(p_display_name);
  v_email := lower(btrim(p_email));

  if char_length(v_display_name) < 2 or char_length(v_display_name) > 32 then
    raise exception 'Display name must be between 2 and 32 characters.';
  end if;

  if v_email = '' then
    raise exception 'Email is required.';
  end if;

  v_tag := lower(regexp_replace(coalesce(p_tag, ''), '\s+', '', 'g'));
  v_tag := regexp_replace(v_tag, '[^a-z0-9_@-]+', '', 'g');

  if v_tag = '' then
    raise exception 'A nickname tag is required.';
  end if;

  if left(v_tag, 1) <> '@' then
    v_tag := '@' || v_tag;
  end if;

  if char_length(v_tag) < 3 or char_length(v_tag) > 24 then
    raise exception 'Tag must be between 3 and 24 characters.';
  end if;

  v_region := upper(left(coalesce(nullif(btrim(p_region), ''), 'WEB'), 3));

  select id
  into v_request_id
  from public.profile_claim_requests
  where lower(email) = v_email
    and lower(tag) = v_tag
  order by created_at desc
  limit 1;

  if v_request_id is not null then
    update public.profile_claim_requests
    set
      guest_id = p_guest_id,
      display_name = v_display_name,
      region = v_region,
      best_reaction_ms = p_best_reaction_ms,
      average_reaction_ms = p_average_reaction_ms,
      rounds_count = p_rounds_count,
      source = coalesce(nullif(btrim(p_source), ''), 'web'),
      session_id = nullif(btrim(p_session_id), ''),
      status = 'pending',
      created_at = timezone('utc', now())
    where id = v_request_id;

    return v_request_id;
  end if;

  insert into public.profile_claim_requests (
    guest_id,
    display_name,
    tag,
    region,
    email,
    best_reaction_ms,
    average_reaction_ms,
    rounds_count,
    source,
    session_id,
    status
  )
  values (
    p_guest_id,
    v_display_name,
    v_tag,
    v_region,
    v_email,
    p_best_reaction_ms,
    p_average_reaction_ms,
    p_rounds_count,
    coalesce(nullif(btrim(p_source), ''), 'web'),
    nullif(btrim(p_session_id), ''),
    'pending'
  )
  returning id into v_request_id;

  return v_request_id;
end;
$$;

create or replace view public.leaderboard_recent_100 as
select
  id,
  guest_id,
  display_name,
  tag,
  region,
  best_reaction_ms,
  average_reaction_ms,
  rounds_count,
  published_at,
  is_guest,
  claim_email is not null as claim_requested
from public.leaderboard_scores
order by published_at desc
limit 100;

create or replace view public.leaderboard_top_100 as
with ranked_scores as (
  select
    id,
    guest_id,
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
      partition by guest_id
      order by best_reaction_ms asc, published_at desc
    ) as guest_rank
  from public.leaderboard_scores
)
select
  id,
  guest_id,
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
where guest_rank = 1
order by best_reaction_ms asc, published_at desc
limit 100;

create or replace view public.leaderboard_public as
select *
from public.leaderboard_top_100;

alter table public.leaderboard_scores enable row level security;
alter table public.profile_claim_requests enable row level security;

drop policy if exists "leaderboard_public_read" on public.leaderboard_scores;
create policy "leaderboard_public_read"
  on public.leaderboard_scores
  for select
  to anon, authenticated
  using (true);

drop policy if exists "leaderboard_guest_insert" on public.leaderboard_scores;
drop policy if exists "claim_request_insert" on public.profile_claim_requests;

grant select on public.leaderboard_recent_100 to anon, authenticated;
grant select on public.leaderboard_top_100 to anon, authenticated;
grant select on public.leaderboard_public to anon, authenticated;

grant execute on function public.submit_guest_score(
  uuid,
  text,
  text,
  text,
  integer,
  integer,
  integer,
  text,
  text,
  text
) to anon, authenticated;

grant execute on function public.request_profile_claim(
  uuid,
  text,
  text,
  text,
  text,
  integer,
  integer,
  integer,
  text,
  text
) to anon, authenticated;
