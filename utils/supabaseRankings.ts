import {
  supabase
} from "@/utils/supabase"


import {
  Ranking,
  RankingItem
} from "@/types/ranking"


import {
  rankings as seedRankings
} from "@/data/rankings"


import {
  getRankingSignals
} from "@/utils/rankingSignals"


import {
  buildTasteGraph
} from "@/utils/tasteGraphBuilder"


import {
  saveTasteGraph
} from "@/utils/tasteGraphRepository"









type RankingRow = {

  id: string

  title: string

  category: string | null

  description: string | null

  user_id: string

  views: number | null

  created_at: string | null

  parent_id: string | null

  root_id: string | null

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









async function getProfileMap(

  userIds: string[]

) {


  const {
    data: profiles

  } = await supabase

    .from("profiles")

    .select(

      "id, username, display_name"

    )

    .in(

      "id",

      userIds

    )


  const map =

    new Map<string, ProfileRow>()


  ;(profiles ?? [])

    .forEach(profile => {


      map.set(

        profile.id,

        profile as ProfileRow

      )


    })


  return map

}









async function getRankingItems(

  rankingIds: string[]

) {


  const {
    data: items

  } = await supabase

    .from("ranking_items")

    .select("*")

    .in(

      "ranking_id",

      rankingIds

    )

    .order(

      "position",

      {

        ascending: true

      }

    )


  const map =

    new Map<string, RankingItem[]>()


  ;(items ?? [])

    .forEach(item => {


      const row =

        item as RankingItemRow


      if (!map.has(row.ranking_id)) {


        map.set(

          row.ranking_id,

          []

        )


      }


      map

        .get(row.ranking_id)!

        .push({

          position:

            row.position,

          name:

            row.name,

          votes:

            row.votes ?? 0

        })


    })


  return map

}









export async function getSupabaseRanking(

  id: string

): Promise<Ranking | null> {


  console.log(

    "GET RANKING DEBUG START",

    {

      id

    }

  )


  const {
    data: rankingRow,

    error: rankingError

  } = await supabase

    .from("rankings")

    .select("*")

    .eq(

      "id",

      id

    )

    .single()


  console.log(

    "GET RANKING DEBUG RESULT",

    {

      id,

      rankingRow,

      rankingError

    }

  )


  if (

    rankingError ||

    !rankingRow

  ) {


    console.error(

      "GET RANKING ERROR",

      rankingError

    )


    return null

  }


  const {
    data: items,

    error: itemError

  } = await supabase

    .from("ranking_items")

    .select("*")

    .eq(

      "ranking_id",

      id

    )

    .order(

      "position",

      {

        ascending: true

      }

    )


  if (itemError) {


    console.error(

      "GET ITEMS ERROR",

      itemError

    )

  }


  const {
    data: profile

  } = await supabase

    .from("profiles")

    .select(

      "username, display_name"

    )

    .eq(

      "id",

      rankingRow.user_id

    )

    .single()


  const ranking: Ranking = {


    id:

      rankingRow.id,


    title:

      rankingRow.title,


    category:

      rankingRow.category ?? "General",


    creator:

      profile?.display_name ?? "Anonymous",


    creatorId:

      rankingRow.user_id,


    creatorUsername:

      profile?.username,


    creatorDisplayName:

      profile?.display_name,


    description:

      rankingRow.description ?? "",


    items:

      (items ?? [])

        .map(

          (item: any) => ({

            position:

              item.position,

            name:

              item.name,

            votes:

              item.votes ?? 0

          })

        ),


    createdAt:

      rankingRow.created_at ?? undefined,


    views:

      rankingRow.views ?? 0,


    source:

      "community",


    parentId:

      rankingRow.parent_id ?? null,


    rootId:

      rankingRow.root_id ?? null

  }


  return {


    ...ranking,


    signals:

      getRankingSignals(

        ranking

      )

  }

}









export async function getAllSupabaseRankings(): Promise<Ranking[]> {


  const {
    data: rankings,

    error

  } = await supabase

    .from("rankings")

    .select("*")

    .order(

      "created_at",

      {

        ascending: false

      }

    )


  if (

    error ||

    !rankings

  ) {


    console.error(

      "GET ALL RANKINGS ERROR",

      error

    )


    return []

  }


  const userIds =

    [

      ...new Set(

        rankings.map(

          ranking =>

            ranking.user_id

        )

      )

    ]


  const profileMap =

    await getProfileMap(

      userIds

    )


  const itemMap =

    await getRankingItems(

      rankings.map(

        ranking =>

          ranking.id

      )

    )


  return (

    rankings as RankingRow[]

  )

    .map(row => {


      const profile =

        profileMap.get(

          row.user_id

        )


      const ranking: Ranking = {


        id:

          row.id,


        title:

          row.title,


        category:

          row.category ?? "General",


        creator:

          profile?.display_name ?? "Anonymous",


        creatorId:

          row.user_id,


        creatorUsername:

          profile?.username,


        creatorDisplayName:

          profile?.display_name,


        description:

          row.description ?? "",


        items:

          itemMap.get(row.id) ?? [],


        createdAt:

          row.created_at ?? undefined,


        views:

          row.views ?? 0,


        source:

          "community",


        parentId:

          row.parent_id ?? null,


        rootId:

          row.root_id ?? null

      }


      return {


        ...ranking,


        signals:

          getRankingSignals(

            ranking

          )

      }

    })

}









export async function getAllRankings(): Promise<Ranking[]> {


  const supabaseRankings =

    await getAllSupabaseRankings()


  const allRankings = [

    ...supabaseRankings,

    ...seedRankings

  ]

    .filter(

      (ranking, index, self) =>

        ranking &&

        index ===

          self.findIndex(

            item =>

              item.id === ranking.id

          )

    )


  return (

    allRankings.map(

      ranking => ({

        ...ranking,

        signals:

          getRankingSignals(

            ranking

          )

      })

    )

  )

}









export async function getUserRankings(

  userId: string

): Promise<Ranking[]> {


  const rankings =

    await getAllRankings()


  return rankings.filter(

    ranking =>

      ranking.creatorId === userId

  )

}









export async function createSupabaseRanking(

  ranking: Ranking,

  userId: string

) {


  console.log(

    "CREATE RANKING USER DEBUG",

    {

      userId,

      rankingId:

        ranking.id,

      parentId:

        ranking.parentId,

      rootId:

        ranking.rootId

    }

  )


  const {
    data,

    error

  } = await supabase

    .from("rankings")

    .insert({

      id:

        ranking.id,

      title:

        ranking.title,

      category:

        ranking.category,

      description:

        ranking.description,

      user_id:

        userId,

      views:

        0,

      parent_id:

        ranking.parentId ?? null,

      root_id:

        ranking.rootId ?? ranking.id

    })

    .select()

    .single()


  if (error) {


    console.error(

      "CREATE RANKING ERROR",

      error

    )


    throw error

  }


  const items =

    ranking.items.map(

      (item: RankingItem) => ({

        ranking_id:

          ranking.id,

        position:

          item.position,

        name:

          item.name,

        votes:

          item.votes ?? 0

      })

    )


  const {
    error: itemsError

  } = await supabase

    .from("ranking_items")

    .insert(items)


  if (itemsError) {


    console.error(

      "CREATE ITEMS ERROR",

      itemsError

    )


    throw itemsError

  }


  const tasteGraph =

    buildTasteGraph(

      userId,

      [

        ranking

      ]

    )


  await saveTasteGraph(

    tasteGraph

  )


  return data

}