import {
  Ranking
} from "@/types/ranking"





export interface TasteInsight {

  title:string

  description:string

  type:
    |
    "unique"
    |
    "consensus"
    |
    "strong-choice"
    |
    "standard"

}









export function generateTasteInsight(

  ranking:Ranking

):TasteInsight {



  const items =

    ranking.items || []





  const topItem =

    items[0]









  if(

    topItem

  ){

    return {


      title:

        "Strong point of view 🔥",



      description:

        `Your #1 choice is ${topItem.name}. This ranking shows a clear personal preference.`,



      type:

        "strong-choice"


    }

  }









  if(

    items.length === 7

  ){

    return {


      title:

        "Your taste has a shape",



      description:

        "Your Top 7 creates a unique pattern of choices that can be compared with the community.",



      type:

        "unique"


    }

  }









  return {


    title:

      "Your ranking is live",



    description:

      "Your choices have been added to the RANKD community.",



    type:

      "standard"


  }


}