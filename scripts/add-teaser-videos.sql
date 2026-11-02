alter table public.rankings
add column if not exists teaser_url text;


insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'rankd-teasers',
  'rankd-teasers',
  true,
  20971520,
  array['video/mp4']::text[]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;


drop policy if exists "Public teaser read" on storage.objects;
drop policy if exists "Anyone can upload teasers" on storage.objects;
drop policy if exists "Anyone can replace teasers" on storage.objects;


create policy "Public teaser read"
on storage.objects
for select
using (
  bucket_id = 'rankd-teasers'
);


create policy "Anyone can upload teasers"
on storage.objects
for insert
with check (
  bucket_id = 'rankd-teasers'
  and name ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.mp4$'
);


create policy "Anyone can replace teasers"
on storage.objects
for update
using (
  bucket_id = 'rankd-teasers'
)
with check (
  bucket_id = 'rankd-teasers'
  and name ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.mp4$'
);


create or replace function public.publish_ranking_teaser(
  p_ranking_id uuid,
  p_teaser_url text
)
returns text
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_teaser_url is null
    or p_teaser_url !~ ('/storage/v1/object/public/rankd-teasers/' || p_ranking_id::text || '\.mp4$')
  then
    raise exception 'Invalid teaser URL.';
  end if;

  update public.rankings
  set
    teaser_url = p_teaser_url
  where
    id = p_ranking_id;

  if not found then
    raise exception 'Ranking not found.';
  end if;

  return p_teaser_url;
end;
$$;


revoke all on function public.publish_ranking_teaser(uuid, text) from public;
grant execute on function public.publish_ranking_teaser(uuid, text) to anon, authenticated;
