import {
  Ranking
} from "@/types/ranking"


import {
  calculatePerspectiveScore
} from "@/utils/perspectiveScore"


import {
  calculateLivePerspectiveScore
} from "@/utils/livePerspectiveScore"





export function calculateRankdScore(

  ranking: Ranking

) {


  const liveScore =

    calculateLivePerspectiveScore(

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

      perspectiveScore * 0.50

    )

    +

    (

      liveScore * 0.30

    )

    +

    (

      normalisedViews * 0.20

    )

  )


}