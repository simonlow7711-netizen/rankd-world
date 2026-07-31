import { Ranking } from "@/types/ranking"

import {
  calculatePerspectiveScore
} from "@/utils/perspectiveScore"





export function getPerspectiveGaps(

  rankings: Ranking[]

){


  return rankings

    .map((ranking)=>({


      ranking,


      gap:

        calculatePerspectiveScore(

          ranking

        )


    }))


    .sort(

      (a,b)=>

        b.gap -

        a.gap

    )


    .slice(

      0,

      5

    )


}