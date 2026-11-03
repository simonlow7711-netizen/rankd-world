import {
  Ranking
} from "@/types/ranking"

import {
  categoryToSlug
} from "@/utils/categorySlug"

import {
  locations
} from "@/utils/locations"

import {
  PhotoRankdPreview
} from "@/utils/photoRankds"


export type LinkdBondKind =
  | "photo"
  | "entry"
  | "location"
  | "category"


export type LinkdThread = {
  kind: LinkdBondKind
  label: string
  href?: string
  rankings: Ranking[]
}


function familyKey(
  ranking: Ranking
) {
  return ranking.rootId || ranking.id
}


function uniqueFamilies(
  rankings: Ranking[]
) {
  const seen =
    new Set<string>()

  return rankings.filter(
    ranking => {
      const key =
        familyKey(
          ranking
        )

      if (seen.has(key)) {
        return false
      }

      seen.add(key)
      return true
    }
  )
}


function normalizeName(
  value: string
) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
}


function locationSlug(
  ranking: Ranking
) {
  const name =
    ranking.location?.name
      ?.trim()

  if (!name) {
    return null
  }

  const match =
    Object.entries(locations).find(
      ([, location]) =>
        location.name.toLowerCase() ===
        name.toLowerCase()
    )

  return match?.[0] ?? null
}


function takeSeven(
  rankings: Ranking[]
) {
  return uniqueFamilies(
    rankings
  ).slice(
    0,
    7
  )
}


function scoreThread(
  kind: LinkdBondKind,
  count: number
) {
  const kindWeight =
    kind === "photo"
      ? 40
      : kind === "entry"
        ? 30
        : kind === "location"
          ? 20
          : 10

  return kindWeight + Math.min(7, count)
}


export function getLinkdThread(
  rankings: Ranking[],
  options?: {
    preferCategory?: string
    photoRankds?: PhotoRankdPreview[]
  }
): LinkdThread | null {

  const candidates: LinkdThread[] =
    []

  for (const photoRankd of options?.photoRankds ?? []) {
    const ids =
      new Set(
        photoRankd.ranking_ids ?? []
      )

    if (ids.size < 2) {
      continue
    }

    const linked =
      takeSeven(
        rankings.filter(
          ranking =>
            ids.has(
              ranking.id
            )
        )
      )

    if (linked.length < 2) {
      continue
    }

    candidates.push({
      kind: "photo",
      label:
        photoRankd.title,
      href:
        `/photo-rankd/${photoRankd.id}`,
      rankings:
        linked
    })
  }

  const itemGroups =
    new Map<string, {
      label: string
      rankings: Ranking[]
    }>()

  for (const ranking of rankings) {
    for (const item of ranking.items ?? []) {
      const key =
        normalizeName(
          item.name
        )

      if (key.length < 6) {
        continue
      }

      const group =
        itemGroups.get(key) ?? {
          label:
            item.name,
          rankings: []
        }

      group.rankings.push(
        ranking
      )
      itemGroups.set(
        key,
        group
      )
    }
  }

  for (const group of itemGroups.values()) {
    const linked =
      takeSeven(
        group.rankings
      )

    if (linked.length < 2) {
      continue
    }

    candidates.push({
      kind: "entry",
      label:
        group.label,
      href:
        `/search?q=${encodeURIComponent(group.label)}`,
      rankings:
        linked
    })
  }

  const locationGroups =
    new Map<string, Ranking[]>()

  for (const ranking of rankings) {
    const name =
      ranking.location?.name
        ?.trim()

    if (!name) {
      continue
    }

    const key =
      normalizeName(
        name
      )

    const group =
      locationGroups.get(key) ?? []

    group.push(
      ranking
    )
    locationGroups.set(
      key,
      group
    )
  }

  for (const [key, group] of locationGroups) {
    const linked =
      takeSeven(
        group
      )

    if (linked.length < 2) {
      continue
    }

    const slug =
      locationSlug(
        linked[0]
      )

    candidates.push({
      kind: "location",
      label:
        linked[0].location?.name ??
        key,
      href:
        slug
          ? `/location/${slug}`
          : undefined,
      rankings:
        linked
    })
  }

  const categoryGroups =
    new Map<string, Ranking[]>()

  for (const ranking of rankings) {
    const category =
      ranking.category
        ?.trim()

    if (!category) {
      continue
    }

    const group =
      categoryGroups.get(category) ?? []

    group.push(
      ranking
    )
    categoryGroups.set(
      category,
      group
    )
  }

  for (const [category, group] of categoryGroups) {
    const linked =
      takeSeven(
        group
      )

    if (linked.length < 2) {
      continue
    }

    candidates.push({
      kind: "category",
      label:
        category,
      href:
        `/category/${categoryToSlug(category)}`,
      rankings:
        linked
    })
  }

  if (candidates.length === 0) {
    return null
  }

  const preferredCategory =
    options?.preferCategory
      ?.trim()

  const preferred =
    preferredCategory
      ? candidates.filter(
          candidate =>
            candidate.kind === "category" &&
            candidate.label === preferredCategory &&
            candidate.rankings.length >= 3
        )
      : []

  const pool =
    preferred.length > 0
      ? preferred
      : candidates

  return pool.sort(
    (a, b) =>
      scoreThread(
        b.kind,
        b.rankings.length
      ) -
      scoreThread(
        a.kind,
        a.rankings.length
      )
  )[0]
}
