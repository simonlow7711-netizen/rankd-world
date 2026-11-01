alter table public.rankings
add column if not exists hero_media_url text;

update public.rankings
set
  hero_media_url = (regexp_match(description, '\[\[media:(https?://[^\s\]]+)\]\]', 'i'))[1],
  description = trim(regexp_replace(
    description,
    E'(?:\\n{1,2})?\\[\\[media:https?://[^\\s\\]]+\\]\\]\\s*$',
    '',
    'i'
  ))
where
  description ~* '\[\[media:https?://';
