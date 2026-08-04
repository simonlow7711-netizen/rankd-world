import {
  Ranking
} from "@/types/ranking"

import {
  calculatePerspectiveScore
} from "@/utils/perspectiveScore"







export function getInterestingPerspectives(

  rankings:Ranking[] = []

){



  return rankings

    .map((ranking)=>({



      ranking,



      score:

        calculatePerspectiveScore(

          ranking

        )



    }))



    .sort(

      (a,b)=>

        b.score -

        a.score

    )



    .slice(

      0,

      5

    )


}








// Backwards compatibility
// Existing components can continue using getPerspectiveGaps

export const getPerspectiveGaps =

  getInterestingPerspectives