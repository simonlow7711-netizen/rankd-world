import {
  Ranking
} from "@/types/ranking"


import {
  calculateLivePerspectiveScore
} from "@/utils/livePerspectiveScore"


import {
  calculatePerspectiveScore
} from "@/utils/perspectiveScore"









export function getRemixCount(

  rankings: Ranking[] = [],

  id: string

) {


  return rankings.filter(

    ranking =>

      ranking.parentId === id

  ).length


}









export function getConversationCount(

  rankings: Ranking[] = [],

  id: string

) {


  return rankings.filter(

    ranking =>

      ranking.rootId === id

  ).length


}









export function getRootRanking(

  rankings: Ranking[] = [],

  id: string

): Ranking | null {


  const ranking =

    rankings.find(

      item =>

        item.id === id

    )





  if (!ranking) {

    return null

  }







  const rootId =

    ranking.rootId ??

    ranking.id







  return (

    rankings.find(

      item =>

        item.id === rootId

    )

    ??

    ranking

  )


}









/**
 * Calculate a ranking's recent activity momentum.
 *
 * Trending is intentionally different from Latest.
 *
 * Latest:
 *   newest createdAt first.
 *
 * Trending:
 *   recent activity + engagement,
 *   weighted by how recently the ranking appeared.
 *
 * This prevents Trending from simply becoming
 * another chronological list.
 */
export function calculateRankingMomentum(

  ranking: Ranking

) {


  const views =

    Number(

      ranking.views ??

      0

    )


  const remixCount =

    Number(

      ranking.remixes ??

      0

    )


  const liveScore =

    Number(

      ranking.signals
        ?.liveScore ??

      calculateLivePerspectiveScore(

        ranking

      )

    )


  const createdAt =

    ranking.createdAt

      ? new Date(
          ranking.createdAt
        ).getTime()

      : 0


  const now =

    Date.now()


  const ageHours =

    createdAt > 0

      ? Math.max(

          1,

          (
            now -
            createdAt
          ) /
          (
            1000 *
            60 *
            60
          )

        )

      : 168


  /**
   * Recent rankings receive more weight.
   *
   * The decay is deliberately gentle so that
   * a genuinely active ranking can remain
   * trending beyond its first few hours.
   */
  const recencyMultiplier =

    Math.max(

      0.2,

      1 /
      Math.sqrt(
        ageHours
      )

    )


  /**
   * Views provide the basic attention signal.
   *
   * Remixes are weighted more heavily because
   * they represent an active decision rather
   * than passive viewing.
   *
   * Live score represents current activity
   * and attention around the ranking.
   */
  const activityScore =

    (
      views * 0.4
    )

    +

    (
      remixCount * 20 * 0.3
    )

    +

    (
      liveScore * 0.3
    )


  return (

    activityScore *

    recencyMultiplier

  )

}









export function getTrendingRankings(

  rankings: Ranking[] = []

) {


  return (

    [...rankings]

      .map(

        ranking => ({

          ranking,

          momentum:

            calculateRankingMomentum(

              ranking

            ),

          perspectiveScore:

            calculateLivePerspectiveScore(

              ranking

            )

        })

      )

      .sort(

        (
          a,
          b
        ) => {

          /**
           * Primary ordering:
           *
           * Recent activity momentum.
           */
          if (
            b.momentum !==
            a.momentum
          ) {

            return (

              b.momentum -
              a.momentum

            )

          }


          /**
           * Secondary ordering:
           *
           * Live perspective score.
           *
           * This helps break ties where
           * momentum is identical.
           */
          if (
            b.perspectiveScore !==
            a.perspectiveScore
          ) {

            return (

              b.perspectiveScore -
              a.perspectiveScore

            )

          }


          /**
           * Final fallback:
           *
           * Newer rankings first.
           *
           * This prevents completely
           * inactive rankings from producing
           * unstable ordering.
           */
          const dateA =

            new Date(

              a.ranking.createdAt ??

              0

            ).getTime()


          const dateB =

            new Date(

              b.ranking.createdAt ??

              0

            ).getTime()


          return (

            dateB -
            dateA

          )

        }

      )

      .map(

        entry =>

          entry.ranking

      )

  )


}









export function getLatestRankings(

  rankings: Ranking[] = []

) {


  return (

    [...rankings]

      .sort(

        (a, b) => {

          const dateA =

            new Date(

              a.createdAt ??

              0

            ).getTime()


          const dateB =

            new Date(

              b.createdAt ??

              0

            ).getTime()


          return (

            dateB -
            dateA

          )

        }

      )

  )


}









export function getBiggestDebates(

  rankings: Ranking[] = []

) {


  return (

    [...rankings]

      .map(

        ranking => ({

          ranking,

          perspectiveScore:

            ranking.signals
              ?.perspectiveScore ??

            calculatePerspectiveScore(

              ranking

            )

        })

      )

      .sort(

        (a, b) =>

          b.perspectiveScore -

          a.perspectiveScore

      )

      .map(

        entry =>

          entry.ranking

      )

  )


}









export function getMostRemixedRankings(

  rankings: Ranking[] = []

) {


  return (

    [...rankings]

      .map(

        ranking => ({

          ...ranking,

          remixCount:

            getRemixCount(

              rankings,

              ranking.id

            )

        })

      )

      .sort(

        (a, b) =>

          b.remixCount -

          a.remixCount

      )

  )


}









export function getPerspectiveGaps(

  rankings: Ranking[] = []

) {


  return (

    [...rankings]

      .filter(

        ranking =>

          getRemixCount(

            rankings,

            ranking.id

          ) > 0

      )

      .map(

        ranking => ({

          ranking,

          remixCount:

            getRemixCount(

              rankings,

              ranking.id

            ),

          conversationSize:

            getConversationCount(

              rankings,

              ranking.id

            )

        })

      )

      .sort(

        (a, b) =>

          b.conversationSize -

          a.conversationSize

      )

  )


}









export function getRankingsByCategory(

  rankings: Ranking[] = [],

  category: string

) {


  return rankings.filter(

    ranking =>

      ranking.category === category

  )

}









export function getTopCreators(

  rankings: Ranking[] = []

) {


  const creators:

    Record<
      string,
      number
    > = {}





  rankings.forEach(

    ranking => {

      const creator =

        ranking.creatorId ??

        ranking.creator ??

        "anonymous"


      creators[creator] =

        (
          creators[creator] ??

          0
        )

        +

        1

    }

  )









  return Object.entries(

    creators

  )

    .map(

      ([creator, count]) => ({

        creator,

        count

      })

    )

    .sort(

      (a, b) =>

        b.count -

        a.count

    )


}