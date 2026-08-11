import {
  Ranking
} from "@/types/ranking"





export function calculateLivePerspectiveScore(

  ranking: Ranking

) {


  const views =

    ranking.views ?? 0





  const createdAt =

    ranking.createdAt





  const ageHours =

    createdAt

      ?

      Math.max(

        1,

        (

          Date.now()
          -
          new Date(
            createdAt
          ).getTime()

        )
        /
        (
          1000
          *
          60
          *
          60
        )

      )

      :

      24





  const itemsCount =

    ranking.items?.length ?? 0





  const completionScore =

    itemsCount >= 7

      ? 10

      : itemsCount





  const freshnessScore =

    Math.max(

      0,

      24 - ageHours

    )





  const velocityScore =

    views / ageHours





  return Math.round(

    velocityScore
    +
    completionScore
    +
    freshnessScore

  )

}