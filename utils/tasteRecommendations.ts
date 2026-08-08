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

  return Math.max(

    0,

    Math.min(

      Math.round(value),

      100

    )

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


function calculateFeedbackAdjustment(

  graph:TasteGraph,

  itemName:string

){

  const feedbackSignals =

    graph.signals.filter(

      signal =>

        signal.item

          .toLowerCase()

        ===

        itemName

          .toLowerCase()

        &&

        (

          signal.type ===

            "feedback_clicked"

          ||

          signal.type ===

            "feedback_ranked"

          ||

          signal.type ===

            "feedback_skipped"

          ||

          signal.type ===

            "feedback_disagreed"

        )

    )


  let adjustment = 0

  let positiveFeedback = 0

  let negativeFeedback = 0


  feedbackSignals.forEach(

    signal => {

      if(

        signal.type ===

          "feedback_clicked"

      ){

        adjustment +=

          signal.strength * 20

        positiveFeedback += 1

      }


      if(

        signal.type ===

          "feedback_ranked"

      ){

        adjustment +=

          signal.strength * 40

        positiveFeedback += 1

      }


      if(

        signal.type ===

          "feedback_skipped"

      ){

        adjustment -=

          signal.strength * 20

        negativeFeedback += 1

      }


      if(

        signal.type ===

          "feedback_disagreed"

      ){

        adjustment -=

          signal.strength * 40

        negativeFeedback += 1

      }

    }

  )


  return {

    adjustment,

    positiveFeedback,

    negativeFeedback

  }

}


function calculateDeclaredTasteStrength(

  graph:TasteGraph,

  itemName:string

){

  const tasteSignals =

    graph.signals.filter(

      signal =>

        signal.item

          .toLowerCase()

        ===

        itemName

          .toLowerCase()

        &&

        signal.type !==

          "feedback_clicked"

        &&

        signal.type !==

          "feedback_ranked"

        &&

        signal.type !==

          "feedback_skipped"

        &&

        signal.type !==

          "feedback_disagreed"

    )


  if(

    tasteSignals.length === 0

  ){

    return 0

  }


  return tasteSignals.reduce(

    (

      total,

      signal

    ) =>

      total +

      signal.strength,

    0

  )

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

        signal.category ===

        ranking.category

    )


  if(

    categorySignals.length

  ){

    score += 35


    reasons.push(

      "Matches categories you enjoy"

    )

  }


  ranking.items?.forEach(

    item => {


      const declaredStrength =

        calculateDeclaredTasteStrength(

          graph,

          item.name

        )


      if(

        declaredStrength > 0

      ){

        score +=

          declaredStrength * 50


        reasons.push(

          `Because you ranked ${item.name}`

        )

      }


      const feedback =

        calculateFeedbackAdjustment(

          graph,

          item.name

        )


      if(

        feedback.adjustment !== 0

      ){

        score +=

          feedback.adjustment


        if(

          feedback.positiveFeedback >

          feedback.negativeFeedback

        ){

          reasons.push(

            `Your previous choices suggest you like ${item.name}`

          )

        }


        if(

          feedback.negativeFeedback >

          feedback.positiveFeedback

        ){

          reasons.push(

            `Your previous choices suggest ${item.name} may not be for you`

          )

        }

      }

    }

  )


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


  if(

    curiosityBonus

  ){

    score +=

      curiosityBonus


    reasons.push(

      "Introduces a new taste direction"

    )

  }


  return {

    ranking,


    score:

      normalise(

        score

      ),


    reasons:

      [

        ...new Set(

          reasons

        )

      ]

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

        (

          a,

          b

        ) =>

          b.score -

          a.score

      )

  )

}