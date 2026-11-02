drop function if exists public.toggle_item_uprank(uuid, integer, text);
drop function if exists public.item_uprank_summary(uuid, text);
drop table if exists public.item_upranks;

create table public.item_upranks (
  id uuid primary key default gen_random_uuid(),
  ranking_id uuid not null references public.rankings (id) on delete cascade,
  item_position integer not null check (item_position >= 1 and item_position <= 7),
  voter_key text not null,
  created_at timestamptz not null default now(),
  unique (ranking_id, item_position, voter_key)
);

create index item_upranks_ranking_position_idx
  on public.item_upranks (ranking_id, item_position);

alter table public.item_upranks enable row level security;

create policy "Anyone can read item upranks"
  on public.item_upranks
  for select
  using (true);

revoke insert, update, delete on public.item_upranks from anon, authenticated;

create or replace function public.item_uprank_summary(
  p_ranking_id uuid,
  p_voter_key text
)
returns table (
  item_position integer,
  uprank_count bigint,
  is_mine boolean
)
language sql
stable
security definer
set search_path = public
as $$
  select
    item_upranks.item_position,
    count(*)::bigint as uprank_count,
    bool_or(item_upranks.voter_key = p_voter_key) as is_mine
  from public.item_upranks
  where item_upranks.ranking_id = p_ranking_id
  group by item_upranks.item_position
  order by item_upranks.item_position;
$$;

create or replace function public.toggle_item_uprank(
  p_ranking_id uuid,
  p_item_position integer,
  p_voter_key text
)
returns table (
  uprank_count bigint,
  is_mine boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  existing_id uuid;
  next_mine boolean;
begin
  if p_voter_key is null or length(trim(p_voter_key)) < 8 then
    raise exception 'A voter key is required.';
  end if;

  if p_item_position < 1 or p_item_position > 7 then
    raise exception 'Position must be between 1 and 7.';
  end if;

  select id
  into existing_id
  from public.item_upranks
  where ranking_id = p_ranking_id
    and item_position = p_item_position
    and voter_key = p_voter_key
  limit 1;

  if existing_id is not null then
    delete from public.item_upranks
    where id = existing_id;

    next_mine := false;
  else
    insert into public.item_upranks (
      ranking_id,
      item_position,
      voter_key
    )
    values (
      p_ranking_id,
      p_item_position,
      p_voter_key
    );

    next_mine := true;
  end if;

  return query
  select
    count(*)::bigint,
    next_mine
  from public.item_upranks
  where ranking_id = p_ranking_id
    and item_position = p_item_position;
end;
$$;

grant execute on function public.item_uprank_summary(uuid, text) to anon, authenticated;
grant execute on function public.toggle_item_uprank(uuid, integer, text) to anon, authenticated;
