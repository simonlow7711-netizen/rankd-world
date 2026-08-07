import {
  Ranking
} from "@/types/ranking"

import {
  generateTasteGraphSignal,
  TasteGraphSignal
} from "@/utils/tasteGraphSignal"







export type TasteInsight = {

  title:string

  description:string

  signal:TasteGraphSignal

}









export function generateTasteInsight(

  ranking:Ranking

):TasteInsight {



  const signal =

    generateTasteGraphSignal(

      ranking

    )







  let title =

    "Your taste signal"




  let description =

    "This RANKD adds another perspective to the global Taste Graph."









  if(

    signal.uniqueness >= 70

  ){


    title =

      "Distinctive taste"



    description =

      "Your choices reveal a perspective that stands apart from the crowd."

  }









  else if(

    signal.perspective >= 70

  ){


    title =

      "Strong point of view"



    description =

      "Your ranking shows a clear opinion that may challenge other people's rankings."

  }









  else if(

    signal.confidence >= 80

  ){


    title =

      "Recognised preference"



    description =

      "Your ranking aligns with patterns emerging across the RANKD community."

  }









  return {


    title,


    description,


    signal


  }


}









export function mergeTasteInsights(

  insights:TasteInsight[] = []

){



  if(

    insights.length === 0

  ){


    return {

      title:

        "Growing taste profile",


      description:

        "Create more RANKDs to build your Taste Graph."

    }


  }







  const average = (

    values:number[]

  ) =>


    values.reduce(

      (

        sum,

        value

      )=>

        sum + value,

      0

    )

    /

    values.length







  const uniqueness =

    average(

      insights.map(

        insight =>

          insight.signal.uniqueness

      )

    )







  const perspective =

    average(

      insights.map(

        insight =>

          insight.signal.perspective

      )

    )







  if(

    uniqueness >= 70

  ){


    return {

      title:

        "Independent taste",


      description:

        "Your overall Taste Graph shows a strong tendency toward original choices."

    }


  }









  if(

    perspective >= 70

  ){


    return {

      title:

        "Opinion leader",


      description:

        "Your rankings consistently create points of discussion."

    }


  }









  return {

    title:

      "Developing taste profile",


    description:

      "Your rankings are helping build your individual taste intelligence."

  }


}