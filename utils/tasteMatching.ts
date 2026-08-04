import {
  TasteDNA
} from "@/utils/tasteProfile"





export function calculateTasteMatch(

  dnaA:TasteDNA = {},

  dnaB:TasteDNA = {}

){



  const safeDnaA =

    dnaA ?? {}



  const safeDnaB =

    dnaB ?? {}







  const categories =

    new Set([

      ...Object.keys(safeDnaA),

      ...Object.keys(safeDnaB)

    ])







  if(categories.size === 0){


    return {

      score:0,

      label:"No match yet",

      sharedCategories:[]

    }


  }







  let difference = 0



  const sharedCategories:string[] = []







  categories.forEach(category=>{


    const a =

      safeDnaA[category] ?? 0




    const b =

      safeDnaB[category] ?? 0





    if(

      a > 0 &&

      b > 0

    ){


      sharedCategories.push(

        category

      )


    }







    difference +=

      Math.abs(

        a - b

      )



  })







  const score =

    Math.max(

      0,

      Math.min(

        100,

        100 -

        Math.round(

          difference /

          categories.size

        )

      )

    )







  return {


    score,



    label:

      score >= 80

      ?

      "Strong taste alignment"

      :

      score >= 60

      ?

      "Similar perspectives"

      :

      "Different perspectives",




    sharedCategories


  }


}