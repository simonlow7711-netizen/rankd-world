import { Ranking } from "@/types/ranking"





export function getRemixCount(

  rankings: Ranking[],

  id: string

) {


  return rankings.filter(

    ranking =>

      ranking.originalId === id

  ).length


}









export function getTrendingRankings(

  rankings: Ranking[]

) {


  return [...rankings]

    .sort(

      (a,b) =>

        (b.signals?.rankdScore ?? 0)

        -

        (a.signals?.rankdScore ?? 0)

    )

    .slice(0,3)


}









export function getLatestRankings(

  rankings: Ranking[]

) {


  return [...rankings]

    .sort(

      (a,b) =>

        new Date(

          b.createdAt || 0

        ).getTime()

        -

        new Date(

          a.createdAt || 0

        ).getTime()

    )

    .slice(0,3)


}









export function getBiggestDebates(

  rankings: Ranking[]

) {


  return rankings

    .sort(

      (a,b) =>

        (b.signals?.debateHeat ?? 0)

        -

        (a.signals?.debateHeat ?? 0)

    )

    .slice(0,3)


}