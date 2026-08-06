import {
  Ranking
} from "@/types/ranking"

import {
  calculatePerspectiveScore
} from "@/utils/perspectiveScore"

import {
  calculateLivePerspectiveScore
} from "@/utils/livePerspectiveScore"





export type TasteGraphSignal = {

  uniqueness:number

  perspective:number

  confidence:number

  description:string

}









export function generateTasteGraphSignal(

  ranking:Ranking

):TasteGraphSignal {



  const liveScore =

    calculateLivePerspectiveScore(

      ranking

    )







  const perspective =

    calculatePerspectiveScore(

      ranking

    )








  const uniqueness =

    Math.min(

      ranking.items.length * 10,

      100

    )








  const confidence =

    Math.min(

      liveScore,

      100

    )








  let description =

    "Your ranking adds another perspective to the RANKD community."








  if(

    perspective >= 70

  ){

    description =

      "Your choices show a strong personal point of view."

  }








  if(

    uniqueness >= 70

  ){

    description =

      "Your ranking reveals a taste that stands apart from the crowd."

  }








  if(

    confidence >= 80

  ){

    description =

      "Your choices are becoming a recognised community preference."

  }








  return {


    uniqueness,


    perspective,


    confidence,


    description


  }


}