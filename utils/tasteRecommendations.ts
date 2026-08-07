import {
  Ranking
} from "@/types/ranking"


import {
  TasteGraph
} from "@/utils/tasteGraph"







export type TasteRecommendation = {

  ranking:Ranking

  score:number

  reasons:string[]

}









function normalise(

  value:number

){

  return Math.min(

    Math.round(value),

    100

  )

}









function alreadyRanked(

  graph:TasteGraph,

  ranking:Ranking

){



  return ranking.items.some(

    item =>

      graph.signals.some(

        signal =>


          signal.item

          .toLowerCase()

          ===

          item.name

          .toLowerCase()

      )

  )


}









function calculateCuriosityBonus(

  graph:TasteGraph,

  ranking:Ranking

){



  const knownCategories =

    new Set(

      graph.signals.map(

        signal =>

          signal.category

      )

    )







  if(

    knownCategories.has(

      ranking.category

    )

  ){

    return 0

  }







  return 10

}









export function calculateTasteRecommendationScore(

  graph:TasteGraph,

  ranking:Ranking

):TasteRecommendation {



  let score = 0


  const reasons:string[] = []









  if(

    alreadyRanked(

      graph,

      ranking

    )

  ){



    score -= 50



    reasons.push(

      "You have already explored similar choices"

    )



  }









  const categorySignals =

    graph.signals.filter(

      signal =>

        signal.category === ranking.category

    )









  if(categorySignals.length){



    score += 35



    reasons.push(

      "Matches categories you enjoy"

    )



  }









  ranking.items?.forEach(item=>{



    const match =

      graph.signals.find(

        signal =>


          signal.item

          .toLowerCase()

          ===

          item.name

          .toLowerCase()

      )









    if(match){



      score +=

        match.strength * 50



      reasons.push(

        `Because you ranked ${item.name}`

      )



    }



  })









  if(

    graph.behaviour.averagePosition <= 3

  ){



    score += 15



    reasons.push(

      "Fits your decisive ranking style"

    )



  }









  const curiosityBonus =

    calculateCuriosityBonus(

      graph,

      ranking

    )









  if(curiosityBonus){



    score += curiosityBonus



    reasons.push(

      "Introduces a new taste direction"

    )



  }









  return {


    ranking,


    score:

      normalise(score),


    reasons:

      [...new Set(reasons)]



  }



}









export function getTasteRecommendedRankings(

  graph:TasteGraph,

  rankings:Ranking[]

):TasteRecommendation[]{



  return (

    rankings

      .map(

        ranking =>

          calculateTasteRecommendationScore(

            graph,

            ranking

          )

      )


      .filter(

        recommendation =>

          recommendation.score > 0

      )


      .sort(

        (a,b)=>

          b.score -

          a.score

      )

  )


}