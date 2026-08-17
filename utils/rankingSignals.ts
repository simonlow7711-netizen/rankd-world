import {
  Ranking
} from "@/types/ranking"


import {
  calculateLivePerspectiveScore
} from "@/utils/livePerspectiveScore"


import {
  calculatePerspectiveScore
} from "@/utils/perspectiveScore"


import {
  calculateRankdScore
} from "@/utils/rankdScore"





export function getRankingSignals(

  ranking: Ranking

) {


  return {


    rankdScore:

      calculateRankdScore(

        ranking

      ),





    liveScore:

      calculateLivePerspectiveScore(

        ranking

      ),





    perspectiveScore:

      calculatePerspectiveScore(

        ranking

      ),





    views:

      ranking.views ?? 0





  }

}