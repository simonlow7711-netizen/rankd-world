import {
  Ranking
} from "@/types/ranking"


import {
  TasteGraph
} from "@/utils/tasteGraph"


export type TasteRecommendation = {

  ranking: Ranking

  score: number

  reasons: string[]

}


function normalise(

  value: number

) {

  return Math.max(

    0,

    Math.min(

      Math.round(value),

      100

    )

  )

}


function normaliseItem(

  value: string

) {

  return value

    .toLowerCase()

    .trim()

}


function getItemSignals(

  graph: TasteGraph,

  itemName: string

) {

  const normalisedItem =

    normaliseItem(

      itemName

    )


  return graph.signals.filter(

    signal =>

      normaliseItem(

        signal.item

      ) ===

      normalisedItem

  )

}


function getCategorySignals(

  graph: TasteGraph,

  category: string

) {

  return graph.signals.filter(

    signal =>

      signal.category ===

      category

  )

}


function hasAlreadyRankedItem(

  graph: TasteGraph,

  itemName: string

) {

  return getItemSignals(

    graph,

    itemName

  ).length > 0

}


function hasAlreadyInteractedWithRanking(

  graph: TasteGraph,

  rankingId: string

) {

  if (!rankingId) {

    return false

  }


  return graph.signals.some(

    signal =>

      signal.source ===

      rankingId

  )

}


function isOwnRanking(

  graph: TasteGraph,

  ranking: Ranking

) {

  return (

    ranking.creatorId ===

    graph.userId

  )

}


function isNewRecommendation(

  graph: TasteGraph,

  ranking: Ranking

) {

  if (

    isOwnRanking(

      graph,

      ranking

    )

  ) {

    return false

  }


  if (

    hasAlreadyInteractedWithRanking(

      graph,

      ranking.id

    )

  ) {

    return false

  }


  return true

}


function calculateDirectTasteMatch(

  graph: TasteGraph,

  itemName: string

) {

  const signals =

    getItemSignals(

      graph,

      itemName

    )


  if (

    signals.length === 0

  ) {

    return {

      score: 0,

      strongestPosition: null

    }

  }


  const tasteSignals =

    signals.filter(

      signal =>

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


  if (

    tasteSignals.length === 0

  ) {

    return {

      score: 0,

      strongestPosition: null

    }

  }


  const strongestSignal =

    tasteSignals.reduce(

      (

        strongest,

        signal

      ) =>

        signal.strength >

        strongest.strength

          ? signal

          : strongest,

      tasteSignals[0]

    )


  let score =

    strongestSignal.strength * 50


  if (

    strongestSignal.position === 1

  ) {

    score += 20

  }

  else if (

    strongestSignal.position === 2

  ) {

    score += 15

  }

  else if (

    strongestSignal.position === 3

  ) {

    score += 10

  }


  return {

    score,

    strongestPosition:

      strongestSignal.position

  }

}


function calculateCategoryAffinity(

  graph: TasteGraph,

  category: string

) {

  const categorySignals =

    getCategorySignals(

      graph,

      category

    )


  if (

    categorySignals.length === 0

  ) {

    return {

      score: 0,

      signalCount: 0

    }

  }


  const uniqueRankings =

    new Set(

      categorySignals.map(

        signal =>

          signal.source

      )

    )


  const categoryStrength =

    categorySignals.reduce(

      (

        total,

        signal

      ) =>

        total +

        signal.strength,

      0

    )


  const averageStrength =

    categorySignals.length > 0

      ?

      categoryStrength /

      categorySignals.length

      :

      0


  let score =

    Math.min(

      uniqueRankings.size * 8,

      24

    )


  score +=

    Math.min(

      averageStrength * 20,

      20

    )


  return {

    score,

    signalCount:

      categorySignals.length

  }

}


function calculateNovelty(

  graph: TasteGraph,

  ranking: Ranking

) {

  const rankedItems =

    ranking.items.filter(

      item =>

        hasAlreadyRankedItem(

          graph,

          item.name

        )

    )


  if (

    ranking.items.length === 0

  ) {

    return {

      score: 0,

      newItems: 0,

      knownItems: 0

    }

  }


  const newItems =

    ranking.items.length -

    rankedItems.length


  const knownItems =

    rankedItems.length


  if (

    knownItems ===

    ranking.items.length

  ) {

    return {

      score: -25,

      newItems,

      knownItems

    }

  }


  const noveltyRatio =

    newItems /

    ranking.items.length


  const score =

    noveltyRatio * 15


  return {

    score,

    newItems,

    knownItems

  }

}


function calculateTasteNeighbourBonus(

  graph: TasteGraph,

  ranking: Ranking

) {

  const categorySignals =

    getCategorySignals(

      graph,

      ranking.category

    )


  if (

    categorySignals.length === 0

  ) {

    return {

      score: 0,

      active: false

    }

  }


  const categoryRankings =

    new Set(

      categorySignals.map(

        signal =>

          signal.source

      )

    )


  const averagePosition =

    categorySignals.reduce(

      (

        total,

        signal

      ) =>

        total +

        signal.position,

      0

    )

    /

    categorySignals.length


  let score =

    Math.min(

      categoryRankings.size * 5,

      15

    )


  if (

    averagePosition <= 3

  ) {

    score += 10

  }

  else if (

    averagePosition <= 4

  ) {

    score += 5

  }


  return {

    score,

    active: true

  }

}


function calculateFeedbackAdjustment(

  graph: TasteGraph,

  itemName: string

) {

  const feedbackSignals =

    graph.signals.filter(

      signal =>

        normaliseItem(

          signal.item

        ) ===

        normaliseItem(

          itemName

        )

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

      if (

        signal.type ===

          "feedback_clicked"

      ) {

        adjustment +=

          signal.strength * 10

        positiveFeedback += 1

      }


      if (

        signal.type ===

          "feedback_ranked"

      ) {

        adjustment +=

          signal.strength * 30

        positiveFeedback += 1

      }


      if (

        signal.type ===

          "feedback_skipped"

      ) {

        adjustment -=

          signal.strength * 15

        negativeFeedback += 1

      }


      if (

        signal.type ===

          "feedback_disagreed"

      ) {

        adjustment -=

          signal.strength * 30

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


function calculateRecommendationScore(

  graph: TasteGraph,

  ranking: Ranking

): TasteRecommendation {


  let score = 0

  const reasons: string[] = []


  /*
   *
   * 1. DIRECT TASTE MATCH
   *
   */


  ranking.items.forEach(

    item => {

      const directMatch =

        calculateDirectTasteMatch(

          graph,

          item.name

        )


      if (

        directMatch.score > 0

      ) {

        score +=

          directMatch.score


        if (

          directMatch.strongestPosition === 1

        ) {

          reasons.push(

            `Matches your #1 choice: ${item.name}`

          )

        }

        else if (

          directMatch.strongestPosition !== null

          &&

          directMatch.strongestPosition <= 3

        ) {

          reasons.push(

            `You ranked ${item.name} highly`

          )

        }

        else {

          reasons.push(

            `You have ranked ${item.name}`

          )

        }

      }


      const feedback =

        calculateFeedbackAdjustment(

          graph,

          item.name

        )


      if (

        feedback.adjustment !== 0

      ) {

        score +=

          feedback.adjustment


        if (

          feedback.positiveFeedback >

          feedback.negativeFeedback

        ) {

          reasons.push(

            `Your previous choices suggest you like ${item.name}`

          )

        }


        if (

          feedback.negativeFeedback >

          feedback.positiveFeedback

        ) {

          reasons.push(

            `Your previous choices suggest ${item.name} may not be for you`

          )

        }

      }

    }

  )


  /*
   *
   * 2. CATEGORY AFFINITY
   *
   */


  const categoryAffinity =

    calculateCategoryAffinity(

      graph,

      ranking.category

    )


  if (

    categoryAffinity.score > 0

  ) {

    score +=

      categoryAffinity.score


    reasons.push(

      `Matches your interest in ${ranking.category}`

    )

  }


  /*
   *
   * 3. TASTE-NEIGHBOUR DISCOVERY
   *
   */


  const neighbourBonus =

    calculateTasteNeighbourBonus(

      graph,

      ranking

    )


  if (

    neighbourBonus.active

  ) {

    score +=

      neighbourBonus.score


    reasons.push(

      "Explores a direction close to your taste"

    )

  }


  /*
   *
   * 4. NOVELTY
   *
   */


  const novelty =

    calculateNovelty(

      graph,

      ranking

    )


  score +=

    novelty.score


  if (

    novelty.newItems > 0

  ) {

    reasons.push(

      "Introduces new choices for you to discover"

    )

  }


  /*
   *
   * 5. DECISIVENESS
   *
   */


  if (

    graph.behaviour.averagePosition > 0

    &&

    graph.behaviour.averagePosition <= 3

  ) {

    score += 5

    reasons.push(

      "Fits your decisive ranking style"

    )

  }


  /*
   *
   * 6. NEW CATEGORY CURIOSITY
   *
   */


  const categorySignals =

    getCategorySignals(

      graph,

      ranking.category

    )


  if (

    categorySignals.length === 0

  ) {

    score += 8

    reasons.push(

      "Introduces a new taste direction"

    )

  }


  /*
   *
   * FINAL SCORE
   *
   */


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


export function calculateTasteRecommendationScore(

  graph: TasteGraph,

  ranking: Ranking

): TasteRecommendation {

  return calculateRecommendationScore(

    graph,

    ranking

  )

}


export function getTasteRecommendedRankings(

  graph: TasteGraph,

  rankings: Ranking[]

): TasteRecommendation[] {


  return (

    rankings

      .filter(

        ranking =>

          isNewRecommendation(

            graph,

            ranking

          )

      )

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