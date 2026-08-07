import {
  TasteGraph
} from "@/utils/tasteGraph"


import {
  TasteGraphSignal
} from "@/utils/tasteGraphSignal"









type TasteIdentitySource =

  | TasteGraph

  | TasteGraphSignal









export type TasteIdentity = {

  title:string

  description:string

  categories:string[]

  traits:string[]

  stats:{

    uniqueness:number

    decisiveness:number

    exploration:number

  }

}









function normalise(

  value:number

){

  return Math.min(

    Math.round(value),

    100

  )

}









function getCategories(

  graph:TasteGraph

){

  return [

    ...new Set(

      graph.signals

        .map(

          signal =>

            signal.category

        )

        .filter(Boolean)

    )

  ]

  .slice(

    0,

    5

  )

}









export function generateTasteIdentity(

  source:TasteIdentitySource

):TasteIdentity {



  const isGraph =

    "signals" in source







  const uniqueness =

    normalise(

      isGraph

      ?

      source.behaviour.uniqueness * 100

      :

      source.uniqueness

    )









  const decisiveness =

    normalise(

      isGraph

      ?

      source.behaviour.topChoiceRate * 100

      :

      source.confidence

    )









  const exploration =

    normalise(

      isGraph

      ?

      Math.min(

        source.behaviour.totalRankings * 10,

        100

      )

      :

      source.perspective

    )









  const categories =

    isGraph

    ?

    getCategories(

      source

    )

    :

    []









  let title =

    "Curious Explorer"









  let description =

    "Your rankings are building a unique taste profile through the choices you make."









  const traits:string[] = []









  if(

    uniqueness >= 70

  ){


    title =

      "Independent Tastemaker"



    description =

      "Your choices frequently stand apart from the crowd, revealing a distinctive perspective."



    traits.push(

      "Original"

    )


  }









  else if(

    decisiveness >= 70

  ){


    title =

      "Opinion Shaper"



    description =

      "Your rankings show strong personal judgement and create interesting points of comparison."



    traits.push(

      "Decisive"

    )


  }









  else if(

    exploration >= 70

  ){


    title =

      "Taste Explorer"



    description =

      "You discover widely across different areas and build a broad perspective."



    traits.push(

      "Curious"

    )


  }









  else {


    traits.push(

      "Developing"

    )


  }









  if(

    decisiveness >= 70

  ){

    traits.push(

      "Confident"

    )

  }









  if(

    exploration >= 70

  ){

    traits.push(

      "Adventurous"

    )

  }









  if(

    uniqueness >= 70

  ){

    traits.push(

      "Independent"

    )

  }









  return {


    title,


    description,


    categories,


    traits:

      [

        ...new Set(

          traits

        )

      ],



    stats:{


      uniqueness,


      decisiveness,


      exploration


    }


  }


}