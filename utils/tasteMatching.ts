import { calculateTasteDNA } from "@/utils/tasteProfile"



export function calculateTasteMatch(

  rankingsA:any[],

  rankingsB:any[]

){


  const tasteA =
    calculateTasteDNA(rankingsA)



  const tasteB =
    calculateTasteDNA(rankingsB)





  const categoriesA =
    tasteA.tasteDNA.map(

      item => item.category

    )





  const categoriesB =
    tasteB.tasteDNA.map(

      item => item.category

    )






  const shared =

    categoriesA.filter(

      category =>
        categoriesB.includes(category)

    )






  const totalCategories =

    new Set([

      ...categoriesA,

      ...categoriesB

    ]).size






  const score =

    totalCategories === 0

      ? 0

      :

      Math.round(

        (shared.length /
          totalCategories)

          * 100

      )






  return {


    score,


    sharedCategories: shared


  }


}