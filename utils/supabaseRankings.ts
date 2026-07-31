import { supabase } from "@/utils/supabase"
import { Ranking, RankingItem } from "@/types/ranking"

type RankingRow = {
  id: string
  title: string
  category: string | null
  description: string | null
  user_id: string
  views: number | null
  created_at: string | null
}

type ProfileRow = {
  id: string
  username: string
  display_name: string
}

type RankingItemRow = {
  ranking_id: string
  position: number
  name: string
  votes: number | null
}

export async function getAllSupabaseRankings(): Promise<Ranking[]> {

  const { data: rankings, error } = await supabase
    .from("rankings")
    .select("*")
    .order("created_at", { ascending: false })

  if (error || !rankings) {
    console.error(error)
    return []
  }

  const userIds = [...new Set(rankings.map(r => r.user_id))]

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, display_name")
    .in("id", userIds)

  const { data: items } = await supabase
    .from("ranking_items")
    .select("*")
    .order("position")

  const profileMap = new Map<string, ProfileRow>()

  ;(profiles ?? []).forEach(profile => {
    profileMap.set(profile.id, profile as ProfileRow)
  })

  const itemMap = new Map<string, RankingItem[]>()

  ;(items ?? []).forEach(item => {

    const row = item as RankingItemRow

    if (!itemMap.has(row.ranking_id)) {
      itemMap.set(row.ranking_id, [])
    }

    itemMap.get(row.ranking_id)!.push({
      position: row.position,
      name: row.name,
      votes: row.votes ?? 0
    })

  })

  return (rankings as RankingRow[]).map(row => {

    const profile = profileMap.get(row.user_id)

    return {

      id: row.id,

      title: row.title,

      category: row.category ?? "General",

      creator: profile?.display_name ?? "Anonymous",

      creatorId: row.user_id,

      creatorUsername: profile?.username,

      creatorDisplayName: profile?.display_name,

      description: row.description ?? "",

      items: itemMap.get(row.id) ?? [],

      createdAt: row.created_at ?? undefined,

      source: "community",

      views: row.views ?? 0

    }

  })

}

export async function getSupabaseRanking(
  id: string
): Promise<Ranking | null> {

  const rankings = await getAllSupabaseRankings()

  return rankings.find(r => r.id === id) ?? null

}

export async function getUserRankings(
  userId: string
): Promise<Ranking[]> {

  const rankings = await getAllSupabaseRankings()

  return rankings.filter(
    ranking => ranking.creatorId === userId
  )

}