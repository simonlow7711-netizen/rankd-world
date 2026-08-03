import {
  calculateTasteDNA
} from "./tasteProfile"







export function calculateTasteMatch(

  rankings:any[] = []

){



  const safeRankings =

    rankings ?? []







  const tasteDNA =

    calculateTasteDNA(

      safeRankings

    )








  const categories =

    Object.entries(

      tasteDNA

    )







  if(categories.length === 0){


    return {

      score:0,

      label:"No match yet",

      sharedCategories:[]

    }


  }








  const sortedCategories =

    categories

    .sort(

      (
        [,a],

        [,b]

      ) =>

        Number(b) -

        Number(a)

    )








  const topCategories =

    sortedCategories

    .slice(

      0,

      3

    )

    .map(

      ([category])=>

        category

    )








  const score =

    Math.min(

      100,

      Math.round(

        (

          topCategories.length /

          categories.length

        )

        *

        100

      )

    )









  return {


    score,


    label:

      score >= 70

      ?

      "Strong taste match"

      :

      score >= 40

      ?

      "Similar tastes"

      :

      "Different perspectives",



    sharedCategories:

      topCategories


  }


}