-- ZEQUI production account + usage foundation
-- Run this migration in the Supabase SQL Editor before enabling persistent quotas.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_id text,
  accent_color text,
  bio text,
  join_date bigint,
  streak integer not null default 0,
  plan text not null default 'free' check (plan in ('free', 'pro', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  request_id uuid not null,
  provider text,
  created_at timestamptz not null default now()
);

create unique index if not exists ai_usage_events_request_id_idx
  on public.ai_usage_events(request_id);

create index if not exists ai_usage_events_user_created_idx
  on public.ai_usage_events(user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.ai_usage_events enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Usage events are intentionally server-write only. Users never receive direct
-- access to the raw request ledger.
revoke all on public.ai_usage_events from anon, authenticated;



create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.touch_profile_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
before update on public.profiles
for each row execute function public.touch_profile_updated_at();

-- Atomic server-side quota consumption.
-- A transaction-scoped advisory lock serializes quota checks for one user,
-- preventing concurrent requests from both passing the same remaining slot.
create or replace function public.consume_ai_usage(
  p_user_id uuid,
  p_request_id uuid,
  p_window_limit integer default 20,
  p_daily_limit integer default 100
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := now();
  v_window_start timestamptz := v_now - interval '10 minutes';
  v_day_start timestamptz := date_trunc('day', v_now);
  v_window_used integer;
  v_daily_used integer;
  v_plan text := 'free';
  v_daily_limit integer := greatest(p_daily_limit, 1);
  v_window_limit integer := greatest(p_window_limit, 1);
  v_retry_seconds integer := 1;
begin
  if p_user_id is null or p_request_id is null then
    raise exception 'user_id and request_id are required';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(p_user_id::text, 0));

  select plan into v_plan from public.profiles where id = p_user_id;

  if v_plan = 'pro' then
    v_daily_limit := greatest(v_daily_limit * 5, v_daily_limit);
    v_window_limit := greatest(v_window_limit * 2, v_window_limit);
  elsif v_plan = 'admin' then
    v_daily_limit := greatest(v_daily_limit * 20, v_daily_limit);
    v_window_limit := greatest(v_window_limit * 5, v_window_limit);
  end if;

  select count(*)::integer into v_window_used
  from public.ai_usage_events
  where user_id = p_user_id and created_at >= v_window_start;

  select count(*)::integer into v_daily_used
  from public.ai_usage_events
  where user_id = p_user_id and created_at >= v_day_start;

  if v_window_used >= v_window_limit or v_daily_used >= v_daily_limit then
    if v_window_used >= v_window_limit then
      select greatest(1, ceil(extract(epoch from (min(created_at) + interval '10 minutes' - v_now)))::integer)
      into v_retry_seconds
      from public.ai_usage_events
      where user_id = p_user_id and created_at >= v_window_start;
    else
      v_retry_seconds := greatest(1, ceil(extract(epoch from (v_day_start + interval '1 day' - v_now)))::integer);
    end if;

    return jsonb_build_object(
      'allowed', false,
      'plan', v_plan,
      'window_used', v_window_used,
      'window_limit', v_window_limit,
      'daily_used', v_daily_used,
      'daily_limit', v_daily_limit,
      'remaining', greatest(0, least(v_window_limit - v_window_used, v_daily_limit - v_daily_used)),
      'retry_after', v_retry_seconds
    );
  end if;

  insert into public.ai_usage_events (user_id, request_id)
  values (p_user_id, p_request_id)
  on conflict (request_id) do nothing;

  v_window_used := v_window_used + 1;
  v_daily_used := v_daily_used + 1;

  return jsonb_build_object(
    'allowed', true,
    'plan', v_plan,
    'window_used', v_window_used,
    'window_limit', v_window_limit,
    'daily_used', v_daily_used,
    'daily_limit', v_daily_limit,
    'remaining', greatest(0, least(v_window_limit - v_window_used, v_daily_limit - v_daily_used)),
    'retry_after', 1
  );
end;
$$;

revoke all on function public.consume_ai_usage(uuid, uuid, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_ai_usage(uuid, uuid, integer, integer) to service_role;

-- Keep the raw ledger bounded. Run from a scheduled job/cron once per day.
create or replace function public.purge_old_ai_usage_events()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_deleted integer;
begin
  delete from public.ai_usage_events where created_at < now() - interval '35 days';
  get diagnostics v_deleted = row_count;
  return v_deleted;
end;
$$;

revoke all on function public.purge_old_ai_usage_events() from public, anon, authenticated;
grant execute on function public.purge_old_ai_usage_events() to service_role;


create or replace function public.get_ai_usage(
  p_user_id uuid,
  p_window_limit integer default 20,
  p_daily_limit integer default 100
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := now();
  v_window_used integer;
  v_daily_used integer;
  v_plan text := 'free';
  v_daily_limit integer := greatest(p_daily_limit, 1);
  v_window_limit integer := greatest(p_window_limit, 1);
begin
  if p_user_id is null then raise exception 'user_id is required'; end if;
  select plan into v_plan from public.profiles where id = p_user_id;
  if v_plan = 'pro' then
    v_daily_limit := greatest(v_daily_limit * 5, v_daily_limit);
    v_window_limit := greatest(v_window_limit * 2, v_window_limit);
  elsif v_plan = 'admin' then
    v_daily_limit := greatest(v_daily_limit * 20, v_daily_limit);
    v_window_limit := greatest(v_window_limit * 5, v_window_limit);
  end if;

  select count(*)::integer into v_window_used
  from public.ai_usage_events
  where user_id = p_user_id and created_at >= v_now - interval '10 minutes';

  select count(*)::integer into v_daily_used
  from public.ai_usage_events
  where user_id = p_user_id and created_at >= date_trunc('day', v_now);

  return jsonb_build_object(
    'plan', v_plan,
    'window_used', v_window_used,
    'window_limit', v_window_limit,
    'daily_used', v_daily_used,
    'daily_limit', v_daily_limit,
    'remaining', greatest(0, least(v_window_limit - v_window_used, v_daily_limit - v_daily_used))
  );
end;
$$;

revoke all on function public.get_ai_usage(uuid, integer, integer) from public, anon, authenticated;
grant execute on function public.get_ai_usage(uuid, integer, integer) to service_role;

create or replace function public.finalize_ai_usage(
  p_request_id uuid,
  p_provider text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.ai_usage_events
  set provider = left(p_provider, 32)
  where request_id = p_request_id;
end;
$$;

revoke all on function public.finalize_ai_usage(uuid, text) from public, anon, authenticated;
grant execute on function public.finalize_ai_usage(uuid, text) to service_role;

-- Entitlements are controlled by the server/billing system, never by the browser.
create or replace function public.protect_profile_entitlements()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.plan is distinct from old.plan and current_user <> 'service_role' then
    raise exception 'Plan changes are managed by ZEQUI billing administrators';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_entitlements on public.profiles;
create trigger protect_profile_entitlements
before update on public.profiles
for each row execute function public.protect_profile_entitlements();
