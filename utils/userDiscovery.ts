import {
  supabase
} from "@/utils/supabase"


import {
  Ranking,
  RankingItem
} from "@/types/ranking"


import {
  calculateTasteDNA
} from "@/utils/tasteProfile"


import {
  findSimilarTasteUsers
} from "@/utils/tasteGraphQueries"


type RankingRow = {

  id: string

  title: string

  category: string | null

  description: string | null

  user_id: string

  created_at: string | null

  parent_id: string | null

  root_id: string | null

  views: number | null

}


type RankingItemRow = {

  ranking_id: string

  position: number

  name: string

  votes: number | null

}


function mapRanking(

  row: RankingRow,

  items: RankingItem[]

): Ranking {

  return {

    id:
      row.id,

    title:
      row.title,

    category:
      row.category ?? "General",

    creator:
      undefined,

    creatorId:
      row.user_id,

    creatorUsername:
      undefined,

    creatorDisplayName:
      undefined,

    description:
      row.description ?? "",

    items,

    createdAt:
      row.created_at ?? undefined,

    views:
      row.views ?? 0,

    parentId:
      row.parent_id ?? null,

    rootId:
      row.root_id ?? null,

    source:
      "community"

  }

}


async function getRankingItems(

  rankingIds: string[]

): Promise<Map<string, RankingItem[]>> {

  const itemMap =

    new Map<string, RankingItem[]>()


  if (

    rankingIds.length === 0

  ) {

    return itemMap

  }


  const {

    data: items,

    error

  } = await supabase

    .from("ranking_items")

    .select(

      `
      ranking_id,
      position,
      name,
      votes
      `

    )

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


  if (error) {

    console.error(

      "Ranking items lookup error:",

      JSON.stringify(

        error,

        null,

        2

      )

    )


    return itemMap

  }


  ;(items ?? []).forEach(

    item => {

      const row =

        item as RankingItemRow


      if (

        !itemMap.has(

          row.ranking_id

        )

      ) {

        itemMap.set(

          row.ranking_id,

          []

        )

      }


      itemMap

        .get(

          row.ranking_id

        )!

        .push({

          position:
            row.position,

          name:
            row.name,

          votes:
            row.votes ?? 0

        })

    }

  )


  return itemMap

}


export async function getDiscoverableUsers(

  currentUserId: string,

  currentRankings: Ranking[] = []

) {


  const {

    data: profiles,

    error

  } = await supabase

    .from("profiles")

    .select(

      `
      id,
      username,
      display_name
      `

    )

    .limit(50)


  if (

    error ||

    !profiles

  ) {

    console.error(

      "Discoverable users error:",

      JSON.stringify(

        error,

        null,

        2

      )

    )


    return []

  }


  const currentTasteDNA =

    calculateTasteDNA(

      currentRankings

    )


  const graphMatches =

    await findSimilarTasteUsers(

      currentUserId,

      50

    )


  const users =

    await Promise.all(

      profiles

        .filter(

          profile =>

            profile.id !==

            currentUserId

        )

        .map(

          async profile => {


            const {

              data: rankings,

              error: rankingError

            } = await supabase

              .from("rankings")

              .select(

                `
                id,
                title,
                category,
                description,
                user_id,
                created_at,
                parent_id,
                root_id,
                views
                `

              )

              .eq(

                "user_id",

                profile.id

              )


            if (rankingError) {

              console.error(

                "Ranking lookup error:",

                JSON.stringify(

                  rankingError,

                  null,

                  2

                )

              )

            }


            const rankingRows =

              (

                rankings ?? []

              ) as RankingRow[]


            const rankingIds =

              rankingRows.map(

                ranking =>

                  ranking.id

              )


            const itemMap =

              await getRankingItems(

                rankingIds

              )


            const userRankings =

              rankingRows.map(

                ranking =>

                  mapRanking(

                    ranking,

                    itemMap.get(

                      ranking.id

                    ) ?? []

                  )

              )


            const userTasteDNA =

              calculateTasteDNA(

                userRankings

              )


            const graphMatch =

              graphMatches.find(

                match =>

                  match.userId ===

                  profile.id

              )


            const tasteMatch = {

              score:

                graphMatch

                  ?

                  Math.round(

                    graphMatch.score *

                    100

                  )

                  :

                  0

            }


            return {

              id:
                profile.id,

              username:
                profile.username,

              displayName:
                profile.display_name,

              rankings:
                userRankings,

              tasteDNA:
                userTasteDNA,

              currentTasteDNA,

              tasteMatch

            }

          }

        )

    )


  return users

    .filter(

      user =>

        user.rankings.length > 0

    )

    .sort(

      (

        a,

        b

      ) =>

        b.tasteMatch.score -

        a.tasteMatch.score

    )

}