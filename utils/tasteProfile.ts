import {
  Ranking
} from "@/types/ranking"





export type TasteDNA = {

  [category:string]:number

}








export function calculateTasteDNA(

  rankings:Ranking[] = []

):TasteDNA {



  const categories:TasteDNA = {}







  rankings.forEach((ranking)=>{



    const category =

      ranking.category ||

      "General"







    categories[category] =

      (

        categories[category] ||

        0

      )

      +

      1





  })







  return categories


}