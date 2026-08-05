import {
  calculateDebateScore
} from "@/utils/debateScore"

import {
  calculatePerspectiveScore
} from "@/utils/perspectiveScore"

import {
  calculateLivePerspectiveScore
} from "@/utils/livePerspectiveScore"





export function calculateRankdScore(

  ranking:any

){


  const liveScore =

    calculateLivePerspectiveScore(

      ranking

    )





  const debateHeat =

    calculateDebateScore(

      ranking

    )





  const perspectiveScore =

    calculatePerspectiveScore(

      ranking

    )





  const views =

    ranking.views ?? 0








  const normalisedViews =

    Math.min(

      views,

      1000

    )









  return Math.round(

    (

      perspectiveScore * 0.35

    )

    +

    (

      debateHeat * 0.30

    )

    +

    (

      liveScore * 0.20

    )

    +

    (

      normalisedViews * 0.15

    )

  )


}