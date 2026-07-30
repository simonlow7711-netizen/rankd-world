import { Ranking } from "@/types/ranking"
import { calculatePerspectiveGap } from "@/utils/perspectiveGap"



export function getPerspectiveGaps(
  rankings: Ranking[]
) {


  const gaps:any[] = []




  const remixes = rankings.filter(

    ranking => ranking.remixedFrom

  )






  remixes.forEach((remix)=>{


    const original = rankings.find(

      ranking =>
        ranking.id === remix.remixedFrom

    )



    if(!original) return






    const differences =
      calculatePerspectiveGap(
        original,
        remix
      )





    if(differences.length){


      gaps.push({

        ranking: original,

        gap: differences[0],

        remix

      })


    }



  })






  return gaps.sort(

    (a,b)=>

      b.gap.difference -
      a.gap.difference

  ).slice(0,6)



}